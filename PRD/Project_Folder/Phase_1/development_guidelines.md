# General Development Rules

You should do task-based development. For every task, you should write the tests, implement the code, and run the tests to make sure everything works. Use `npx expo run android`, `npx expo run ios` or `npx expo start --web` command to run the app. Use Jest to write the test.

When the tests pass:
* Update the todo list to reflect the task being completed
* Update the memory file to reflect the current state of the project
* Fix any warnings or errors in the code
* Commit the changes to the repository with a descriptive commit message
* Update the development guidelines to reflect anything that you've learned while working on the project
* Stop and we will open a new chat for the next task

## Retain Memory

There will be a memory file for every project.

The memory file will contain the state of the project, and any notes or relevant details you'd need to remember between chats.

Keep it up to date based on the project's current state.

Do not annotate task completion in the memory file. It will be tracked in the to-do list.

## Update development guidelines

If necessary, update the development guidelines to reflect anything you've learned while working on the project.

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