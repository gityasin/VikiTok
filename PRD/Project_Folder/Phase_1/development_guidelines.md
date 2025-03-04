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