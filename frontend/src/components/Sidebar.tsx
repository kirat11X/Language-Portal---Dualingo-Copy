import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Sidebar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    
    const navItems = [
        { path: "/", icon: "dashboard", label: "Dashboard" },
        { path: "/study-activities", icon: "school", label: "Study Activities" },
        { path: "/words", icon: "translate", label: "Words" },
        { path: "/word-groups", icon: "folder_shared", label: "Word Groups" },
        { path: "/sessions", icon: "history", label: "Sessions" },
        { path: "/settings", icon: "settings", label: "Settings" }
    ];

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low dark:bg-slate-900 flex flex-col gap-2 p-6 z-50 border-r border-outline-variant/10 transition-colors">
            <div className="mb-8 px-2">
                <h1 className="text-2xl font-black text-primary tracking-tighter font-headline">LangPortal</h1>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mt-1">Punjabi Learning</p>
            </div>
            
            <nav className="space-y-2 flex-grow">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full font-headline font-semibold text-sm tracking-tight transition-all duration-200 ${
                                isActive 
                                ? "bg-white dark:bg-white/10 text-primary shadow-sm" 
                                : "text-on-surface-variant hover:text-primary hover:bg-white/50 dark:hover:bg-white/5"
                            }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-outline-variant/10">
                 <div className="flex items-center justify-between px-4 py-2 mb-4 bg-surface dark:bg-slate-800 rounded-full">
                    <span className="text-xs font-bold text-on-surface-variant">Theme</span>
                    <button onClick={toggleTheme} className="p-1 rounded-full bg-surface-container-high dark:bg-slate-700 text-on-surface hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
                <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold tracking-tight shadow-lg hover:opacity-90 active:scale-95 transition-all">
                    Start Studying
                </button>
            </div>
        </aside>
    );
}
