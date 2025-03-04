# VikiTok Todo List

## Setup

- [ ] Create Expo project with TypeScript.
- [ ] Install dependencies: `expo-router`, `zustand`, `i18n-js`, `expo-localization`, `expo-sharing`,`@react-native-async-storage/async-storage`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-paper`, `supabase-js`,`expo-secure-store`.
- [ ] Configure Expo Router.
- [ ] Set up Supabase project and create `likes` table.
- [ ] Configure Supabase client in the Expo project.
- [ ] Create initial project structure (folders for components, services, stores, etc.).

## Core Functionality

- [ ] Implement `ArticleCard` component.
- [ ] Create `ArticleService` with `fetchArticles` and `getArticleContent` functions.
- [ ] Implement `Feed` component with vertical scrolling (using `react-native-gesture-handler` and `react-native-reanimated`).
- [ ] Implement loading indicator.
- [ ] Implement basic error handling.
- [ ] Implement fetching of initial articles on app load.
- [ ] Implement infinite scrolling (fetching more articles as the user scrolls).

## User Preferences

- [ ] Implement `PreferenceService` with `getPreferences` and `savePreferences` (using AsyncStorage).
- [ ] Create `preferenceStore` (Zustand).
- [ ] Implement `SettingsScreen` with language selection.
- [ ] Implement `TopicSelector` component.
- [ ] Update `ArticleService` to use user preferences (language, topics) when fetching articles.

## Liking

- [ ] Implement unique user identifier.
    - [ ] Generate UUID.
    - [ ] Store using expo-secure-store
    - [ ] Retrieve UUID.
- [ ] Implement `LikeService` with `addLike`, `removeLike`, and `isLiked` (using Supabase).
- [ ] Create `likeStore` (Zustand).
- [ ] Add like button to `ArticleCard`.
- [ ] Update UI to reflect like status.

## Sharing

- [ ] Implement sharing functionality in `ArticleCard` using `expo-sharing`.

## Internationalization

- [ ] Create translation files for English and Turkish.
- [ ] Integrate `i18n-js` and `expo-localization`.
- [ ] Translate UI elements.
- [ ] Detect user's device locale and set initial language.

## Testing (Basic)

- [ ] Write basic unit tests for `ArticleService`.
- [ ] Write basic unit tests for `PreferenceService`.
- [ ] Write basic unit tests for `LikeService`.

## Refinement

- [ ] Improve UI/UX (styling, animations).
- [ ] Implement more robust error handling.
- [ ] Optimize performance (caching, image optimization).
- [ ] Add Row Level Security to Supabase.