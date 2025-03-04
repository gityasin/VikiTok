# Review Guidelines

When you have finished a project or a significant chunk of work (as defined by the todo list):

1.  **Run and Test:**
    *   Run the app on all target platforms (Android, iOS, Web) using `npx expo run android`, `npx expo run ios`, and `npx expo start --web`.
    *   Manually test all implemented features to ensure they work as expected.
    *   Pay special attention to the core scrolling functionality, liking, sharing, topic selection, and language switching.
    *   Test edge cases and error conditions (e.g., network errors, no articles found, invalid input).
    * Run the tests with `npx expo test`.

2.  **Code Quality:**

    *   **Fix Warnings and Errors:** Address all warnings and errors reported by the Expo compiler and ESLint (if configured).
    *   **Formatting:** Ensure code is properly formatted. You can often configure your editor (VS Code, etc.) to auto-format on save. If not, use a tool like Prettier.
    *   **Consistency:** Verify that the code adheres to the `development_guidelines.md` file, including:
        *   Functional components with hooks.
        *   TypeScript usage.
        *   Zustand for state management.
        *   Expo Router for navigation.
        *   `fetch`, `expo-sharing`, `i18n-js`, `expo-localization`, `StyleSheet`, `react-native-gesture-handler`, and `react-native-reanimated` usage as specified.
        *   Component size and focus.
        *   Clear and concise code, meaningful names, and comments.
        *   Proper error handling.
    *   **Supabase:**
        * Check Supabase client usage.
        * Verify that Row Level Security is correctly implemented on the `likes` table. Verify using Supabase dashboard.

3.  **File Review (using `git diff`):**

    *   Run `git diff --name-only <base_branch>` (e.g., `git diff --name-only main` or `git diff --name-only development`) to get a list of changed files.
    *   Review each changed file individually, paying close attention to:
        *   Logic correctness.
        *   Adherence to the technical implementation plan.
        *   Potential bugs or edge cases.
        *   Code style and readability.
        *   Proper use of libraries and APIs.

4.  **Todo List Verification:**

    *   Review the `todo.md` file and ensure that all tasks related to the completed work are marked as done (`[X]`).
    *   If any tasks are incomplete or require further work, either update the todo list or create new tasks.

5.  **Memory Update:**

    *   Review the `memory.md` file.
    *   Update `memory.md` with a concise summary of:
        *   The current state of the project.
        *   Any important decisions made during development.
        *   Any known issues or limitations.
        *   Any areas that might require future attention.
        *  *Do not* include completed task information (that's in the todo list).

6.  **Development Guidelines Update:**

    *   Review the `development_guidelines.md` file.
    *   Based on the development experience and any lessons learned, consider if any updates are needed to:
        *   General development rules.
        *   Project-specific guidelines.
        * Add any best practices.
        * Add any architectural decisions.

7. **Wikipedia API Usage:**
    *   Confirm that the application is interacting with the Wikipedia API correctly.
    *   Double-check that appropriate API endpoints are being used.
    *   Verify error handling for API requests.
    * Verify if there is a need for rate-limiting.

8. **Supabase Integration:**
    * Ensure proper setup of Supabase.
    * Verify correct data writing into tables.
    * Review database schema in Supabase Dashboard.

9. **Dependencies**
    * Review package.json
    * Ensure all the dependencies added are correct.
    * Verify if any old dependency need to be removed.

This detailed review process will help ensure the quality and maintainability of the VikiTok codebase. It combines automated checks (running tests, formatting) with manual review steps that focus on the specific aspects of this project. Remember to follow these guidelines after completing each significant chunk of work.