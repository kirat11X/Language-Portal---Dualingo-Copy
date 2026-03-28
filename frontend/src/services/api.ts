import type {
  Word,
  Group,
  StudyActivity,
  StudySession,
  WordReviewItem,
  DashboardData,
  PaginatedResponse,
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE_URL}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function getWords(
  page = 1,
  sortBy = 'gurmukhi',
  order: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<Word>> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: '10',
    sort_by: sortBy,
    order: order,
  });
  const res = await fetch(`${API_BASE_URL}/words?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch words');
  const data = await res.json();
  return {
    data: data.items,
    total: data.pagination.total_items,
    page: data.pagination.page,
    per_page: data.pagination.per_page,
    total_pages: data.pagination.total_pages,
  };
}

export async function getWordById(id: number): Promise<Word & { groups: Group[] }> {
  const res = await fetch(`${API_BASE_URL}/words/${id}`);
  if (!res.ok) throw new Error('Failed to fetch word');
  return res.json();
}

export async function getGroups(
  page = 1,
  sortBy = 'name',
  order: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<Group>> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: '20',
    sort_by: sortBy,
    order: order,
  });
  const res = await fetch(`${API_BASE_URL}/groups?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch groups');
  const data = await res.json();
  return {
    data: data.items,
    total: data.pagination.total_items,
    page: data.pagination.page,
    per_page: data.pagination.per_page,
    total_pages: data.pagination.total_pages,
  };
}

export async function getGroupById(
  id: number,
  page = 1
): Promise<{ group: Group; words: PaginatedResponse<Word> }> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: '10',
  });
  const res = await fetch(`${API_BASE_URL}/groups/${id}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch group');
  const data = await res.json();
  return {
    group: data.group,
    words: {
      data: data.items,
      total: data.pagination.total_items,
      page: data.pagination.page,
      per_page: data.pagination.per_page,
      total_pages: data.pagination.total_pages,
    },
  };
}

export async function getStudyActivities(): Promise<StudyActivity[]> {
  const res = await fetch(`${API_BASE_URL}/study_activities`);
  if (!res.ok) throw new Error('Failed to fetch study activities');
  const data = await res.json();
  return data.items;
}

export async function getStudySessions(
  page = 1
): Promise<PaginatedResponse<StudySession>> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: '10',
  });
  const res = await fetch(`${API_BASE_URL}/study_sessions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch study sessions');
  const data = await res.json();
  return {
    data: data.items,
    total: data.pagination.total_items,
    page: data.pagination.page,
    per_page: data.pagination.per_page,
    total_pages: data.pagination.total_pages,
  };
}

export async function getStudySessionById(
  id: number
): Promise<{ session: StudySession; reviews: WordReviewItem[] }> {
  const res = await fetch(`${API_BASE_URL}/study_sessions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch study session');
  return res.json();
}

export async function createStudySession(
  groupId: number,
  activityId: number
): Promise<StudySession> {
  const res = await fetch(`${API_BASE_URL}/study_sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group_id: groupId, study_activity_id: activityId }),
  });
  if (!res.ok) throw new Error('Failed to create study session');
  return res.json();
}

export async function submitReview(
  sessionId: number,
  wordId: number,
  isCorrect: boolean
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/study_sessions/${sessionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word_id: wordId, correct: isCorrect }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return { success: true };
}

export async function resetHistory(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/reset_history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scope: 'all' }),
  });
  if (!res.ok) throw new Error('Failed to reset history');
  return { success: true };
}
