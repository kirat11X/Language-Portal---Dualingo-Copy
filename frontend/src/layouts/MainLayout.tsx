import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-200 transition-colors duration-200 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="pt-24 pb-12 px-12 flex-1 relative z-10 w-full overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
