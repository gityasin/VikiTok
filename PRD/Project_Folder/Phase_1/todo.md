# VikiTok Todo List

## Bugs (keep track of bugs fixed)
- [x] Errors when trying to run android app
- [x] Invalid Supabase URL error
- [x] Missing default export in index.tsx
- [x] Unsupported top level event type "topInsetsChange" error (fixed by ignoring the warning and updating babel configuration)
- [x] Fixed expo-doctor issues:
  - [x] Updated splash screen image path
  - [x] Updated dependencies to match Expo SDK requirements
  - [x] Added expo.doctor configuration to package.json
  - [x] Ran prebuild to sync app config with native projects
  - [x] Installed expo-system-ui for userInterfaceStyle support
- [x] Fixed UUID error: "crypto.getRandomValues() not supported" by adding a crypto polyfill and improving error handling in userId.ts
- [x] Fixed network request error: "TypeError: Network request failed" by implementing a local storage fallback for the LikeService
- [x] Fixed language selection issue: Articles now load in Turkish when Turkish is selected as the language
- [x] Fixed ViewManagerResolver error for react-native-pager-view by creating a cross-platform TikTokPager component
- [x] Fixed babel.config.js warning by removing deprecated 'expo-router/babel' plugin
- [x] Fixed "Importing native-only module" error on web by using platform-specific files (.web.tsx and .native.tsx)
- [x] Fixed ViewManagerResolver error on Android by running prebuild and properly linking native modules

## Setup

- [x] Create Expo project with TypeScript.
- [x] Install dependencies: `expo-router`, `zustand`, `i18n-js`, `expo-localization`, `expo-sharing`,`@react-native-async-storage/async-storage`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-paper`, `supabase-js`,`expo-secure-store`.
- [x] Configure Expo Router.
- [x] Set up Supabase project and create `likes` table.
- [x] Configure Supabase client in the Expo project.
- [x] Create initial project structure (folders for components, services, stores, etc.).

## Core Functionality

- [x] Implement `ArticleCard` component.
- [x] Create `ArticleService` with `fetchArticles` and `getArticleContent` functions.
- [x] Implement `Feed` component with vertical scrolling (using `react-native-gesture-handler` and `react-native-reanimated`).
- [x] Implement TikTok-style vertical scrolling with snap pagination.
- [x] Implement cross-platform TikTok-style scrolling that works on web and native platforms.
- [x] Implement loading indicator.
- [x] Implement basic error handling.
- [x] Implement fetching of initial articles on app load.
- [x] Implement infinite scrolling (fetching more articles as the user scrolls).

## User Preferences

- [x] Implement `PreferenceService` with `getPreferences` and `savePreferences` (using AsyncStorage).
- [x] Create `preferenceStore` (Zustand).
- [x] Implement `SettingsScreen` with language selection.
- [x] Implement `TopicSelector` component.
- [x] Update `ArticleService` to use user preferences (language, topics) when fetching articles.

## Liking

- [x] Implement unique user identifier.
    - [x] Generate UUID.
    - [x] Store using expo-secure-store
    - [x] Retrieve UUID.
- [x] Implement `LikeService` with `addLike`, `removeLike`, and `isLiked` (using Supabase).
- [x] Create `likeStore` (Zustand).
- [x] Add like button to `ArticleCard`.
- [x] Update UI to reflect like status.

## Sharing

- [x] Implement sharing functionality in `ArticleCard` using `expo-sharing`.

## Internationalization

- [x] Create translation files for English and Turkish.
- [x] Integrate `i18n-js` and `expo-localization`.
- [x] Translate UI elements.
- [x] Detect user's device locale and set initial language.

## Testing (Basic)

- [ ] Write basic unit tests for `ArticleService`.
- [ ] Write basic unit tests for `PreferenceService`.
- [ ] Write basic unit tests for `LikeService`.

## Refinement

- [ ] Improve UI/UX (styling, animations).
- [ ] Implement more robust error handling.
- [ ] Optimize performance (caching, image optimization).
- [ ] Add Row Level Security to Supabase.