# VikiTok Todo List

## Features to Add
- [x] Currently topics only shows article that has the topic name. implement a better topic logic. It should show random articles about that topic.
- [x] Read more button should open the full article in the app. It shouldn't open the article link on wikipedia.
- [x] Some articles don't have thumbnails. We should show a default thumbnail for each category if the article doesn't have a picture.
- [x] We should proiritize articles with thumbnail.
- [x] We have two read more buttons. One below the summary should show more text in the app. The other should be renamed to open article
- [ ] More comphrehensive topics list.
- [x] Ordering of the articles should be random in the homepage. Currently it's ordered alphabetically.
- [x] Every time app is opened it should randomly list articles. Not the same article every time.
- [x] A toggle in the home page for zapping. When It's turned on it ignores selected topics and fetches random articles from wikipedia.
- [x] Make default language english.
- [x] Fetch 50 articles at a time and randomly order them. Both when in zap on and not in zap mode. Because I still see alphabetically ordered articles. After like 10 of them it switches to a new word and it's alphabetically ordered again. I want it to be randomly ordered. So fetch 50 RANDOM articles from that category and show them. Or when in zap mode fetch 50 random articles and show them.
- [x] When I select history I still get articles that starts with the word history. I want the app to fetch random 50 articles from a category. It shouldn't fetch articles alphabetically.
- [x] In zap mode use this api so it's totally random: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=10&rnnamespace=0"
- [x] Double tap to like article.
- [x] Get truely random articles within categories properly by fetching and printing the titles and page IDs of random articles from the "Category:Algorithms" category.


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
- [x] Fixed missing back button in likes screen and added ability to view liked articles in TikTokPager
- [x] Liked articles screen doesn't show images.
- [x] Liked articles has the article name as header. it should have liked articles as the header. 
- [x] When in a liked article the back button is invisible.
- [x] Read more shows numbers in the titles and nothing else (fixed by improving article detail screen to handle both numeric IDs and titles)
- [x] Only zap mode shows articles when selecting categories (fixed by improving category-based article fetching with proper category name formatting and fallback to search-based fetching)
- [x] In a liked article the top of the screen is higher than normal. Same issue when in read more page.
- [x] badinteger error when fetching articles from categories (fixed by ensuring cmlimit parameter is always an integer)
- [x] "info": "Invalid value \"16.666666666666668\" for integer parameter \"cmlimit\"."
- [x] TapGestureHandler error on Android (fixed by ensuring GestureHandlerRootView is the top-level component and simplifying gesture handling)
- [x] In zap mode, read more only shows article ID number (fixed by using article title as ID instead of numeric ID and properly handling navigation parameters)
- [x] Infinite loading loop on mobile (fixed by limiting parallel requests, reducing the number of articles processed, and adding timeouts to all API calls)

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
- [x] Implement a screen to view liked articles.
- [x] Add back button to liked articles screen.
- [x] Implement ability to view liked articles in TikTokPager when clicked.

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
- [ ] Show the summary of the articles instead of the start of article.
- [ ] Implement an algorithm to show similar articles to ones that users liked.
- [ ] Implement more robust error handling.
- [ ] Optimize performance (caching, image optimization).
- [ ] Add Row Level Security to Supabase.