import { resetHistory } from '../services/api';

export default function Settings() {
    const handleReset = async () => {
        if (window.confirm("Are you sure you want to reset your history? This action cannot be undone.")) {
            try {
                await resetHistory();
                alert("History cleared successfully.");
            } catch (err) {
                alert("Failed to reset history.");
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-12">
             <section>
                <h3 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Preferences</h3>
                <p className="text-on-surface-variant">Customize your learning environment and manage your personal study data.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest dark:bg-slate-900 p-8 rounded-xl border border-outline-variant/10 flex flex-col items-center text-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 p-1 mb-4 flex items-center justify-center">
                         <span className="material-symbols-outlined text-5xl text-primary">account_circle</span>
                    </div>
                    <h5 className="font-headline font-bold text-lg">Arjun Singh</h5>
                    <p className="text-xs text-on-surface-variant mb-4">arjun.s@language.edu</p>
                    <button className="text-sm font-bold text-primary px-4 py-2 hover:bg-surface-container rounded-lg transition-colors">Manage Account</button>
                </div>

                 <div className="bg-surface-container-lowest dark:bg-slate-900 p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                            <span className="material-symbols-outlined">delete_forever</span>
                        </div>
                        <h4 className="font-headline text-xl font-bold">Data Management</h4>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6">Resetting your history will permanently delete all study progress. This action cannot be undone.</p>
                    <button onClick={handleReset} className="px-6 py-3 bg-error/10 text-error font-bold rounded-lg hover:bg-error hover:text-white transition-colors self-start">
                        Reset History
                    </button>
                </div>
            </div>
        </div>
    );
}
