import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SmilePlus, TrendingUp, MoreHorizontal } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';
import { getGroupById } from '../services/api';
import type { Group, Word } from '../types';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    setLoading(true);
    getGroupById(Number(id), page).then(data => {
      setGroup(data.group);
      setWords(data.words.data);
      setTotalPages(data.words.total_pages);
      setTotalWords(data.words.total);
      setLoading(false);
    });
  }, [id, page]);

  if (loading) return <LoadingSkeleton type="detail" />;

  if (!group) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Group not found.</p>
        <Link to="/word-groups" className="text-primary hover:underline mt-2 inline-block">
          ← Back to Groups
        </Link>
      </div>
    );
  }

  const avgAccuracy = words.length > 0
    ? Math.round(words.reduce((acc, w) => {
        const total = w.correct_count + w.wrong_count;
        return acc + (total > 0 ? (w.correct_count / total) * 100 : 0);
      }, 0) / words.length)
    : 0;

  return (
    <div className="space-y-6">
      <Link
        to="/word-groups"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Word Groups
      </Link>

      {/* Group header */}
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-6 ambient-shadow border border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
            <SmilePlus size={28} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
              {group.name}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-1">
                📚 {totalWords} Total Words
              </span>
              <span className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-1">
                <TrendingUp size={14} className="text-primary" /> {avgAccuracy}% Avg Accuracy
              </span>
            </div>
          </div>
        </div>
        <Link
          to="/study-activities"
          className="bg-primary hover:opacity-90 text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hidden lg:inline-flex items-center gap-2 transition-colors"
        >
          Study This Group
        </Link>
      </div>

      {/* Words table */}
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl ambient-shadow border border-outline-variant/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low dark:bg-slate-800 border-b border-outline-variant/10">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Punjabi</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Romanized</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">English</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Correct</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Wrong</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {words.map(word => (
              <tr key={word.id}>
                <td className="px-6">
                  <Link
                    to={`/words/${word.id}`}
                    className="gurmukhi-text text-primary font-medium hover:underline"
                  >
                    {word.gurmukhi}
                  </Link>
                </td>
                <td className="px-6 py-5 text-on-surface-variant dark:text-dark-on-surface-variant">
                  {word.romanized}
                </td>
                <td className="px-6 py-5 font-medium text-on-surface dark:text-slate-200">
                  {word.english}
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">{word.correct_count}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold">{word.wrong_count}</span>
                </td>
                <td className="px-6">
                  <button className="p-2 rounded-lg hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors">
                    <MoreHorizontal size={16} className="text-on-surface-variant dark:text-dark-on-surface-variant" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
            Showing {words.length} of {totalWords} words
          </p>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
