import { Article, Language, Topic } from '../types';
import { WIKIPEDIA_API_ENDPOINT, ARTICLE_FETCH_LIMIT, DEFAULT_THUMBNAILS, DEFAULT_THUMBNAIL } from '../constants';

// New interfaces for the Wikipedia API responses
interface WikiArticle {
  pageid: number;
  ns: number;
  title: string;
}

interface WikiQueryResponse {
  query: {
    categorymembers: WikiArticle[];
  };
  continue?: {
    cmcontinue: string;
  };
}

class ArticleService {
  /**
   * Fetches articles from the Wikipedia API based on language, topics, and offset
   * @param language The language to fetch articles in
   * @param topics The topics to filter articles by
   * @param offset The offset for pagination
   * @param zappingMode Whether to use zapping mode
   * @returns A promise that resolves to an array of articles
   */
  async fetchArticles(language: Language, topics: Topic[], offset: number = 0, zappingMode: boolean = false): Promise<Article[]> {
    try {
      let allArticles: Article[] = [];
      
      // If zapping mode is enabled, use the random articles API
      if (zappingMode) {
        allArticles = await this.fetchRandomArticles(language);
      } else if (topics.length > 0) {
        // For normal mode with selected topics, fetch articles from categories
        // Select a random topic from the user's selected topics
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        // Translate topic for Turkish if needed
        let searchTopic = randomTopic;
        if (language === 'tr') {
          // Map of common English topics to Turkish
          const topicTranslations: Record<string, string> = {
            'History': 'Tarih',
            'Science': 'Bilim',
            'Technology': 'Teknoloji',
            'Art': 'Sanat',
            'Geography': 'Coğrafya',
          };
          
          // Use translation if available, otherwise keep original
          searchTopic = topicTranslations[randomTopic] || randomTopic;
        }
        
        console.log(`Fetching articles for topic: ${searchTopic} in language: ${language}`);
        
        // Get related terms for the selected topic
        const relatedTerms = this.getRelatedTerms(searchTopic, language);
        console.log(`Related terms: ${JSON.stringify(relatedTerms)}`);
        
        // Get multiple random terms to fetch more diverse articles
        // Limit to 2 terms to reduce the number of parallel requests
        const selectedTerms = this.getMultipleRandomTerms(relatedTerms, 2);
        console.log(`Selected terms: ${JSON.stringify(selectedTerms)}`);
        
        // Try both approaches: category-based and search-based
        const articlePromises = [];
        
        // 1. Try category-based approach - limit to just one term to reduce load
        const categoryTerm = selectedTerms[0];
        // Format the category name properly - Wikipedia categories are case-sensitive
        // and need to be properly formatted
        const categoryName = language === 'en' 
          ? `Category:${categoryTerm}` 
          : `Kategori:${categoryTerm}`;
          
        console.log(`Trying category: ${categoryName}`);
        // Ensure ARTICLE_FETCH_LIMIT / 2 is an integer and reduce the limit
        const limit = Math.floor(ARTICLE_FETCH_LIMIT / 2);
        articlePromises.push(this.getRandomArticlesInCategory(categoryName, limit, 1, language));
        
        // 2. Also try the search-based approach as fallback - just for one term
        articlePromises.push(this.fetchArticlesForTerm(categoryTerm, language));
        
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise<Article[]>((resolve) => {
          setTimeout(() => {
            console.log('Article fetching timed out, returning empty array');
            resolve([]);
          }, 15000); // 15 seconds timeout
        });
        
        // Race the article promises against the timeout
        const articleSets = await Promise.race([
          Promise.all(articlePromises),
          timeoutPromise.then(() => [])
        ]);
        
        // Combine all article sets and filter out empty ones
        if (Array.isArray(articleSets) && articleSets.length > 0) {
          allArticles = articleSets.filter(set => Array.isArray(set) && set.length > 0).flat();
          console.log(`Total articles fetched: ${allArticles.length}`);
        }
        
        // If we still don't have any articles, fall back to the old method with a single term
        if (allArticles.length === 0) {
          console.log('Falling back to search-based article fetching');
          const fallbackPromise = this.fetchArticlesForTerm(selectedTerms[0], language);
          const fallbackArticles = await Promise.race([
            fallbackPromise,
            timeoutPromise
          ]);
          
          if (Array.isArray(fallbackArticles)) {
            allArticles = fallbackArticles;
          }
        }
      } else {
        // If no topics are selected, fetch featured articles
        const featuredTerm = language === 'tr' ? 'öne çıkan' : 'featured';
        const relatedTerms = this.getRelatedTerms(featuredTerm, language);
        // Limit to just one term to reduce load
        const selectedTerms = this.getMultipleRandomTerms(relatedTerms, 1);
        
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise<Article[]>((resolve) => {
          setTimeout(() => {
            console.log('Featured article fetching timed out, returning empty array');
            resolve([]);
          }, 10000); // 10 seconds timeout
        });
        
        // Fetch articles for the selected term with timeout
        const articlePromise = this.fetchArticlesForTerm(selectedTerms[0], language);
        const articles = await Promise.race([articlePromise, timeoutPromise]);
        
        if (Array.isArray(articles)) {
          allArticles = articles;
        }
      }
      
      // First, sort articles to prioritize those with original thumbnails
      allArticles.sort((a, b) => {
        if (a.hasOriginalImage && !b.hasOriginalImage) return -1;
        if (!a.hasOriginalImage && b.hasOriginalImage) return 1;
        return 0;
      });
      
      // Limit to the requested number of articles
      allArticles = allArticles.slice(0, ARTICLE_FETCH_LIMIT);
      
      // Randomize the order of articles
      return this.shuffleArray(allArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      return []; // Return empty array instead of throwing to prevent app crashes
    }
  }
  
  /**
   * Fetches completely random articles using the random API
   * @param language The language
   * @returns A promise that resolves to an array of articles
   */
  private async fetchRandomArticles(language: Language): Promise<Article[]> {
    try {
      // Ensure ARTICLE_FETCH_LIMIT is an integer and reduce the limit for better performance
      const intLimit = Math.min(Math.floor(ARTICLE_FETCH_LIMIT), 20);
      
      // Construct the API URL for the random endpoint
      const apiUrl = `${WIKIPEDIA_API_ENDPOINT[language]}?action=query&format=json&list=random&rnlimit=${intLimit.toString()}&rnnamespace=0&origin=*`;
      
      // Fetch the random articles with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch random articles: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extract the random articles
        const randomArticles = data.query?.random || [];
        
        // Limit the number of articles to process to reduce load
        const articlesToProcess = randomArticles.slice(0, Math.min(10, randomArticles.length));
        
        console.log(`Processing ${articlesToProcess.length} random articles`);
        
        // Add a timeout for article details fetching
        const detailsTimeoutPromise = new Promise<Article[]>((resolve) => {
          setTimeout(() => {
            console.log('Random article details fetching timed out, returning empty array');
            resolve([]);
          }, 15000); // 15 seconds timeout
        });
        
        // Map the results to our Article type with timeout
        const articlesPromise = Promise.all(
          articlesToProcess.map(async (article: any) => {
            const title = article.title;
            const pageId = article.id.toString();
            
            // Fetch additional details for the article
            const details = await this.getArticleDetails(title, language);
            
            // Construct the URL
            const baseUrl = language === 'en' ? 'https://en.wikipedia.org/wiki/' : 'https://tr.wikipedia.org/wiki/';
            const url = `${baseUrl}${encodeURIComponent(title.replace(/ /g, '_'))}`;
            
            return {
              id: title, // Use title as ID for better compatibility
              title: title,
              content: details.content || '',
              snippet: details.snippet || '',
              imageUrl: details.imageUrl,
              language,
              topics: ['random'],
              url,
              hasOriginalImage: !!details.imageUrl && !details.imageUrl.includes(DEFAULT_THUMBNAIL) && !Object.values(DEFAULT_THUMBNAILS).includes(details.imageUrl)
            };
          })
        );
        
        const articles = await Promise.race([articlesPromise, detailsTimeoutPromise]);
        console.log(`Converted ${articles.length} random articles`);
        return articles;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Random article fetch aborted due to timeout');
        } else {
          console.error('Error fetching random articles:', error);
        }
        return [];
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error in fetchRandomArticles:', error);
      return [];
    }
  }
  
  /**
   * Fetches random articles from a specific category
   * @param categoryName The category name (e.g., "Category:History")
   * @param limit The number of articles to fetch per request
   * @param maxRequests The maximum number of requests to make
   * @param language The language
   * @returns A promise that resolves to an array of articles
   */
  private async getRandomArticlesInCategory(
    categoryName: string,
    limit: number = 10,
    maxRequests: number = 2,
    language: Language
  ): Promise<Article[]> {
    console.log(`Getting random articles in category: ${categoryName}`);
    const baseUrl = WIKIPEDIA_API_ENDPOINT[language];
    let allWikiArticles: WikiArticle[] = [];

    // Generate a few random timestamps to get different sets of articles
    const timestamps: string[] = [];
    const now = new Date();
    const startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // One year ago
    
    // Generate just 2 different random timestamps to reduce load
    for (let i = 0; i < 2; i++) {
      const randomTimestamp = new Date(
        startDate.getTime() +
        Math.random() * (now.getTime() - startDate.getTime())
      );
      timestamps.push(randomTimestamp.toISOString().replace(/[-:.]/g, "").slice(0, 14));
    }

    // Try different approaches to get truly random articles - but limit the number of requests
    const fetchPromises = [];

    // Approach 1: Use random timestamps with cmstart parameter - just use one timestamp
    const timestampStr = timestamps[0];
    // Ensure limit is an integer to avoid "badinteger" errors
    const intLimit = Math.floor(limit);
    
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      list: "categorymembers",
      cmtitle: categoryName,
      cmlimit: intLimit.toString(), // Convert to string after ensuring it's an integer
      cmprop: "ids|title",
      cmsort: "timestamp",
      cmstart: timestampStr,
      origin: "*", // For CORS
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log(`Fetching from URL with timestamp: ${url}`);

    fetchPromises.push(
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: WikiQueryResponse) => {
          if (data.query && data.query.categorymembers) {
            console.log(`Found ${data.query.categorymembers.length} articles with timestamp approach`);
            return data.query.categorymembers;
          }
          return [];
        })
        .catch(error => {
          console.error("Error fetching articles with timestamp:", error);
          return [];
        })
    );

    // Approach 2: Use random offsets with cmdir parameter - just use "newer" direction
    const direction = "newer";
    const dirParams = new URLSearchParams({
      action: "query",
      format: "json",
      list: "categorymembers",
      cmtitle: categoryName,
      cmlimit: intLimit.toString(),
      cmprop: "ids|title",
      cmdir: direction,
      origin: "*",
    });

    const dirUrl = `${baseUrl}?${dirParams.toString()}`;
    console.log(`Fetching from URL with direction ${direction}: ${dirUrl}`);

    fetchPromises.push(
      fetch(dirUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: WikiQueryResponse) => {
          if (data.query && data.query.categorymembers) {
            console.log(`Found ${data.query.categorymembers.length} articles with direction approach`);
            return data.query.categorymembers;
          }
          return [];
        })
        .catch(error => {
          console.error("Error fetching articles with direction:", error);
          return [];
        })
    );

    // Add a timeout to prevent infinite loading
    const timeoutPromise = new Promise<WikiArticle[]>((resolve) => {
      setTimeout(() => {
        console.log('Category article fetching timed out, returning empty array');
        resolve([]);
      }, 10000); // 10 seconds timeout
    });

    // Wait for all fetch operations to complete or timeout
    try {
      const results = await Promise.race([
        Promise.all(fetchPromises),
        timeoutPromise.then(() => [])
      ]);
      
      // Combine all results
      if (Array.isArray(results)) {
        for (const articles of results) {
          if (Array.isArray(articles)) {
            allWikiArticles.push(...articles);
          }
        }
      }
      
      console.log(`Total wiki articles found: ${allWikiArticles.length}`);
      
      // If no articles found, return empty array
      if (allWikiArticles.length === 0) {
        return [];
      }

      // Remove duplicates by page ID
      const uniqueArticles = Array.from(
        new Map(allWikiArticles.map(article => [article.pageid, article])).values()
      );
      
      console.log(`After removing duplicates: ${uniqueArticles.length} articles`);

      // Shuffle the articles to get a random selection
      const shuffledArticles = this.shuffleArray(uniqueArticles);

      // Limit the number of articles to convert to reduce load
      const articlesToConvert = shuffledArticles.slice(0, Math.min(10, limit));
      
      // Add a timeout for article details fetching
      const detailsTimeoutPromise = new Promise<Article[]>((resolve) => {
        setTimeout(() => {
          console.log('Article details fetching timed out, returning empty array');
          resolve([]);
        }, 15000); // 15 seconds timeout
      });

      // Convert WikiArticle to our Article type with timeout
      const articlesPromise = Promise.all(
        articlesToConvert.map(async (wikiArticle) => {
          const title = wikiArticle.title;
          const pageId = wikiArticle.pageid.toString();
          
          // Fetch additional details for the article
          const details = await this.getArticleDetails(title, language);
          
          // Construct the URL
          const baseUrl = language === 'en' ? 'https://en.wikipedia.org/wiki/' : 'https://tr.wikipedia.org/wiki/';
          const url = `${baseUrl}${encodeURIComponent(title.replace(/ /g, '_'))}`;
          
          return {
            id: title, // Use title as ID for better compatibility
            title,
            content: details.content || '',
            snippet: details.snippet || '',
            imageUrl: details.imageUrl,
            language,
            topics: [categoryName.replace(/^(Category:|Kategori:)/, '')],
            url,
            hasOriginalImage: !!details.imageUrl && !details.imageUrl.includes(DEFAULT_THUMBNAIL) && !Object.values(DEFAULT_THUMBNAILS).includes(details.imageUrl)
          };
        })
      );
      
      const articles = await Promise.race([articlesPromise, detailsTimeoutPromise]);
      
      console.log(`Converted ${articles.length} articles`);
      return articles;
    } catch (error) {
      console.error("Error in getRandomArticlesInCategory:", error);
      return [];
    }
  }
  
  /**
   * Fetches articles for a specific search term
   * @param searchTerm The search term
   * @param language The language
   * @returns A promise that resolves to an array of articles
   */
  private async fetchArticlesForTerm(searchTerm: string, language: Language): Promise<Article[]> {
    try {
      // Ensure ARTICLE_FETCH_LIMIT is an integer and reduce the limit for better performance
      const intLimit = Math.min(Math.floor(ARTICLE_FETCH_LIMIT), 20);
      
      // Construct the API URL for the opensearch endpoint
      const apiUrl = `${WIKIPEDIA_API_ENDPOINT[language]}?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=${intLimit.toString()}&namespace=0&format=json&origin=*`;
      
      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // The opensearch endpoint returns an array with 4 elements:
        // 0: the search term
        // 1: an array of titles
        // 2: an array of descriptions (usually empty)
        // 3: an array of URLs
        const titles = data[1] || [];
        const urls = data[3] || [];
        
        // Limit the number of articles to process to reduce load
        const maxArticles = Math.min(10, titles.length);
        const limitedTitles = titles.slice(0, maxArticles);
        const limitedUrls = urls.slice(0, maxArticles);
        
        console.log(`Processing ${limitedTitles.length} articles for term: ${searchTerm}`);
        
        // Add a timeout for article details fetching
        const detailsTimeoutPromise = new Promise<Article[]>((resolve) => {
          setTimeout(() => {
            console.log('Term article details fetching timed out, returning empty array');
            resolve([]);
          }, 15000); // 15 seconds timeout
        });
        
        // Map the results to our Article type with timeout
        const articlesPromise = Promise.all(
          limitedTitles.map(async (title: string, index: number) => {
            // Extract the page ID from the URL
            const url = limitedUrls[index];
            const pageId = this.extractPageIdFromUrl(url);
            
            // Fetch additional details for the article
            const details = await this.getArticleDetails(title, language);
            
            return {
              id: title, // Use title as ID for better compatibility
              title,
              content: details.content || '',
              snippet: details.snippet || '',
              imageUrl: details.imageUrl,
              language,
              topics: [searchTerm],
              url,
              hasOriginalImage: !!details.imageUrl && !details.imageUrl.includes(DEFAULT_THUMBNAIL) && !Object.values(DEFAULT_THUMBNAILS).includes(details.imageUrl)
            };
          })
        );
        
        const articles = await Promise.race([articlesPromise, detailsTimeoutPromise]);
        console.log(`Converted ${articles.length} articles for term: ${searchTerm}`);
        return articles;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log(`Term search fetch aborted due to timeout: ${searchTerm}`);
        } else {
          console.error(`Error fetching articles for term ${searchTerm}:`, error);
        }
        return [];
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error(`Error in fetchArticlesForTerm for ${searchTerm}:`, error);
      return [];
    }
  }
  
  /**
   * Gets multiple random terms from an array
   * @param terms The array of terms
   * @param count The number of terms to get
   * @returns An array of random terms
   */
  private getMultipleRandomTerms(terms: string[], count: number): string[] {
    const shuffled = this.shuffleArray(terms);
    return shuffled.slice(0, Math.min(count, terms.length));
  }
  
  /**
   * Extracts the page ID from a Wikipedia URL
   * @param url The Wikipedia URL
   * @returns The page ID
   */
  private extractPageIdFromUrl(url: string): string {
    // Wikipedia URLs are typically in the format: https://en.wikipedia.org/wiki/Title
    // We'll use the title as the ID for simplicity
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  
  /**
   * Fetches additional details for an article
   * @param pageId The page ID or title
   * @param language The language
   * @returns A promise that resolves to an object with content, snippet, imageUrl, and title
   */
  async getArticleDetails(pageId: string, language: Language): Promise<{ content: string, snippet: string, imageUrl?: string, title?: string }> {
    try {
      // Construct the API URL for the query endpoint
      const apiUrl = `${WIKIPEDIA_API_ENDPOINT[language]}?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(pageId)}&pithumbsize=500&format=json&origin=*`;
      
      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
      
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch article details: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extract the page data
        const pages = data.query?.pages || {};
        const pageIds = Object.keys(pages);
        
        if (pageIds.length === 0) {
          return { content: '', snippet: '' };
        }
        
        const page = pages[pageIds[0]];
        const content = page.extract || '';
        const snippet = content.substring(0, 150) + (content.length > 150 ? '...' : '');
        const title = page.title || pageId.replace(/_/g, ' ');
        
        // Get image URL or use default thumbnail
        let imageUrl = page.thumbnail?.source;
        
        // If no image is available, try to determine a default based on categories
        if (!imageUrl) {
          // Try to get categories for the article to determine a relevant default image
          const categories = page.categories || [];
          let defaultImageTopic: Topic | null = null;
          
          // Check if any category matches our default topics
          for (const topic of Object.keys(DEFAULT_THUMBNAILS)) {
            if (categories.some((cat: any) => cat.title.includes(topic))) {
              defaultImageTopic = topic as Topic;
              break;
            }
          }
          
          // Use topic-specific default or general default
          imageUrl = defaultImageTopic ? DEFAULT_THUMBNAILS[defaultImageTopic] : DEFAULT_THUMBNAIL;
        }
        
        return { content, snippet, imageUrl, title };
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Article details fetch aborted due to timeout');
        } else {
          console.error('Error fetching article details:', error);
        }
        // Return default thumbnail even in case of error
        return { content: '', snippet: '', imageUrl: DEFAULT_THUMBNAIL };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error in getArticleDetails:', error);
      // Return default thumbnail even in case of error
      return { content: '', snippet: '', imageUrl: DEFAULT_THUMBNAIL };
    }
  }
  
  /**
   * Fetches the full content of a specific article
   * @param pageId The page ID
   * @param language The language
   * @returns A promise that resolves to the article content
   */
  async getArticleContent(pageId: string, language: Language): Promise<string> {
    try {
      const details = await this.getArticleDetails(pageId, language);
      return details.content;
    } catch (error) {
      console.error('Error fetching article content:', error);
      throw error;
    }
  }
  
  /**
   * Generates related search terms for a given topic to get more diverse results
   * @param topic The main topic
   * @param language The language
   * @returns An array of related search terms
   */
  private getRelatedTerms(topic: string, language: Language): string[] {
    // Base set includes the original topic
    const terms = [topic];
    
    // English related terms
    if (language === 'en') {
      switch (topic) {
        case 'History':
          terms.push('Ancient civilizations', 'World War', 'Medieval', 'Renaissance', 
                    'Industrial Revolution', 'Cold War', 'American History', 'European History');
          break;
        case 'Science':
          terms.push('Physics', 'Chemistry', 'Biology', 'Astronomy', 'Quantum mechanics', 
                    'Scientific discoveries', 'Nobel Prize', 'Scientific method');
          break;
        case 'Technology':
          terms.push('Computer science', 'Artificial intelligence', 'Internet', 'Robotics', 
                    'Smartphone', 'Space technology', 'Biotechnology', 'Renewable energy');
          break;
        case 'Art':
          terms.push('Painting', 'Sculpture', 'Architecture', 'Photography', 'Modern art', 
                    'Renaissance art', 'Famous artists', 'Art movements');
          break;
        case 'Geography':
          terms.push('Mountains', 'Rivers', 'Oceans', 'Countries', 'Capitals', 
                    'Natural wonders', 'Climate', 'Continents');
          break;
        case 'featured':
          terms.push('Interesting facts', 'Did you know', 'Popular science', 'Current events');
          break;
      }
    } 
    // Turkish related terms
    else if (language === 'tr') {
      switch (topic) {
        case 'Tarih':
          terms.push('Antik uygarlıklar', 'Dünya Savaşı', 'Orta Çağ', 'Rönesans', 
                    'Sanayi Devrimi', 'Soğuk Savaş', 'Türk Tarihi', 'Osmanlı İmparatorluğu');
          break;
        case 'Bilim':
          terms.push('Fizik', 'Kimya', 'Biyoloji', 'Astronomi', 'Kuantum mekaniği', 
                    'Bilimsel keşifler', 'Nobel Ödülü', 'Bilimsel yöntem');
          break;
        case 'Teknoloji':
          terms.push('Bilgisayar bilimi', 'Yapay zeka', 'İnternet', 'Robotik', 
                    'Akıllı telefon', 'Uzay teknolojisi', 'Biyoteknoloji', 'Yenilenebilir enerji');
          break;
        case 'Sanat':
          terms.push('Resim', 'Heykel', 'Mimari', 'Fotoğrafçılık', 'Modern sanat', 
                    'Rönesans sanatı', 'Ünlü sanatçılar', 'Sanat akımları');
          break;
        case 'Coğrafya':
          terms.push('Dağlar', 'Nehirler', 'Okyanuslar', 'Ülkeler', 'Başkentler', 
                    'Doğal harikalar', 'İklim', 'Kıtalar');
          break;
        case 'öne çıkan':
          terms.push('İlginç bilgiler', 'Biliyor muydunuz', 'Popüler bilim', 'Güncel olaylar');
          break;
      }
    }
    
    return terms;
  }
  
  /**
   * Shuffles an array using the Fisher-Yates algorithm
   * @param array The array to shuffle
   * @returns The shuffled array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default new ArticleService(); 