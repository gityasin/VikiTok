# VikiTok Project Structure

## Root
- `app.json`: Expo configuration file
- `package.json`: Node.js package configuration
- `babel.config.js`: Babel configuration for Expo and React Native
- `index.ts`: Entry point for the application using Expo Router
- `App.tsx`: Root component with providers setup
- `tsconfig.json`: TypeScript configuration
- `README.md`: Project documentation
- `supabase_setup.sql`: SQL setup script for Supabase

## App (Expo Router)
- `app/_layout.tsx`: Root layout component for Expo Router
- `app/index.tsx`: Main feed screen with TikTok-style vertical scrolling and zapping mode toggle
- `app/settings.tsx`: Settings screen for language selection
- `app/topics.tsx`: Topics selection screen
- `app/likes.tsx`: Screen for displaying liked articles with ability to view in TikTok-style pager
- `app/article.tsx`: Screen for displaying full article content with ability to like/unlike and open in Wikipedia

## Source Code
- `src/components/`: React components
  - `ArticleCard.tsx`: Component for displaying a single article in full-screen TikTok style with proper read more and open article buttons
  - `TikTokPager.tsx`: Common interface for the TikTok-style pager component
  - `TikTokPager.web.tsx`: Web-specific implementation using ScrollView
  - `TikTokPager.native.tsx`: Native-specific implementation using PagerView

- `src/constants/`: Application constants
  - `index.ts`: API endpoints, default topics, supported languages, storage keys, default thumbnails for topics, increased article fetch limit (50), etc.

- `src/hooks/`: Custom React hooks (to be implemented)

- `src/i18n/`: Internationalization
  - `index.ts`: i18n configuration
  - `en.ts`: English translations including zapping mode translations
  - `tr.ts`: Turkish translations including zapping mode translations

- `src/services/`: API and data services
  - `articleService.ts`: Service for fetching articles from Wikipedia API with enhanced functionality:
    - Support for default thumbnails and prioritizing articles with images
    - Related search terms for topics with language-specific variations
    - Zapping mode with true random article fetching using the random API endpoint
    - Category-based article fetching using the categorymembers endpoint
    - Random timestamp generation for diverse article selection
    - Proper URL parameter handling with URLSearchParams
    - Enhanced error handling for API requests
    - Improved article conversion process
    - Fisher-Yates shuffling algorithm for randomizing article order
  - `likeService.ts`: Service for managing article likes in Supabase
  - `preferenceService.ts`: Service for managing user preferences including zapping mode and enforcing English as the default language
  - `supabaseClient.ts`: Supabase client configuration

- `src/stores/`: Zustand state stores
  - `articleStore.ts`: Store for managing articles with support for randomized ordering
  - `likeStore.ts`: Store for managing likes
  - `preferenceStore.ts`: Store for managing preferences including zapping mode

- `src/types/`: TypeScript type definitions
  - `index.ts`: Types for Article, UserPreference (with zappingMode property), UserLike, etc.
  - Additional interfaces for Wikipedia API responses (WikiArticle, WikiQueryResponse) used in article fetching

- `src/utils/`: Utility functions
  - `userId.ts`: Utility for generating and retrieving user ID
  - `cryptoPolyfill.ts`: Polyfill for crypto API to support UUID generation cross-platform

## Native Platform Files
### Android
- `android/app/`: Main Android app directory
  - `src/main/java/com/toughluck/vikitok/`: Java source files
    - `MainActivity.kt`: Main activity class
    - `MainApplication.kt`: Application class
  - `src/main/res/`: Android resources
    - `drawable/`: Drawable resources
    - `values/`: Value resources (strings, colors, styles)
    - `mipmap-anydpi-v26/`: Adaptive icon resources
  - `src/debug/`: Debug-specific configurations
    - `AndroidManifest.xml`: Debug manifest
  - `src/main/AndroidManifest.xml`: Main Android manifest
  - `build.gradle`: App-level Gradle build file
  - `proguard-rules.pro`: ProGuard rules
  - `debug.keystore`: Debug signing keystore
- `android/gradle/wrapper/`: Gradle wrapper files
- `android/build.gradle`: Project-level Gradle build file
- `android/gradle.properties`: Gradle properties
- `android/settings.gradle`: Gradle settings

## Project Documentation
- `PRD/`: Project documentation
  - `Product_Folder/`: Product documentation
    - `Architecture.md`: Architecture description
    - `Product Brief.md`: Product vision and features
    - `Technical Implementation Plan.md`: Technical details
  - `Project_Folder/`: Project management
    - `Phase_1/`: Phase 1 documentation
      - `development_guidelines.md`: Development guidelines
      - `memory.md`: Project memory
      - `project_structure.md`: This file
      - `review_guidelines.md`: Code review guidelines
      - `todo.md`: Task tracking
      - `Project Brief (This Project - Phase 1 MVP).md`: Phase 1 brief
  - `Prompts/`: AI prompt templates
    - `Main Prompt.md`: Main prompt for development

## Assets
- `assets/`: App assets
  - `adaptive-icon.png`: Adaptive icon for Android
  - `favicon.png`: Web favicon
  - `icon.png`: App icon
  - `splash-icon.png`: Splash screen icon

## Dependencies
- `react-native-pager-view`: Used for implementing TikTok-style vertical scrolling with snap pagination on native platforms
- `expo-secure-store`: Used for secure storage of user ID
- `@react-native-async-storage/async-storage`: Used for storing preferences and fallback like storage
- `@supabase/supabase-js`: Used for Supabase database integration
- `expo-sharing`: Used for article sharing functionality
- `i18n-js` and `expo-localization`: Used for internationalization
- `react-native-paper`: Used for UI components like RadioButton and Checkbox
- `zustand`: Used for state management
- `expo-router`: Used for navigation
- `expo-system-ui`: Used for system UI integration
- `react-native-gesture-handler` and `react-native-reanimated`: Used for gestures and animations
- `uuid`: Used for generating unique identifiers
