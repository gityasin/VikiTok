import supabase from './supabaseClient';
import { UserLike } from '../types';
import { getUserId } from '../utils/userId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

// Local storage keys
const LIKES_STORAGE_KEY = `${STORAGE_KEYS.APP_PREFIX}_likes`;

class LikeService {
  /**
   * Gets likes from local storage
   * @returns A promise that resolves to an array of article IDs
   */
  private async getLikesFromStorage(userId: string): Promise<string[]> {
    try {
      const likesJson = await AsyncStorage.getItem(`${LIKES_STORAGE_KEY}_${userId}`);
      return likesJson ? JSON.parse(likesJson) : [];
    } catch (error) {
      console.error('Error getting likes from storage:', error);
      return [];
    }
  }

  /**
   * Saves likes to local storage
   * @param userId The user ID
   * @param likes The array of article IDs
   */
  private async saveLikesToStorage(userId: string, likes: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`${LIKES_STORAGE_KEY}_${userId}`, JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving likes to storage:', error);
    }
  }

  /**
   * Adds a like to Supabase or local storage if Supabase fails
   * @param articleId The ID of the article to like
   * @returns A promise that resolves when the like is added
   */
  async addLike(articleId: string): Promise<void> {
    try {
      const userId = await getUserId();
      
      try {
        // Try to add the like to Supabase first
        const { error } = await supabase
          .from('likes')
          .insert([
            {
              article_id: articleId,
              user_id: userId,
            },
          ]);
        
        if (error) {
          throw error;
        }
      } catch (supabaseError) {
        console.warn('Supabase error, falling back to local storage:', supabaseError);
        
        // Fallback to local storage
        const likes = await this.getLikesFromStorage(userId);
        if (!likes.includes(articleId)) {
          likes.push(articleId);
          await this.saveLikesToStorage(userId, likes);
        }
      }
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }
  
  /**
   * Removes a like from Supabase or local storage if Supabase fails
   * @param articleId The ID of the article to unlike
   * @returns A promise that resolves when the like is removed
   */
  async removeLike(articleId: string): Promise<void> {
    try {
      const userId = await getUserId();
      
      try {
        // Try to remove the like from Supabase first
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ article_id: articleId, user_id: userId });
        
        if (error) {
          throw error;
        }
      } catch (supabaseError) {
        console.warn('Supabase error, falling back to local storage:', supabaseError);
        
        // Fallback to local storage
        const likes = await this.getLikesFromStorage(userId);
        const updatedLikes = likes.filter(id => id !== articleId);
        await this.saveLikesToStorage(userId, updatedLikes);
      }
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  }
  
  /**
   * Checks if an article is liked by the user in Supabase or local storage
   * @param articleId The ID of the article to check
   * @returns A promise that resolves to a boolean indicating if the article is liked
   */
  async isLiked(articleId: string): Promise<boolean> {
    try {
      const userId = await getUserId();
      
      try {
        // Try to check if the article is liked in Supabase first
        const { data, error } = await supabase
          .from('likes')
          .select('id')
          .match({ article_id: articleId, user_id: userId })
          .single();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the error code for no rows returned
          throw error;
        }
        
        return !!data;
      } catch (supabaseError) {
        console.warn('Supabase error, falling back to local storage:', supabaseError);
        
        // Fallback to local storage
        const likes = await this.getLikesFromStorage(userId);
        return likes.includes(articleId);
      }
    } catch (error) {
      console.error('Error checking if article is liked:', error);
      return false;
    }
  }
  
  /**
   * Gets all likes for a user from Supabase or local storage
   * @returns A promise that resolves to an array of article IDs
   */
  async getAllLikes(): Promise<string[]> {
    try {
      const userId = await getUserId();
      
      try {
        // Try to get all likes from Supabase first
        const { data, error } = await supabase
          .from('likes')
          .select('article_id')
          .eq('user_id', userId);
        
        if (error) {
          throw error;
        }
        
        return data?.map((like: { article_id: string }) => like.article_id) || [];
      } catch (supabaseError) {
        console.warn('Supabase error, falling back to local storage:', supabaseError);
        
        // Fallback to local storage
        return await this.getLikesFromStorage(userId);
      }
    } catch (error) {
      console.error('Error getting all likes:', error);
      return [];
    }
  }
}

export default new LikeService(); 