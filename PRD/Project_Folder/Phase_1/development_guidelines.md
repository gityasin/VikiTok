# General Development Rules

* This is a cross-platform project. It should work on web, android and iOS
* Always use powershell commands and read maximum amount of lines while using the read_file tool
*You should do task-based development. For every task, you should write the tests, implement the code, and run the tests to make sure everything works. Use `npx expo run android`, `npx expo run ios` or `npx expo start --web` command to run the app. Use Jest to write the test.

When the tests pass:
* Update the todo list to reflect the task being completed
* Update the memory file to reflect the current state of the project
* Update the project_structure to reflect the changes to the project structure. make sure it's up to date with the current structure
* Fix any warnings or errors in the code
* Commit the changes to the repository with a descriptive commit message
* Update the development guidelines to reflect anything that you've learned while working on the project
* Stop and we will open a new chat for the next task

## Cross-Platform Compatibility

* Always test your code on multiple platforms (web, Android, iOS) to ensure compatibility.
* Be aware of platform-specific APIs and provide polyfills or alternative implementations when necessary.
* For web compatibility, ensure that browser APIs used by dependencies (like crypto) have appropriate polyfills.
* When using third-party libraries, check if they support all target platforms.
* Use platform-specific code sparingly and prefer cross-platform solutions when possible.
* Create platform-specific components when necessary using Platform.OS checks.
* For native modules that don't work on web, create wrapper components that provide alternative implementations.
* Use ScrollView with pagingEnabled as a fallback for PagerView on web platforms.
* Be cautious with libraries that use native modules as they may not work on all platforms without additional configuration.
* Check for platform-specific warnings and errors in the console and address them promptly.
* Use platform-specific file extensions (.web.tsx, .native.tsx, .ios.tsx, .android.tsx) for components that need different implementations per platform.
* Run `npx expo prebuild --clean` after installing native modules to ensure they are properly linked.
* For components that use native modules, create a common interface file (without platform extension) that exports the types and a placeholder component.

## Error Handling and Graceful Degradation

* Implement robust error handling for all operations, especially those involving external services.
* Use try-catch blocks to catch and handle errors appropriately.
* Provide fallback mechanisms for critical functionality when external services are unavailable.
* Use local storage as a fallback for remote data storage when appropriate.
* Log errors with meaningful messages to aid in debugging.
* Inform the user when operations fail, but try to maintain functionality when possible.
* Design your application to work offline or with limited connectivity when possible.

## Internationalization and Language Support

* Use the i18n system for all user-facing text to support multiple languages.
* When changing the language, update both the UI text and the content being fetched.
* For content from external APIs (like Wikipedia), ensure the API requests use the correct language parameter.
* Consider translating search terms and topics when fetching content in different languages.
* Clear and reload content when the language changes to ensure consistency.
* Update the i18n locale immediately when the language changes to provide immediate feedback to the user.
* Keep a consistent language experience throughout the app, including error messages and loading states.

## TikTok-Style Scrolling Implementation

* Use `react-native-pager-view` for implementing vertical snap-based pagination on native platforms.
* Create a cross-platform component that uses different implementations for web and native:
  * Use PagerView for native platforms (Android, iOS)
  * Use ScrollView with pagingEnabled for web platforms
* Use platform-specific file extensions (.web.tsx, .native.tsx) to provide different implementations for each platform.
* Create a common interface file (without platform extension) that exports the types and a placeholder component.
* Set the orientation to "vertical" for TikTok-style vertical swiping.
* Design article cards to take up the full screen with a dark overlay for better text readability.
* Position action buttons (like, share, etc.) on the side of the screen similar to TikTok.
* Use a dark theme with text shadows to ensure text is readable over any background image.
* Implement preloading by fetching more articles when the user approaches the end of available content.
* Increase the article fetch limit to ensure a smooth scrolling experience without frequent loading states.
* Use the `onPageSelected` event to track the current page and trigger loading more content when needed.
* Consider the performance implications of loading full-screen images and implement appropriate optimizations.
* Ensure the header is positioned absolutely to overlay the content without taking up space in the layout.
* Handle platform-specific scrolling behaviors and events appropriately.
* Run `npx expo prebuild --clean` after installing native modules to ensure they are properly linked.

## Randomizing Article Order

* Implement a shuffleArray method using the Fisher-Yates algorithm for efficient randomization
* Apply randomization after prioritizing articles with original thumbnails
* Ensure randomization is applied consistently across all article fetches
* Randomize the selection of topics and related terms to provide variety in search results
* Consider the user experience when randomizing content, ensuring a good mix of topics
* For better randomization, fetch articles from multiple related search terms in parallel
* Combine articles from different search terms before applying final randomization
* Increase the article fetch limit to ensure a diverse set of articles (e.g., 50 instead of 20)
* Use multiple random terms for each topic to get more diverse results

## Zapping Mode Implementation

* Implement zapping mode as a boolean property in the UserPreference interface
* Update the preference service to handle zapping mode with a default value of false
* Add a setZappingMode method to the preference store
* Update the article service to accept a zappingMode parameter in the fetchArticles method
* When zapping mode is enabled, use random search terms instead of user-selected topics
* Provide a diverse set of random search terms for both English and Turkish languages
* Add a toggle button in the home page with visual feedback for the zapping mode state
* Clear articles when zapping mode is toggled to provide fresh random content
* Add translations for zapping mode in all supported languages
* Ensure the zapping mode state persists across app restarts

## Wikipedia API Integration

* Use the appropriate Wikipedia API endpoints for different types of article fetching:
  * Use the `opensearch` endpoint for basic term-based searches
  * Use the `categorymembers` endpoint for fetching articles within specific categories
  * Use the `random` endpoint for truly random article selection in zapping mode
  * Use the `query` endpoint with `prop=extracts|pageimages` for fetching article details
* Implement proper typing for API responses using TypeScript interfaces
* Use URLSearchParams for building query parameters to ensure proper encoding
* Handle API rate limits by limiting the number of parallel requests
* Implement random timestamp generation for more diverse article selection
* Use the `cmstart` parameter with random timestamps to get different articles on each request
* Handle continuation tokens (`cmcontinue`) to fetch more articles when available
* Implement proper error handling for API requests with HTTP status checking
* Use the `origin: "*"` parameter to handle CORS in web environments
* Combine and shuffle articles from multiple sources to provide a more diverse feed
* Prioritize articles with thumbnails for a better visual experience
* Provide default thumbnails for articles without images based on their category
* Use the `pithumbsize` parameter to request appropriately sized images
* Extract relevant information from API responses and map to your application's data model
* Consider language-specific API endpoints and category naming conventions for multilingual support
* Implement fallback mechanisms when primary fetching methods fail
* Be aware that Wikipedia category names are case-sensitive and language-specific
  * Use `Category:` prefix for English
  * Use `Kategori:` prefix for Turkish
* Handle both numeric page IDs and title-based IDs in article detail fetching
* Extract and use the title from API responses rather than relying on URL-derived titles
* Add comprehensive logging for debugging API interactions
* Implement multiple fetching strategies with fallbacks for more robust article retrieval
* Ensure all numeric API parameters are integers, not floating-point numbers
  * Use `Math.floor()` or `Math.round()` when dividing values to ensure integer results
  * Always convert numeric parameters to strings using `.toString()` after ensuring they are integers
  * Be aware that some API parameters have specific constraints (e.g., maximum values, minimum values)
  * Check API documentation for parameter type requirements and constraints
* For truly random article selection within categories, use multiple approaches:
  * Use random timestamps with the `cmstart` parameter to get different sets of articles
  * Try different sort directions with the `cmdir` parameter
  * Fetch articles in parallel using multiple random parameters
  * Remove duplicates from the combined results
  * Shuffle the final set of articles for additional randomization

## Article Display

* Implement a proper article detail screen that handles both numeric IDs and title-based IDs
* Extract and display the actual article title from the API response
* Format article content for better readability with appropriate styling
* Provide a clear way to navigate back from the article detail screen
* Include a like/unlike button in the article detail screen for consistent user experience
* Add an option to open the article on Wikipedia for users who want the full experience
* Display article images prominently at the top of the detail screen
* Use a dark theme with appropriate contrast for better readability
* Implement proper error handling and loading states in the article detail screen
* Handle long article titles with text truncation to prevent layout issues
* Ensure the article content is scrollable for longer articles
* Provide visual feedback for user actions like liking/unliking
* Use SafeAreaView to ensure content is properly displayed on all devices
* Implement proper navigation between the article list and detail screens
* Use proper insets handling for headers to avoid overlapping with the status bar
* Add semi-transparent backgrounds to buttons that need to be visible over any content
* Fix z-index issues to ensure UI elements are properly layered
* Use edges parameter with SafeAreaView to control which edges should have safe area insets applied

## Retain Memory

There will be a memory file for every project.

The memory file will contain the state of the project, and any notes or relevant details you'd need to remember between chats.

Keep it up to date based on the project's current state.

Do not annotate task completion in the memory file. It will be tracked in the to-do list.

## Update development guidelines

If necessary, update the development guidelines to reflect anything you've learned while working on the project.

## Update project structure

When you add new files update the project_structure to reflect the changes. Always include a brief summary of the goal of every folder and file.

## Project Specific Guidelines
* Use functional components with hooks.
* Use TypeScript for all code.
* Use Zustand for state management.
* Use Expo Router for navigation.
* Use `fetch` for network requests.
* Use `expo-sharing` for sharing.
* Use `i18n-js` and `expo-localization` for internationalization.
* Use React Native's `StyleSheet` for styling.
* Use `react-native-gesture-handler` and `react-native-reanimated` for scrolling.
* Favor composition over inheritance.
* Keep components small and focused.
* Write clear and concise code.
* Use meaningful variable and function names.
* Comment your code where necessary.
* Handle errors gracefully.
* Test your code thoroughly.
* Prioritize user experience.
* **Supabase:**
  *   Use the Supabase client library to interact with the database.
  * Create Row Level Security policies.
* **Wikipedia API**
    * Be aware of the API limits.
    * Use appropriate endpoints for different types of article fetching.
    * Implement proper error handling and fallbacks.
    * Handle language-specific differences in API parameters and responses.
    * Use category-based fetching for more relevant articles.
    * Implement multiple fetching strategies with fallbacks.

## Gesture Handling

* Use react-native-gesture-handler for implementing complex gestures like double tap
* Implement TapGestureHandler for detecting single and double taps
* Use the waitFor property to properly handle gesture conflicts
* Set up proper gesture handler references using useRef
* Implement visual feedback for successful gestures (like heart animation for double tap to like)
* Use react-native-reanimated for smooth animations in response to gestures
* Combine useSharedValue, useAnimatedStyle, withSpring, and withTiming for sophisticated animations
* Implement proper TypeScript types for gesture event handlers
* Consider performance implications of gesture handlers and animations
* Use setTimeout for delayed animations (like fading out the heart icon after a delay)
* Position animated elements absolutely to avoid layout shifts
* Use proper z-index values to ensure animated elements appear above other content
* Implement proper error handling for async operations triggered by gestures
* Ensure GestureHandlerRootView is the top-level component in your app hierarchy
* Add fallback mechanisms for platforms where gesture handlers might not work properly
* Ignore specific gesture-related warnings that can't be fixed using LogBox.ignoreLogs
* Consider simplifying gesture handling on web platforms where native gestures might not work as expected
* Test gesture handlers on all target platforms (Android, iOS, web) to ensure consistent behavior

## Cross-Platform ID and Navigation Handling

* Use consistent ID formats across different data sources (API endpoints, local storage)
* When working with external APIs like Wikipedia, prefer using titles as IDs instead of numeric IDs for better cross-platform compatibility
* Encode URI components when passing titles or other string identifiers in navigation parameters
* Decode URI components when retrieving navigation parameters that might contain special characters
* Handle both numeric IDs and string IDs in your navigation logic
* Use proper URL construction for different platforms and languages
* Implement fallback mechanisms for when IDs or titles are missing or malformed
* Log navigation parameters for debugging purposes
* Test navigation flows on all target platforms to ensure consistent behavior
* Consider the differences in how web and native platforms handle navigation parameters
* Use consistent URL formats when constructing links to external resources

## Mobile Performance Optimization

* Limit the number of parallel API requests to prevent overwhelming mobile devices
* Add timeouts to all network requests to prevent infinite loading or hanging
* Use AbortController for request cancellation when timeouts occur
* Implement fallback mechanisms to return partial results when timeouts occur
* Reduce the number of items processed in each API call, especially on mobile
* Limit the maximum number of items fetched at once (e.g., 10-20 instead of 50)
* Add detailed logging for debugging performance issues
* Return empty arrays instead of throwing errors to prevent app crashes
* Use Promise.race to implement timeouts for Promise.all operations
* Implement progressive loading strategies (load a few items first, then more as needed)
* Consider device capabilities when determining how many items to process
* Test performance on lower-end devices to ensure good experience for all users
* Monitor memory usage and implement cleanup mechanisms
* Use clearTimeout to clean up timeout references
* Implement retry mechanisms with exponential backoff for transient failures
* Add visual feedback during long-running operations
* Consider using web workers for heavy processing on web platforms
* Implement pagination or infinite scrolling with smaller batch sizes
* Cache results when appropriate to reduce redundant API calls