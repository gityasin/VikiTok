export type Language = 'en' | 'tr';

export type Topic = string;

export interface Article {
  id: string;
  title: string;
  content: string;
  snippet: string;
  imageUrl?: string;
  language: Language;
  topics: Topic[];
  url: string;
}

export interface UserPreference {
  language: Language;
  topics: Topic[];
}

export interface UserLike {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
} 