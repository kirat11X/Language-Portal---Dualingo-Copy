import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Volume2, Pencil } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getWordById } from '../services/api';
import type { Word, Group } from '../types';

export default function WordDetail() {
  const { id } = useParams<{ id: string }>();
  const [word, setWord] = useState<(Word & { groups: Group[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWordById(Number(id)).then(data => {
      setWord(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSkeleton type="detail" />;

  if (!word) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Word not found.</p>
        <Link to="/words" className="text-primary hover:underline mt-2 inline-block">
          ← Back to Words
        </Link>
      </div>
    );
  }

  const total = word.correct_count + word.wrong_count;
  const masteryPercent = total > 0 ? Math.round((word.correct_count / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        to="/words"
        className="inline-flex items-center gap-4 text-xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface hover:text-primary transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
          <ArrowLeft size={20} />
        </div>
        Word Detail View
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main word display */}
        <div className="lg:col-span-2 bg-gradient-to-br from-surface-container-lowest to-primary/5 dark:from-slate-900 dark:to-primary/10 rounded-[2rem] p-12 text-center ambient-shadow border border-outline-variant/10 relative overflow-hidden">
          <p className="text-[7rem] lg:text-[8rem] mt-4 mb-4 leading-none text-on-surface dark:text-slate-100 font-headline" style={{ fontFamily: 'serif' }}>
            {word.gurmukhi}
          </p>
          <p className="text-2xl text-primary font-semibold mb-3">
            {word.romanized}
          </p>
          <div className="w-12 h-0.5 bg-surface-container-high dark:bg-dark-surface-container-high mx-auto mb-4" />
          <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant italic max-w-md mx-auto">
            {word.english}
          </p>

          {/* Group tags */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {word.groups.map(group => (
              <Link
                key={group.id}
                to={`/word-groups/${group.id}`}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-primary-surface text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                {group.name}
              </Link>
            ))}
            {word.parts?.type && (
              <span className="px-5 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant capitalize">
                {word.parts.type}
              </span>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-6">
          {/* Correct count */}
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2rem] p-6 ambient-shadow border border-outline-variant/10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Correct Count
              </p>
              <p className="text-3xl font-bold text-emerald-600 flex items-baseline gap-1.5 mt-1">
                {word.correct_count} <span className="text-sm font-medium text-emerald-400">times</span>
              </p>
            </div>
          </div>

          {/* Wrong count */}
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2rem] p-6 ambient-shadow border border-outline-variant/10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
              <XCircle size={24} className="text-rose-500" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Wrong Count
              </p>
              <p className="text-3xl font-bold text-rose-600 flex items-baseline gap-1.5 mt-1">
                {word.wrong_count} <span className="text-sm font-medium text-rose-400">times</span>
              </p>
            </div>
          </div>

          {/* Mastery */}
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2rem] p-6 ambient-shadow border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-on-surface dark:text-dark-on-surface">Overall Mastery</span>
              <span className="text-sm font-bold text-primary">{masteryPercent}%</span>
            </div>
            <div className="h-3 w-full bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
            <p className="text-[0.7rem] leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant mt-5">
              {masteryPercent >= 80
                ? 'You are doing great! This word is almost fully memorized. Keep up the review sessions.'
                : masteryPercent >= 50
                ? 'Good progress! Continue practicing to strengthen your memory.'
                : 'Keep studying! Regular practice will help you master this word.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700 border border-outline-variant/10 transition-colors rounded-full py-6 flex flex-col items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-2xl">volume_up</span>
              <span className="text-xs font-bold text-on-surface dark:text-slate-200">Pronounce</span>
            </button>
            <button className="bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700 border border-outline-variant/10 transition-colors rounded-full py-6 flex flex-col items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-2xl">edit</span>
              <span className="text-xs font-bold text-on-surface dark:text-slate-200">Edit Word</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
