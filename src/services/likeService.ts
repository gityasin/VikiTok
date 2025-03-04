import supabase from './supabaseClient';
import { UserLike } from '../types';
import { getUserId } from '../utils/userId';

class LikeService {
  /**
   * Adds a like to Supabase
   * @param articleId The ID of the article to like
   * @returns A promise that resolves when the like is added
   */
  async addLike(articleId: string): Promise<void> {
    try {
      const userId = await getUserId();
      
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
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }
  
  /**
   * Removes a like from Supabase
   * @param articleId The ID of the article to unlike
   * @returns A promise that resolves when the like is removed
   */
  async removeLike(articleId: string): Promise<void> {
    try {
      const userId = await getUserId();
      
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ article_id: articleId, user_id: userId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  }
  
  /**
   * Checks if an article is liked by the user
   * @param articleId The ID of the article to check
   * @returns A promise that resolves to a boolean indicating if the article is liked
   */
  async isLiked(articleId: string): Promise<boolean> {
    try {
      const userId = await getUserId();
      
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
    } catch (error) {
      console.error('Error checking if article is liked:', error);
      return false;
    }
  }
  
  /**
   * Gets all likes for a user
   * @returns A promise that resolves to an array of article IDs
   */
  async getAllLikes(): Promise<string[]> {
    try {
      const userId = await getUserId();
      
      const { data, error } = await supabase
        .from('likes')
        .select('article_id')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      return data?.map((like: { article_id: string }) => like.article_id) || [];
    } catch (error) {
      console.error('Error getting all likes:', error);
      return [];
    }
  }
}

export default new LikeService(); 