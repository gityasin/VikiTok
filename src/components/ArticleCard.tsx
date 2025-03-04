import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Article } from '../types';
import { i18n } from '../i18n';
import useLikeStore from '../stores/likeStore';

interface ArticleCardProps {
  article: Article;
}

const { height } = Dimensions.get('window');

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
    <View style={styles.container}>
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>VikiTok</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.snippet}>{article.snippet}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? 'red' : 'black'}
            />
            <Text style={styles.actionText}>
              {isLiked ? i18n.t('article.unlike') : i18n.t('article.like')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="black" />
            <Text style={styles.actionText}>{i18n.t('article.share')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => Linking.openURL(article.url)}
            style={styles.actionButton}
          >
            <Ionicons name="open-outline" size={24} color="black" />
            <Text style={styles.actionText}>{i18n.t('article.readMore')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height - 100, // Adjust for header
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '50%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  snippet: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default ArticleCard; 