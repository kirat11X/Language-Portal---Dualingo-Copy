import { useEffect, useState } from 'react';
import { getWords } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Word } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Words() {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getWords(1, 'gurmukhi', 'asc').then(res => {
            setWords(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingSkeleton type="table" />;

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-12">
             <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-headline font-extrabold tracking-tight">Vocabulary</h3>
                    <p className="text-on-surface-variant mt-1">Review and manage your Punjabi word bank.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-surface-container text-sm font-semibold rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                    </button>
                    <button className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-full hover:opacity-90 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span> New Word
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/10 ambient-shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low dark:bg-slate-800 border-b border-outline-variant/10">
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Punjabi</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Romanized</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">English</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Correct</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Wrong</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {words.map((word) => (
                            <tr key={word.id} onClick={() => navigate(`/words/${word.id}`)} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                <td className="px-6 py-5 text-2xl font-bold">{word.gurmukhi}</td>
                                <td className="px-6 py-5 text-on-surface-variant">{word.romanized}</td>
                                <td className="px-6 py-5">{word.english}</td>
                                <td className="px-6 py-5"><span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">{word.correct_count}</span></td>
                                <td className="px-6 py-5 text-right"><span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold">{word.wrong_count}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
