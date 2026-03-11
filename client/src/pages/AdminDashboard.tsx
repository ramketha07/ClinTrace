import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, UserPlus, Trash2, Shield, Stethoscope, Briefcase } from 'lucide-react';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';
}

const AdminDashboard: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', { name, email, password, role });
            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setRole('DOCTOR');
            setShowAddForm(false);
            // Refresh list
            fetchUsers();
        } catch (error) {
            console.error('Error adding user', error);
            alert('Failed to add user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
            alert('Failed to delete user');
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN': return <Shield className="w-4 h-4 text-purple-600" />;
            case 'DOCTOR': return <Stethoscope className="w-4 h-4 text-blue-600" />;
            case 'RECEPTIONIST': return <Briefcase className="w-4 h-4 text-green-600" />;
            default: return <User className="w-4 h-4 text-textSecondary" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-500/20 text-purple-300';
            case 'DOCTOR': return 'bg-blue-500/100/20 text-blue-300';
            case 'RECEPTIONIST': return 'bg-green-500/20 text-green-300';
            default: return 'bg-surfaceHover border border-white/5 text-textPrimary';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-textPrimary">System Administration</h1>
                    <p className="mt-1 text-sm text-textSecondary text-opacity-70">Manage doctors, receptionists, and system access.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {showAddForm ? 'Cancel' : 'Add New User'}
                </button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
                <div className="card rounded-xl shadow-lg p-6 mb-8 border border-white/5 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Create New Account
                    </h3>
                    <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-textSecondary text-opacity-90 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                placeholder="Dr. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textSecondary text-opacity-90 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="john@clintrace.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textSecondary text-opacity-90 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textSecondary text-opacity-90 mb-1">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'DOCTOR' | 'RECEPTIONIST')}
                                className="input"
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="RECEPTIONIST">Receptionist</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                            <button type="submit" className="btn btn-primary">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="card rounded-xl shadow-lg border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-transparent flex justify-between items-center">
                    <h3 className="text-lg font-medium text-textPrimary">User Directory</h3>
                    <span className="bg-blue-500/100/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {users.length} Users
                    </span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-textSecondary text-opacity-70">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-transparent">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary text-opacity-70 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary text-opacity-70 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary text-opacity-70 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-textSecondary text-opacity-70 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-transparent transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-surfaceHover border border-white/5 rounded-full flex items-center justify-center">
                                                    <span className="text-textSecondary font-medium text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-textPrimary">{user.name}</div>
                                                    <div className="text-xs text-textSecondary text-opacity-70">ID: {user._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary text-opacity-70">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.role !== 'ADMIN' && currentUser?._id !== user._id && (
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-textSecondary text-opacity-70">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
