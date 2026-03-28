import { useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    let title = 'Dashboard';
    if (location.pathname.startsWith('/words')) title = 'Words';
    else if (location.pathname.startsWith('/study-activities')) title = 'Study Activities';
    else if (location.pathname.startsWith('/word-groups')) title = 'Word Groups';
    else if (location.pathname.startsWith('/sessions')) title = 'Study Sessions';
    else if (location.pathname.startsWith('/settings')) title = 'Settings';

    return (
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-surface/70 dark:bg-slate-900/70 backdrop-blur-xl flex justify-between items-center px-8 border-b border-outline-variant/10 transition-colors">
            <div className="flex items-center gap-4">
                <h2 className="font-headline font-bold text-lg text-on-surface">{title}</h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                    <input 
                        className="bg-surface-container border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all dark:bg-slate-800 dark:text-white" 
                        placeholder="Search..." 
                        type="text"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center p-2 rounded-full hover:bg-surface-container">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center p-2 rounded-full hover:bg-surface-container">
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
