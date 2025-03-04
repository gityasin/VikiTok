# VikiTok Project Structure

## Root
- `app.json`: Expo configuration file
- `package.json`: Node.js package configuration
- `babel.config.js`: Babel configuration for Expo and React Native
- `index.js`: Entry point for the application using Expo Router
- `tsconfig.json`: TypeScript configuration
- `README.md`: Project documentation

## App (Expo Router)
- `app/_layout.tsx`: Root layout component for Expo Router
- `app/index.tsx`: Main feed screen
- `app/settings.tsx`: Settings screen for language selection
- `app/topics.tsx`: Topics selection screen

## Source Code
- `src/components/`: React components
  - `ArticleCard.tsx`: Component for displaying a single article

- `src/constants/`: Application constants
  - `index.ts`: API endpoints, default topics, supported languages, etc.

- `src/hooks/`: Custom React hooks (to be implemented)

- `src/i18n/`: Internationalization
  - `index.ts`: i18n configuration
  - `en.ts`: English translations
  - `tr.ts`: Turkish translations

- `src/services/`: API and data services
  - `articleService.ts`: Service for fetching articles from Wikipedia API
  - `likeService.ts`: Service for managing article likes in Supabase
  - `preferenceService.ts`: Service for managing user preferences
  - `supabaseClient.ts`: Supabase client configuration

- `src/stores/`: Zustand state stores
  - `articleStore.ts`: Store for managing articles
  - `likeStore.ts`: Store for managing likes
  - `preferenceStore.ts`: Store for managing preferences

- `src/types/`: TypeScript type definitions
  - `index.ts`: Types for Article, UserPreference, UserLike, etc.

- `src/utils/`: Utility functions
  - `userId.ts`: Utility for generating and retrieving user ID
