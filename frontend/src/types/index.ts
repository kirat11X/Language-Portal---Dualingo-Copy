export interface Word {
  id: number;
  gurmukhi: string;
  romanized: string;
  english: string;
  correct_count: number;
  wrong_count: number;
  parts?: {
    type?: string;
    gender?: string;
    difficulty?: string;
    example?: string;
    pronunciation_hint?: string;
  };
}

export interface Group {
  id: number;
  name: string;
  words_count: number;
  description?: string;
}

export interface StudyActivity {
  id: number;
  name: string;
  url: string;
  description?: string;
  thumbnail_url?: string;
}

export interface StudySession {
  id: number;
  group_id: number;
  study_activity_id: number;
  created_at: string;
  ended_at?: string;
  group_name?: string;
  activity_name?: string;
  review_count?: number;
}

export interface WordReviewItem {
  id: number;
  word_id: number;
  study_session_id: number;
  correct: boolean;
  created_at: string;
  word?: Word;
}

export interface DashboardData {
  last_session: {
    activity: string;
    correct: number;
    wrong: number;
    date: string;
    group_name?: string;
  } | null;
  progress: {
    studied: number;
    total: number;
  };
  stats: {
    success_rate: number;
    sessions: number;
    groups: number;
    streak: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export type SortOrder = 'asc' | 'desc';

export type Theme = 'light' | 'dark';
