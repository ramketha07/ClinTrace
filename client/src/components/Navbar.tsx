import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-surface/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-9 h-9 p-0.5 rounded-xl bg-gradient-to-tr from-primary to-accent overflow-hidden shadow-lg shadow-primary/20 bg-white">
                                <img src="/logo.png" alt="ClinTrace" className="w-full h-full object-cover rounded-lg transform transition-transform group-hover:scale-110" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
                                ClinTrace
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1 pl-6 border-l border-white/5">
                            <Link 
                                to="/dashboard" 
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                                    isActive('/dashboard') ? 'bg-white/5 text-primary shadow-inner shadow-black/20' : 'text-textSecondary hover:bg-white/[0.03] hover:text-white'
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner shadow-black/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/5 shadow-inner">
                                <User size={16} className="text-primary-light" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-textPrimary leading-none">{user?.name}</span>
                                <span className="text-[10px] text-primary-light font-bold uppercase tracking-widest mt-0.5 opacity-70 italic">{user?.role}</span>
                            </div>
                        </div>

                        <div className="h-6 w-[1px] bg-white/5 mx-1" />

                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-textSecondary hover:bg-red-500/10 hover:text-red-400 transition-all group"
                            title="Sign Out"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-semibold">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
