import { Topic } from '../types';

// API endpoints
export const WIKIPEDIA_API_ENDPOINT = {
  en: 'https://en.wikipedia.org/w/api.php',
  tr: 'https://tr.wikipedia.org/w/api.php',
};

// Default topics
export const DEFAULT_TOPICS = ['History', 'Science', 'Technology', 'Art', 'Geography'];

// Default language will be determined by the device locale,
// but we'll fallback to English if the locale is not supported
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'tr'];

// Storage keys
export const STORAGE_KEYS = {
  APP_PREFIX: 'vikitok',
  USER_PREFERENCES: 'user_preferences',
  USER_ID: 'user_id',
};

// Article fetch limits
export const ARTICLE_FETCH_LIMIT = 50;

// Default thumbnail images for topics
export const DEFAULT_THUMBNAILS: Record<Topic, string> = {
  'History': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Acropolis_of_Athens_01361.jpg/500px-Acropolis_of_Athens_01361.jpg',
  'Science': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Hubble_ultra_deep_field.jpg/500px-Hubble_ultra_deep_field.jpg',
  'Technology': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Computer-chip-circuit-board-technology-background-footage-099931712_prevstill.jpeg/500px-Computer-chip-circuit-board-technology-background-footage-099931712_prevstill.jpeg',
  'Art': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/500px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  'Geography': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/500px-The_Earth_seen_from_Apollo_17.jpg',
};

// Default thumbnail for articles without a specific topic
export const DEFAULT_THUMBNAIL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/500px-Wikipedia-logo-v2.svg.png'; 