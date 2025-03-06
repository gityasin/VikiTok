import { create } from 'zustand';
import { Article, Language, Topic } from '../types';
import articleService from '../services/articleService';

interface ArticleState {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  fetchArticles: (language: Language, topics: Topic[], offset?: number, zappingMode?: boolean) => Promise<void>;
  appendArticles: (newArticles: Article[]) => void;
  clearArticles: () => void;
}

const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  isLoading: false,
  error: null,
  
  fetchArticles: async (language: Language, topics: Topic[], offset = 0, zappingMode = false) => {
    try {
      set({ isLoading: true, error: null });
      
      // If offset is 0, we're fetching the initial articles, so clear the existing ones
      if (offset === 0) {
        set({ articles: [] });
      }
      
      const newArticles = await articleService.fetchArticles(language, topics, offset, zappingMode);
      
      // Append the new articles to the existing ones
      set((state) => ({
        articles: offset === 0 ? newArticles : [...state.articles, ...newArticles],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  appendArticles: (newArticles: Article[]) => {
    set((state) => ({
      articles: [...state.articles, ...newArticles],
    }));
  },
  
  clearArticles: () => {
    set({ articles: [] });
  },
}));

export default useArticleStore; 