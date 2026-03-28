import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { DashboardData } from '../types';

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading || !data) return <LoadingSkeleton type="cards" />;

    const stats = [
        { title: "Success Rate", value: `${data.stats.success_rate}%`, icon: "insights", trend: "+2.4%", color: "text-primary", bg: "bg-primary/10" },
        { title: "Study Sessions", value: data.stats.sessions.toString(), icon: "history_edu", color: "text-secondary", bg: "bg-secondary/10" },
        { title: "Active Groups", value: data.stats.groups.toString(), icon: "category", color: "text-tertiary", bg: "bg-tertiary/10" },
        { title: "Study Streak", value: `${data.stats.streak} days`, icon: "local_fire_department", color: "text-orange-500", bg: "bg-orange-500/10" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h2 className="text-4xl font-extrabold tracking-tight font-headline mb-2">Satsriakal, Aman</h2>
                <p className="text-on-surface-variant font-medium">Your Punjabi proficiency has increased by 12% this week.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-surface-container-lowest dark:bg-slate-900 p-8 rounded-xl ambient-shadow border border-outline-variant/10 hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                            </div>
                            {stat.trend && <span className="text-xs font-bold text-primary uppercase tracking-widest">{stat.trend}</span>}
                        </div>
                        <p className="text-on-surface-variant text-sm font-semibold mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-black font-headline">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Last Session */}
                    {data.last_session && (
                        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-10 ambient-shadow border border-outline-variant/10 relative overflow-hidden group">
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h4 className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.2em] mb-2">Last Study Session</h4>
                                    <h3 className="text-3xl font-black font-headline">{data.last_session.activity}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-on-surface-variant text-sm font-medium">
                                        {new Date(data.last_session.date).toLocaleDateString()}
                                    </p>
                                    <Link to={`/sessions/1`} className="text-primary font-bold text-sm hover:underline flex items-center justify-end gap-1 mt-1">
                                        View Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex gap-12 items-center relative z-10">
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold">Correct Words</span>
                                        <span className="text-2xl font-black text-emerald-500">{data.last_session.correct}</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.last_session.correct / (data.last_session.correct + data.last_session.wrong)) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold">Wrong Answers</span>
                                        <span className="text-2xl font-black text-error">{data.last_session.wrong}</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-error rounded-full" style={{ width: `${(data.last_session.wrong / (data.last_session.correct + data.last_session.wrong)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Mastery */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-10 rounded-xl ambient-shadow border border-outline-variant/10">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-extrabold font-headline">Mastery Progress</h4>
                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-tight">
                                {data.progress.studied} / {data.progress.total} words
                            </span>
                        </div>
                        <div className="space-y-6">
                            <div className="relative pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-on-surface-variant uppercase">Current Milestone</span>
                                    <span className="text-xs font-bold text-primary">{Math.round((data.progress.studied / data.progress.total) * 100)}% Overall</span>
                                </div>
                                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-surface-container dark:bg-slate-800">
                                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000" style={{ width: `${(data.progress.studied / data.progress.total) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                     {/* Suggestion */}
                    <div className="bg-primary p-8 rounded-xl text-on-primary ambient-shadow flex flex-col justify-between aspect-square relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                            <span className="material-symbols-outlined text-[12rem]">translate</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-on-primary/60 font-bold text-xs uppercase tracking-widest mb-4">Suggested for you</h4>
                            <h3 className="text-2xl font-black font-headline leading-tight">Flashcard Session: Common Phrases</h3>
                        </div>
                        <Link to="/study-activities" className="relative z-10 mt-6 bg-white text-primary px-6 py-3 rounded-full font-bold text-sm self-start hover:shadow-lg transition-shadow inline-block">
                            Resume Study
                        </Link>
                    </div>

                     {/* Activity */}
                    <div className="bg-surface-container-low dark:bg-slate-900 p-8 rounded-xl border border-outline-variant/10">
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Recent Activity</h4>
                        <div className="space-y-6">
                            {[
                                { text: 'Started "Vegetables" group', time: '2 hours ago', color: 'bg-primary' },
                                { text: 'Finished Typing Tutor', time: 'Yesterday', color: 'bg-outline-variant' }
                            ].map((act, i) => (
                                 <div key={i} className="flex items-start gap-4">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${act.color} shrink-0`}></div>
                                    <div>
                                        <p className="text-sm font-semibold">{act.text}</p>
                                        <p className="text-xs text-on-surface-variant">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
