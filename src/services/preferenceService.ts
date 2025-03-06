import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreference, Language } from '../types';
import { STORAGE_KEYS, DEFAULT_LANGUAGE, DEFAULT_TOPICS, SUPPORTED_LANGUAGES } from '../constants';
import * as Localization from 'expo-localization';

class PreferenceService {
  /**
   * Gets the user's preferences from AsyncStorage
   * @returns A promise that resolves to the user's preferences
   */
  async getPreferences(): Promise<UserPreference> {
    try {
      const storedPreferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
      
      // If no preferences are stored, create default preferences based on device locale
      const defaultPreferences = this.createDefaultPreferences();
      await this.savePreferences(defaultPreferences);
      
      return defaultPreferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      // Return default preferences if there's an error
      return this.createDefaultPreferences();
    }
  }
  
  /**
   * Saves the user's preferences to AsyncStorage
   * @param preferences The preferences to save
   * @returns A promise that resolves when the preferences are saved
   */
  async savePreferences(preferences: UserPreference): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }
  
  /**
   * Creates default preferences based on the device locale
   * @returns The default preferences
   */
  private createDefaultPreferences(): UserPreference {
    // Always use English as the default language regardless of device locale
    const language: Language = DEFAULT_LANGUAGE;
    
    return {
      language,
      topics: DEFAULT_TOPICS,
      zappingMode: false,
    };
  }
}

export default new PreferenceService(); 