import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, FolderOpen, Timer, ListChecks, CheckCircle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getStudySessionById } from '../services/api';
import type { StudySession, WordReviewItem } from '../types';

export default function StudySessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<StudySession | null>(null);
  const [reviews, setReviews] = useState<WordReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudySessionById(Number(id)).then(data => {
      setSession(data.session);
      setReviews(data.reviews);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSkeleton type="detail" />;

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Session not found.</p>
        <Link to="/sessions" className="text-primary hover:underline mt-2 inline-block">
          ← Back to Sessions
        </Link>
      </div>
    );
  }

  const duration = session.ended_at
    ? Math.round((new Date(session.ended_at).getTime() - new Date(session.created_at).getTime()) / 60000)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/sessions"
            className="p-2 rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors"
          >
            <ArrowLeft size={18} className="text-on-surface-variant dark:text-dark-on-surface-variant" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
              Session Details
            </h1>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
              ID: #SS-{String(session.id).padStart(4, '0')}
            </p>
          </div>
        </div>
        <button className="bg-primary text-on-primary hover:opacity-90 rounded-full font-bold transition-all px-5 py-2.5 text-sm inline-flex items-center gap-2">
          <Play size={14} /> Redo Activity
        </button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 ambient-shadow border border-outline-variant/10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary-surface flex items-center justify-center">
            <BookOpen size={22} className="text-primary" />
          </div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant mb-1">
            Activity
          </p>
          <p className="text-base font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
            {session.activity_name}
          </p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 ambient-shadow border border-outline-variant/10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary-surface flex items-center justify-center">
            <FolderOpen size={22} className="text-primary" />
          </div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant mb-1">
            Group
          </p>
          <p className="text-base font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
            {session.group_name}
          </p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 ambient-shadow border border-outline-variant/10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-error/10 flex items-center justify-center">
            <Timer size={22} className="text-error" />
          </div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant mb-1">
            Duration
          </p>
          <p className="text-base font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
            {duration} Minutes
          </p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 ambient-shadow border border-outline-variant/10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary-surface flex items-center justify-center">
            <ListChecks size={22} className="text-primary" />
          </div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant mb-1">
            Reviewed
          </p>
          <p className="text-base font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
            {session.review_count} Words
          </p>
        </div>
      </div>

      {/* Reviewed Words */}
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl ambient-shadow border border-outline-variant/10 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold font-headline text-on-surface dark:text-slate-200">
            Reviewed Words
          </h3>
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
            Breakdown of each word performed during this session.
          </p>
        </div>
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant dark:text-dark-on-surface-variant">
            No review data available for this session.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low dark:bg-slate-800 border-b border-outline-variant/10 text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-6 py-5">Punjabi</th>
                <th className="px-6 py-5">Romanization</th>
                <th className="px-6 py-5">English</th>
                <th className="px-6 py-5">Correct</th>
                <th className="px-6 py-5">Time Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6">
                    <span className="gurmukhi-text text-primary font-medium">
                      {review.word?.gurmukhi || '—'}
                    </span>
                  </td>
                  <td className="px-6 text-on-surface-variant dark:text-dark-on-surface-variant">
                    {review.word?.romanized || '—'}
                  </td>
                  <td className="px-6 font-medium text-on-surface dark:text-dark-on-surface">
                    {review.word?.english || '—'}
                  </td>
                  <td className="px-6 py-5">
                    {review.correct ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-rose-500" />
                    )}
                  </td>
                  <td className="px-6 text-sm text-on-surface-variant dark:text-dark-on-surface-variant font-mono">
                    {(Math.random() * 10 + 1).toFixed(1)}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
