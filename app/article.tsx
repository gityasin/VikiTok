import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from '../src/i18n';
import articleService from '../src/services/articleService';
import usePreferenceStore from '../src/stores/preferenceStore';
import useLikeStore from '../src/stores/likeStore';
import { Article } from '../src/types';
import { DEFAULT_THUMBNAIL, DEFAULT_THUMBNAILS } from '../src/constants';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { preferences } = usePreferenceStore();
  const { likeArticle, unlikeArticle, isArticleLiked } = useLikeStore();
  const insets = useSafeAreaInsets();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isLiked = article ? isArticleLiked(article.id) : false;
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError(i18n.t('article.idMissing'));
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching article with ID: ${id}`);
        
        // Check if the ID is a numeric page ID or a title
        const isNumericId = /^\d+$/.test(id);
        
        let articleObj: Article;
        
        if (isNumericId) {
          // If it's a numeric ID, use it directly
          console.log(`Using numeric page ID: ${id}`);
          
          // Fetch the full article content
          const content = await articleService.getArticleContent(id, preferences.language);
          
          // Fetch additional details to get the title and image
          const details = await articleService.getArticleDetails(id, preferences.language);
          
          // Construct the article URL
          const articleUrl = `https://${preferences.language}.wikipedia.org/wiki/?curid=${id}`;
          
          articleObj = {
            id: id,
            title: details.title || id,
            content: content,
            snippet: details.snippet || '',
            imageUrl: details.imageUrl || DEFAULT_THUMBNAIL,
            language: preferences.language,
            topics: [],
            url: articleUrl,
            hasOriginalImage: !!details.imageUrl && !details.imageUrl.includes(DEFAULT_THUMBNAIL) && !Object.values(DEFAULT_THUMBNAILS).includes(details.imageUrl)
          };
        } else {
          // If it's a title, decode it first
          const decodedTitle = decodeURIComponent(id);
          console.log(`Using title: ${decodedTitle}`);
          
          // Fetch the full article content
          const content = await articleService.getArticleContent(decodedTitle, preferences.language);
          
          // Fetch additional details to get the image
          const details = await articleService.getArticleDetails(decodedTitle, preferences.language);
          
          // Construct the article URL
          const articleUrl = `https://${preferences.language}.wikipedia.org/wiki/${encodeURIComponent(decodedTitle.replace(/ /g, '_'))}`;
          
          articleObj = {
            id: decodedTitle, // Use the title as the ID
            title: decodedTitle.replace(/_/g, ' '), // Replace underscores with spaces for better display
            content: content,
            snippet: details.snippet || '',
            imageUrl: details.imageUrl || DEFAULT_THUMBNAIL,
            language: preferences.language,
            topics: [],
            url: articleUrl,
            hasOriginalImage: !!details.imageUrl && !details.imageUrl.includes(DEFAULT_THUMBNAIL) && !Object.values(DEFAULT_THUMBNAILS).includes(details.imageUrl)
          };
        }
        
        console.log(`Article fetched: ${articleObj.title}`);
        setArticle(articleObj);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(i18n.t('article.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, preferences.language]);
  
  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!article) return;
    
    if (isLiked) {
      await unlikeArticle(article.id);
    } else {
      await likeArticle(article.id);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar style="light" />
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonBackground} />
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article?.title || i18n.t('article.loading')}
        </Text>
        {article && (
          <TouchableOpacity onPress={handleLikeToggle} style={styles.likeButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? 'red' : 'white'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{i18n.t('article.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>{i18n.t('common.goBack')}</Text>
          </TouchableOpacity>
        </View>
      ) : article ? (
        <ScrollView style={styles.scrollView}>
          {article.imageUrl && (
            <Image source={{ uri: article.imageUrl }} style={styles.image} />
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.articleContent}>{article.content}</Text>
            
            <TouchableOpacity 
              style={styles.openWikipediaButton}
              onPress={() => router.push(article.url as any)}
            >
              <Text style={styles.openWikipediaText}>{i18n.t('article.openWikipedia')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
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
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  likeButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  articleContent: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  openWikipediaButton: {
    marginTop: 24,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 30,
  },
  openWikipediaText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 