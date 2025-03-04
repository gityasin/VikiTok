import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the user ID from SecureStore, or generates a new one if it doesn't exist
 * @returns A promise that resolves to the user ID
 */
export const getUserId = async (): Promise<string> => {
  try {
    // Try to get the user ID from SecureStore
    let userId = await SecureStore.getItemAsync(STORAGE_KEYS.USER_ID);
    
    // If the user ID doesn't exist, generate a new one and save it
    if (!userId) {
      const newUserId = uuidv4();
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, newUserId);
      return newUserId;
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    // If there's an error, generate a temporary UUID
    // This won't be persisted, but it's better than nothing
    return uuidv4();
  }
}; 