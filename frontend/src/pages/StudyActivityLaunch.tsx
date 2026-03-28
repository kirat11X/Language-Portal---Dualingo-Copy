import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Rocket } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getStudyActivities, getGroups, createStudySession } from '../services/api';
import type { StudyActivity, Group } from '../types';

export default function StudyActivityLaunch() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<StudyActivity | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    Promise.all([getStudyActivities(), getGroups()]).then(([acts, grps]) => {
      const found = acts.find(a => a.id === Number(id));
      setActivity(found || null);
      setGroups(grps.data);
      if (grps.data.length > 0) setSelectedGroup(grps.data[0].id);
      setLoading(false);
    });
  }, [id]);

  const handleLaunch = async () => {
    if (!activity || !selectedGroup) return;
    setLaunching(true);
    try {
      const session = await createStudySession(selectedGroup, activity.id);
      alert(`Session #${session.id} created! Activity "${activity.name}" is launching...`);
    } catch {
      alert('Failed to create session');
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return <LoadingSkeleton type="detail" />;

  if (!activity) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Activity not found.</p>
        <Link to="/study-activities" className="text-primary hover:underline mt-2 inline-block">
          ← Back to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        to="/study-activities"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Study Activities
      </Link>

      {/* Card */}
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-8 ambient-shadow border border-outline-variant/10">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs mb-3 inline-block">Launch Activity</span>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface mb-2">
          {activity.name}
        </h1>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-8">
          {activity.description}
        </p>

        {/* Group selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2 block">
            Select Word Group
          </label>
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(Number(e.target.value))}
              className="w-full appearance-none px-4 py-3 pr-10 bg-surface-container dark:bg-slate-800 rounded-xl text-sm text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors cursor-pointer"
            >
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.words_count} words)
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
          </div>
        </div>

        <button
          onClick={handleLaunch}
          disabled={launching}
          className="bg-primary text-on-primary hover:opacity-90 rounded-full font-bold transition-all w-full py-3.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {launching ? 'Creating Session...' : 'Launch Now'}
          <Rocket size={16} />
        </button>
      </div>
    </div>
  );
}
