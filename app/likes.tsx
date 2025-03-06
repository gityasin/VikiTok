import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useLikeStore from '../src/stores/likeStore';
import { Article } from '../src/types';
import { i18n } from '../src/i18n';
import articleService from '../src/services/articleService';
import usePreferenceStore from '../src/stores/preferenceStore';
import ArticleCard from '../src/components/ArticleCard';
import TikTokPager from '../src/components/TikTokPager';

export default function LikesScreen() {
  const router = useRouter();
  const { likedArticles, loadLikes, unlikeArticle, isLoading: likesLoading } = useLikeStore();
  const { preferences } = usePreferenceStore();
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchLikedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load likes from store
        await loadLikes();
        
        // Fetch article details for each liked article
        const likedArticleDetails = await Promise.all(
          likedArticles.map(async (articleId) => {
            try {
              // Extract the title from the article ID (which is the URL-encoded title)
              const title = decodeURIComponent(articleId.replace(/_/g, ' '));
              
              // Get article details including image
              const details = await articleService.getArticleDetails(articleId, preferences.language);
              
              // Create a complete article object
              return {
                id: articleId,
                title,
                content: details.content,
                snippet: details.snippet,
                imageUrl: details.imageUrl,
                language: preferences.language,
                topics: [],
                url: `https://${preferences.language}.wikipedia.org/wiki/${articleId}`,
                hasOriginalImage: !!details.imageUrl
              } as Article;
            } catch (error) {
              console.error(`Error fetching details for article ${articleId}:`, error);
              return null;
            }
          })
        );
        
        // Filter out any null results
        setArticles(likedArticleDetails.filter(article => article !== null) as Article[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching liked articles:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };
    
    fetchLikedArticles();
  }, [likedArticles.length, preferences.language]);

  const handleUnlike = async (articleId: string) => {
    await unlikeArticle(articleId);
  };

  const handleArticlePress = (index: number) => {
    setSelectedArticleIndex(index);
  };

  const handleBackToList = () => {
    setSelectedArticleIndex(null);
  };

  const handlePageChange = (position: number) => {
    setCurrentPage(position);
  };

  const renderPagerContent = () => {
    if (!articles.length || selectedArticleIndex === null) return [];
    
    return articles.map((article, index) => (
      <View key={article.id} style={styles.pageContainer}>
        <ArticleCard article={article} active={index === currentPage} />
      </View>
    ));
  };

  const renderItem = ({ item, index }: { item: Article, index: number }) => (
    <TouchableOpacity 
      style={styles.articleCard}
      onPress={() => handleArticlePress(index)}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleSnippet}>{item.snippet}</Text>
        <TouchableOpacity 
          style={styles.unlikeButton}
          onPress={() => handleUnlike(item.id)}
        >
          <Text style={styles.unlikeButtonText}>{i18n.t('article.unlike')}</Text>
        </TouchableOpacity>
      </View>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.articleImage} 
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  // If an article is selected, show it in the TikTokPager
  if (selectedArticleIndex !== null) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <View style={[styles.pagerHeader, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
            <View style={styles.backButtonBackground} />
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{i18n.t('likes.title')}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <TikTokPager
          initialPage={selectedArticleIndex}
          onPageSelected={handlePageChange}
        >
          {renderPagerContent()}
        </TikTokPager>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar style="dark" />
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('likes.title')}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {isLoading || likesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>{i18n.t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => loadLikes()}
          >
            <Text style={styles.retryButtonText}>{i18n.t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18n.t('likes.emptyState')}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  pagerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    zIndex: 10,
    position: 'relative',
  },
  backButtonBackground: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    padding: 16,
  },
  articleCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  articleContent: {
    flex: 1,
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleSnippet: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  unlikeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  unlikeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  articleImage: {
    width: 100,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  pageContainer: {
    flex: 1,
  },
}); 