import { useEffect, useState } from 'react';
import { getGroups } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Group } from '../types';
import { useNavigate } from 'react-router-dom';

export default function WordGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getGroups().then(data => {
            setGroups(data.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const getGroupStyle = (index: number) => {
        const styles = [
            { icon: 'restaurant', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: 'mood', color: 'text-secondary', bg: 'bg-secondary/10' },
            { icon: 'commute', color: 'text-tertiary', bg: 'bg-tertiary/10' },
            { icon: 'school', color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: 'home', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ];
        return styles[index % styles.length];
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-12">
             <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black font-headline tracking-tighter">Word Groups</h2>
                    <p className="text-on-surface-variant mt-2 text-lg">Organize your Punjabi vocabulary by category and theme.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-headline font-bold rounded-xl ambient-shadow hover:scale-[1.02] transition-all">
                    <span className="material-symbols-outlined text-lg">add</span> New Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {groups.map((group, i) => {
                    const style = getGroupStyle(i);
                    return (
                    <div key={group.id} onClick={() => navigate(`/word-groups/${group.id}`)} className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-8 ambient-shadow hover:scale-[1.02] transition-all cursor-pointer border border-outline-variant/10">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl ${style.bg} ${style.color}`}>
                                <span className="material-symbols-outlined text-3xl">{style.icon}</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{group.words_count} Words</span>
                        </div>
                        <h3 className="text-2xl font-black font-headline mb-2">{group.name}</h3>
                        <div className="mt-8 flex justify-end">
                            <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}
