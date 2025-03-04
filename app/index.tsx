import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { i18n, setLocale } from '../src/i18n';
import useArticleStore from '../src/stores/articleStore';
import usePreferenceStore from '../src/stores/preferenceStore';
import useLikeStore from '../src/stores/likeStore';
import ArticleCard from '../src/components/ArticleCard';
import TikTokPager from '../src/components/TikTokPager';

const { height } = Dimensions.get('window');

function Feed() {
  const { articles, isLoading, error, fetchArticles, clearArticles } = useArticleStore();
  const { preferences, loadPreferences } = usePreferenceStore();
  const { loadLikes } = useLikeStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [prevLanguage, setPrevLanguage] = useState<string | null>(null);

  // Load preferences and likes on mount
  useEffect(() => {
    const initialize = async () => {
      await loadPreferences();
      await loadLikes();
    };
    
    initialize();
  }, []);

  // Fetch articles when preferences change
  useEffect(() => {
    if (preferences.language && preferences.topics.length > 0) {
      // Update i18n locale when language changes
      setLocale(preferences.language);
      
      // If language has changed, clear articles first
      if (prevLanguage !== null && prevLanguage !== preferences.language) {
        clearArticles();
      }
      
      // Update previous language
      setPrevLanguage(preferences.language);
      
      // Fetch articles in the selected language
      fetchArticles(preferences.language, preferences.topics);
    }
  }, [preferences.language, preferences.topics]);

  // Handle page change
  const handlePageChange = (position: number) => {
    setCurrentPage(position);
    
    // Load more articles when we're close to the end
    if (position >= articles.length - 2 && !isLoading && articles.length > 0) {
      fetchArticles(preferences.language, preferences.topics, articles.length);
    }
  };

  // Prepare children for TikTokPager
  const renderPagerContent = () => {
    const pagerChildren = [];
    
    // Add article cards
    articles.forEach((article, index) => {
      pagerChildren.push(
        <View key={article.id} style={styles.pageContainer}>
          <ArticleCard article={article} active={index === currentPage} />
        </View>
      );
    });
    
    // Add loading indicator if needed
    if (isLoading) {
      pagerChildren.push(
        <View key="loading" style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{i18n.t('feed.loadMore')}</Text>
        </View>
      );
    }
    
    return pagerChildren;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('feed.title')}</Text>
        <View style={styles.headerButtons}>
          <Link href="/topics" asChild>
            <Ionicons name="list" size={24} color="white" style={styles.headerButton} />
          </Link>
          <Link href="/settings" asChild>
            <Ionicons name="settings-outline" size={24} color="white" style={styles.headerButton} />
          </Link>
        </View>
      </View>
      
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => fetchArticles(preferences.language, preferences.topics)}>
            {i18n.t('common.retry')}
          </Text>
        </View>
      ) : articles.length === 0 && !isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{i18n.t('feed.emptyState')}</Text>
        </View>
      ) : (
        <TikTokPager
          initialPage={0}
          onPageSelected={handlePageChange}
        >
          {renderPagerContent()}
        </TikTokPager>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: RNStatusBar.currentHeight || 50,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 16,
    color: 'white',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  pageContainer: {
    flex: 1,
  },
  loadingContainer: {
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: 'white',
  },
});

export { Feed };
export default Feed; 