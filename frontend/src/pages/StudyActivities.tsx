import { useEffect, useState } from 'react';
import { getStudyActivities } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { StudyActivity } from '../types';

export default function StudyActivities() {
    const [activities, setActivities] = useState<StudyActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudyActivities().then(data => {
            setActivities(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const getIconAndColor = (name: string) => {
        if (name === 'Typing Tutor') return { icon: 'keyboard', color: 'from-primary/20' };
        if (name === 'Flashcard Pro' || name === 'Language Flashcards') return { icon: 'style', color: 'from-tertiary/20' };
        return { icon: 'graphic_eq', color: 'from-secondary/20' }; // Audio Match
    };

    return (
        <div className="animate-in fade-in duration-500">
             <div className="mb-12">
                <h1 className="font-headline text-5xl font-extrabold tracking-tighter mb-4">Choose Your Path</h1>
                <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">Select a study activity to master your Punjabi vocabulary. From focused typing to immersive flashcards, every session brings you closer to fluency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {activities.map((act) => {
                    const style = getIconAndColor(act.name);
                    return (
                     <div key={act.id} className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-8 ambient-shadow transition-all duration-300 hover:scale-[1.02] flex flex-col h-full border border-outline-variant/10">
                        <div className="aspect-video bg-surface-container dark:bg-slate-800 rounded-lg mb-8 overflow-hidden relative flex items-center justify-center">
                            <div className={`absolute inset-0 bg-gradient-to-br ${style.color} to-transparent`}></div>
                            <span className="material-symbols-outlined text-6xl text-on-surface-variant relative z-10 opacity-50">{style.icon}</span>
                        </div>
                        <h3 className="font-headline text-2xl font-bold mb-2">{act.name}</h3>
                        <p className="text-on-surface-variant text-sm mb-8 flex-grow">{act.description}</p>
                        <div className="flex items-center gap-3">
                            <button className="flex-1 bg-primary text-on-primary py-3 px-6 rounded-full font-headline font-bold text-sm transition-all hover:opacity-90 active:scale-95">Launch</button>
                            <button className="px-6 py-3 rounded-full border border-outline-variant font-headline font-bold text-sm hover:bg-surface-container transition-colors">View</button>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}
