import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Stethoscope, Lock, Mail, User } from 'lucide-react';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('DOCTOR'); // Default role
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            login(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-primary mb-4">
                    <Stethoscope size={48} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or <Link to="/login" className="font-medium text-primary hover:text-indigo-500">sign in to your existing account</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input pl-10" placeholder="John Doe" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-10" placeholder="doctor@example.com" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 input">
                                <option value="DOCTOR">Doctor</option>
                                <option value="RECEPTIONIST">Receptionist</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-10" placeholder="••••••••" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full btn btn-primary flex justify-center">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
