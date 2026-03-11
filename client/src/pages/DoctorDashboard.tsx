import React from 'react';
import PatientList from '../components/PatientList';

const DoctorDashboard: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-textPrimary mb-6">Doctor Dashboard</h1>
            <h2 className="text-xl font-semibold text-textSecondary text-opacity-90 mb-4">Assigned Patients</h2>
            <PatientList />
        </div>
    );
};

export default DoctorDashboard;
