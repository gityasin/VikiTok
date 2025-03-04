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
  USER_PREFERENCES: 'user_preferences',
  USER_ID: 'user_id',
};

// Article fetch limits
export const ARTICLE_FETCH_LIMIT = 10; 