import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
// Import the crypto polyfill before uuid
import './cryptoPolyfill';
import { v4 as uuidv4 } from 'uuid';

// Fallback function to generate a simple ID if uuid fails
const generateFallbackId = (): string => {
  return `fallback-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

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
      let newUserId;
      try {
        newUserId = uuidv4();
      } catch (uuidError) {
        console.warn('Error generating UUID, using fallback:', uuidError);
        newUserId = generateFallbackId();
      }
      
      try {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, newUserId);
      } catch (storeError) {
        console.warn('Error storing user ID:', storeError);
        // Continue with the generated ID even if we can't store it
      }
      
      return newUserId;
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    // If there's an error, generate a fallback ID
    try {
      return uuidv4();
    } catch (uuidError) {
      console.warn('Error generating UUID fallback, using simple ID:', uuidError);
      return generateFallbackId();
    }
  }
}; 