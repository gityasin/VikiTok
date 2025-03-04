import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { i18n, setLocale } from '../src/i18n';
import useArticleStore from '../src/stores/articleStore';
import usePreferenceStore from '../src/stores/preferenceStore';
import useLikeStore from '../src/stores/likeStore';
import ArticleCard from '../src/components/ArticleCard';

function Feed() {
  const { articles, isLoading, error, fetchArticles, clearArticles } = useArticleStore();
  const { preferences, loadPreferences } = usePreferenceStore();
  const { loadLikes } = useLikeStore();
  const [refreshing, setRefreshing] = useState(false);
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

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchArticles(preferences.language, preferences.topics);
    setRefreshing(false);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoading && articles.length > 0) {
      fetchArticles(preferences.language, preferences.topics, articles.length);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('feed.title')}</Text>
        <View style={styles.headerButtons}>
          <Link href="/topics" asChild>
            <Ionicons name="list" size={24} color="black" style={styles.headerButton} />
          </Link>
          <Link href="/settings" asChild>
            <Ionicons name="settings-outline" size={24} color="black" style={styles.headerButton} />
          </Link>
        </View>
      </View>
      
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            {i18n.t('common.retry')}
          </Text>
        </View>
      ) : articles.length === 0 && !isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{i18n.t('feed.emptyState')}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCard article={item} />}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.footer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.footerText}>{i18n.t('feed.loadMore')}</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
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
    color: 'blue',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export { Feed };
export default Feed; 