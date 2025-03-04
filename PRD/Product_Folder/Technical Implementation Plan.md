Frontend (Expo/React Native):

Components:

ArticleCard: Displays a single article (title, snippet, image, like/share buttons).

Feed: Handles the vertical scrolling and fetching of articles.

TopicSelector: Allows users to select/deselect topics.

SettingsScreen: Allows users to change language.

LoadingIndicator: Displays while fetching data.

ErrorScreen: Displays error messages.

Services:

ArticleService:

fetchArticles(language: Language, topics: Topic[], offset: number): Promise<Article[]> - Fetches articles from the Wikipedia API, applying language and topic filters. Uses the Wikipedia API's opensearch and query endpoints.

getArticleContent(pageId: string, language: Language): Promise<string> - Fetches the full content of a specific article.

PreferenceService:

getPreferences(): Promise<UserPreference> - Loads preferences from AsyncStorage.

savePreferences(preferences: UserPreference): Promise<void> - Saves preferences to AsyncStorage.

LikeService:

addLike(articleId: string, userId: string): Promise<void> - Adds a like to Supabase.

removeLike(articleId: string, userId: string): Promise<void> - Removes a like from Supabase.

isLiked(articleId: string, userId: string): Promise<boolean> - Checks if an article is liked by the user in Supabase.

getAllLikes(userId:string): Promise<string[]>

Navigation (Expo Router):

app/index.tsx: The main feed.

app/settings.tsx: Settings screen.

app/topics.tsx: Topic selection.

State Management (Zustand):

articleStore: Manages the list of articles currently displayed in the feed.

preferenceStore: Manages user preferences (language, topics).

likeStore: Manages user likes.

Internationalization (expo-localization + i18n-js):

Translation files (JSON) for English and Turkish.

Use i18n-js to translate UI elements.

Data Fetching (fetch):

Use fetch to communicate with the Wikipedia API and Supabase.

Sharing (expo-sharing):

Use expo-sharing to share article links.

Unique user id (expo-secure-store)

Use expo-secure-store to store and retrieve user's UUID.

Styling (StyleSheet):

Use React Native's StyleSheet for styling.

Backend (Supabase):

Database:

Tables:

likes:

id (UUID, Primary Key)

user_id (TEXT, Foreign Key referencing a generated UUID)

article_id (TEXT)

created_at (TIMESTAMP, default: now())

Add Row Level Security to the table.

Enable read access for all users.

Authenticated users can insert, update and delete only their data.

API:

Use Supabase's auto-generated REST API to interact with the likes table.

No custom serverless functions needed for the MVP.

Authentication (Future)

Implement Email/Password and Social logins.

Will add user id into the users table.

Wikipedia API Interaction:

Fetching Article Titles/Snippets:

Use the opensearch endpoint to get a list of relevant articles based on user's selected topics and language.

Example: https://en.wikipedia.org/w/api.php?action=opensearch&search=science&limit=10&namespace=0&format=json

Fetching Article Content:

Use the query endpoint with prop=extracts to get the main content of an article.

Example: https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=12345&format=json

Fetching Images:

Use the query endpoint with prop=pageimages and pithumbsize to get a thumbnail image for the article.

Example: https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=200&pageids=12345&format=json

Rate Limiting: Be mindful of Wikipedia's API usage guidelines and implement rate limiting if necessary.

Error Handling: Implement robust error handling for API requests.