import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-surface/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            ClinTrace
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-textSecondary">
                            <User size={18} className="mr-2 text-primary" />
                            <span className="font-medium">{user?.name} ({user?.role})</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
