import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Article } from '../types';
import { i18n } from '../i18n';
import useLikeStore from '../stores/likeStore';

interface ArticleCardProps {
  article: Article;
  active?: boolean;
}

const { width, height } = Dimensions.get('window');

const ArticleCard: React.FC<ArticleCardProps> = ({ article, active = false }) => {
  const { likeArticle, unlikeArticle, isArticleLiked } = useLikeStore();
  const isLiked = isArticleLiked(article.id);

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (isLiked) {
      await unlikeArticle(article.id);
    } else {
      await likeArticle(article.id);
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      await Sharing.shareAsync(article.url, {
        dialogTitle: i18n.t('article.shareMessage') + article.title,
        mimeType: 'text/plain',
        UTI: 'public.plain-text',
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>VikiTok</Text>
        </View>
      )}
      
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.snippet}>{article.snippet}</Text>
          
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => Linking.openURL(article.url)}
          >
            <Text style={styles.readMoreText}>{i18n.t('article.readMore')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sideActions}>
          <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={32}
              color={isLiked ? 'red' : 'white'}
            />
            <Text style={styles.actionText}>
              {isLiked ? i18n.t('article.unlike') : i18n.t('article.like')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={32} color="white" />
            <Text style={styles.actionText}>{i18n.t('article.share')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => Linking.openURL(article.url)}
            style={styles.actionButton}
          >
            <Ionicons name="open-outline" size={32} color="white" />
            <Text style={styles.actionText}>{i18n.t('article.readMore')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#999',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  snippet: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  readMoreButton: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sideActions: {
    width: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default ArticleCard; 