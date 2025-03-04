Description: Build the core VikiTok application, enabling users to scroll through Wikipedia articles, like and share them, select topics, and switch between English and Turkish.

Features:

Vertical scrolling feed of articles.

Like button for each article.

Share button for each article.

Topic selection screen.

Language selection (in settings).

Integration with Wikipedia API.

Integration with Supabase for storing likes.

Expo Router navigation.

Significant Types/Entities:

Article (id, title, content, language, url, topics)

UserPreference (language, topics)

UserLike (articleId, userId - even without full accounts, we need a unique identifier)

Business Rules:

Users can only like an article once.

The app should default to the user's device language.

Articles should be displayed in the user's selected language.

The article feed should prioritize articles related to the user's selected topics.

Success Metrics:

Average session duration.

Number of articles liked per user.

Number of articles shared per user.

Retention rate (how often users return to the app).

App store ratings/reviews.

App crash rate.

Unique User Identifier

Generate a UUID for each user on first app open.

Store this UUID using expo-secure-store.

Use this UUID as the userId in the UserLike entity.