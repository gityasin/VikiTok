import { create } from 'zustand';
import likeService from '../services/likeService';

interface LikeState {
  likedArticles: string[];
  isLoading: boolean;
  error: string | null;
  loadLikes: () => Promise<void>;
  likeArticle: (articleId: string) => Promise<void>;
  unlikeArticle: (articleId: string) => Promise<void>;
  isArticleLiked: (articleId: string) => boolean;
}

const useLikeStore = create<LikeState>((set, get) => ({
  likedArticles: [],
  isLoading: false,
  error: null,
  
  loadLikes: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const likedArticles = await likeService.getAllLikes();
      
      set({
        likedArticles,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  likeArticle: async (articleId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await likeService.addLike(articleId);
      
      set((state) => ({
        likedArticles: [...state.likedArticles, articleId],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  unlikeArticle: async (articleId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await likeService.removeLike(articleId);
      
      set((state) => ({
        likedArticles: state.likedArticles.filter((id) => id !== articleId),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  isArticleLiked: (articleId: string) => {
    return get().likedArticles.includes(articleId);
  },
}));

export default useLikeStore; 