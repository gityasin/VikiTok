import { create } from 'zustand';
import { UserPreference, Language, Topic } from '../types';
import preferenceService from '../services/preferenceService';
import { DEFAULT_LANGUAGE, DEFAULT_TOPICS } from '../constants';

interface PreferenceState {
  preferences: UserPreference;
  isLoading: boolean;
  error: string | null;
  loadPreferences: () => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
  setTopics: (topics: Topic[]) => Promise<void>;
  setZappingMode: (zappingMode: boolean) => Promise<void>;
}

const usePreferenceStore = create<PreferenceState>((set, get) => ({
  preferences: {
    language: DEFAULT_LANGUAGE,
    topics: DEFAULT_TOPICS,
    zappingMode: false,
  },
  isLoading: false,
  error: null,
  
  loadPreferences: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const preferences = await preferenceService.getPreferences();
      
      set({
        preferences,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  setLanguage: async (language: Language) => {
    try {
      set({ isLoading: true, error: null });
      
      const newPreferences = {
        ...get().preferences,
        language,
      };
      
      await preferenceService.savePreferences(newPreferences);
      
      set({
        preferences: newPreferences,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  setTopics: async (topics: Topic[]) => {
    try {
      set({ isLoading: true, error: null });
      
      const newPreferences = {
        ...get().preferences,
        topics,
      };
      
      await preferenceService.savePreferences(newPreferences);
      
      set({
        preferences: newPreferences,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  setZappingMode: async (zappingMode: boolean) => {
    try {
      set({ isLoading: true, error: null });
      
      const newPreferences = {
        ...get().preferences,
        zappingMode,
      };
      
      await preferenceService.savePreferences(newPreferences);
      
      set({
        preferences: newPreferences,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
}));

export default usePreferenceStore; 