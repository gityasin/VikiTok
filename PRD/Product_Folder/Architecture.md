We'll use a simplified Domain-Driven Design (DDD) approach. Since this is a relatively small application, we won't go into full-blown DDD with aggregates, bounded contexts, etc., but we'll use the core principles of focusing on the domain (Wikipedia articles, user preferences, interactions) and modeling our code around that.

Entities:

Article: Represents a Wikipedia article.

UserPreference: Represents a user's preferences (language, topics). This is not a full user profile, just preferences.

UserLike: Represents a user's "like" of an article.

Value Objects:

Language: (e.g., "en", "tr")

Topic: (e.g., "History", "Science")

ArticleId

Services:

ArticleService: Handles fetching articles from the Wikipedia API, potentially caching them, and applying user preferences.

PreferenceService: Manages user preferences (saving, loading, updating).

LikeService: Manages user likes (adding, removing, checking if liked).

Repositories:

We are not creating any respository as all the data will be stored and read in Supabase or Async Storage.