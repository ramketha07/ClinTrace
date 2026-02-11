import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            ClinTrace
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                            <User size={18} className="mr-2 text-primary" />
                            <span className="font-medium">{user?.name} ({user?.role})</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
