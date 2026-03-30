import React, { useEffect, useState } from 'react';
import PatientList from '../components/PatientList';
import PageTransition from '../components/PageTransition';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const DoctorDashboard: React.FC = () => {
    const [statsData, setStatsData] = useState({
        assignedPatients: 0,
        pendingRationales: 0,
        urgentCases: 0,
        completedReviews: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/users/dashboard-stats');
                setStatsData(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Assigned Patients', value: statsData.assignedPatients.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Pending Rationales', value: statsData.pendingRationales.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Urgent Cases', value: statsData.urgentCases.toString(), icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
        { label: 'Completed Reviews', value: statsData.completedReviews.toString(), icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ];

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-textPrimary mb-2">Doctor Dashboard</h1>
                    <p className="text-textSecondary text-sm">Welcome back. Here is your clinical overview for today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="card !p-5 flex items-center space-x-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-textSecondary font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-textPrimary">Your Patients</h2>
                        <span className="text-xs text-textSecondary bg-white/5 py-1 px-3 rounded-full border border-white/5">
                            Last synced: Just now
                        </span>
                    </div>
                    <PatientList />
                </div>
            </div>
        </PageTransition>
    );
};

export default DoctorDashboard;
