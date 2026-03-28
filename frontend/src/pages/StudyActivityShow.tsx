import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';
import { getStudyActivities, getStudySessions } from '../services/api';
import type { StudyActivity, StudySession } from '../types';

export default function StudyActivityShow() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<StudyActivity | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Promise.all([getStudyActivities(), getStudySessions(page)]).then(
      ([acts, sess]) => {
        const found = acts.find(a => a.id === Number(id));
        setActivity(found || null);
        setSessions(sess.data.filter(s => s.study_activity_id === Number(id)));
        setTotalPages(sess.total_pages);
        setLoading(false);
      }
    );
  }, [id, page]);

  if (loading) return <LoadingSkeleton type="table" />;

  if (!activity) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant">
          Activity not found.
        </p>
        <Link
          to="/study-activities"
          className="text-primary hover:underline mt-2 inline-block"
        >
          ← Back to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/study-activities"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Study Activities
      </Link>

      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
          {activity.name}
        </h1>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
          {activity.description}
        </p>
      </div>

      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl ambient-shadow border border-outline-variant/10 overflow-hidden">
        <h3 className="text-lg font-bold font-headline text-on-surface dark:text-slate-200 px-6 pt-6 pb-4">
          Past Sessions
        </h3>
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant dark:text-dark-on-surface-variant">
            No sessions found for this activity yet.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low dark:bg-slate-800 border-b border-outline-variant/10 text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Group</th>
                <th className="px-6 py-5">Start Time</th>
                <th className="px-6 py-5">End Time</th>
                <th className="px-6 py-5">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sessions.map(session => (
                <tr key={session.id}>
                  <td className="px-6">
                    <Link
                      to={`/sessions/${session.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      #SS-{String(session.id).padStart(4, '0')}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs">
                      {session.group_name}
                    </span>
                  </td>
                  <td className="px-6 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                    {new Date(session.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                    {session.ended_at
                      ? new Date(session.ended_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-6 font-semibold text-on-surface dark:text-dark-on-surface">
                    {session.review_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-6 pb-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
