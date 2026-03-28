import { useEffect, useState } from 'react';
import { getStudySessions } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { StudySession } from '../types';
import { useNavigate } from 'react-router-dom';

export default function StudySessions() {
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getStudySessions(1).then(res => {
            setSessions(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingSkeleton type="table" />;

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-12">
             <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Study Sessions</h2>
                    <p className="text-on-surface-variant font-medium">Review your historical progress and session details.</p>
                </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface-container-low dark:bg-slate-800 text-xs uppercase tracking-widest text-on-surface-variant">
                            <th className="px-8 py-5">ID</th>
                            <th className="px-8 py-5">Activity</th>
                            <th className="px-8 py-5">Group</th>
                            <th className="px-8 py-5">Time</th>
                            <th className="px-8 py-5 text-center">Reviews</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {sessions.map((session) => (
                            <tr key={session.id} onClick={() => navigate(`/sessions/${session.id}`)} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                                <td className="px-8 py-6 font-mono text-xs font-bold text-outline-variant">#{session.id}</td>
                                <td className="px-8 py-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-sm">quiz</span>
                                    </div>
                                    <span className="font-bold">{session.activity_name}</span>
                                </td>
                                <td className="px-8 py-6"><span className="px-3 py-1 bg-surface-container dark:bg-slate-800 rounded-full text-xs font-bold">{session.group_name}</span></td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">{new Date(session.created_at).toLocaleString()}</td>
                                <td className="px-8 py-6 text-center font-black">{session.review_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
