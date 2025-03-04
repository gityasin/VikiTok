import { Article, Language, Topic } from '../types';
import { WIKIPEDIA_API_ENDPOINT, ARTICLE_FETCH_LIMIT } from '../constants';

class ArticleService {
  /**
   * Fetches articles from the Wikipedia API based on language, topics, and offset
   * @param language The language to fetch articles in
   * @param topics The topics to filter articles by
   * @param offset The offset for pagination
   * @returns A promise that resolves to an array of articles
   */
  async fetchArticles(language: Language, topics: Topic[], offset: number = 0): Promise<Article[]> {
    try {
      // If no topics are selected, use a default search term
      const searchTerm = topics.length > 0 ? topics[Math.floor(Math.random() * topics.length)] : 'featured';
      
      // Construct the API URL for the opensearch endpoint
      const apiUrl = `${WIKIPEDIA_API_ENDPOINT[language]}?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=${ARTICLE_FETCH_LIMIT}&namespace=0&format=json&origin=*`;
      
      // Fetch the search results
      const response = await fetch(apiUrl);
      
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
      
      // Map the results to our Article type
      const articles: Article[] = await Promise.all(
        titles.map(async (title: string, index: number) => {
          // Extract the page ID from the URL
          const url = urls[index];
          const pageId = this.extractPageIdFromUrl(url);
          
          // Fetch additional details for the article
          const details = await this.getArticleDetails(pageId, language);
          
          return {
            id: pageId,
            title,
            content: details.content || '',
            snippet: details.snippet || '',
            imageUrl: details.imageUrl,
            language,
            topics: [searchTerm],
            url
          };
        })
      );
      
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
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
   * @param pageId The page ID
   * @param language The language
   * @returns A promise that resolves to an object with content, snippet, and imageUrl
   */
  private async getArticleDetails(pageId: string, language: Language): Promise<{ content: string, snippet: string, imageUrl?: string }> {
    try {
      // Construct the API URL for the query endpoint
      const apiUrl = `${WIKIPEDIA_API_ENDPOINT[language]}?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(pageId)}&pithumbsize=500&format=json&origin=*`;
      
      const response = await fetch(apiUrl);
      
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
      const imageUrl = page.thumbnail?.source;
      
      return { content, snippet, imageUrl };
    } catch (error) {
      console.error('Error fetching article details:', error);
      return { content: '', snippet: '' };
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
}

export default new ArticleService(); 