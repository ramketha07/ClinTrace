import React from 'react';
import PatientList from '../components/PatientList';

const DoctorDashboard: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor Dashboard</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Assigned Patients</h2>
            <PatientList />
        </div>
    );
};

export default DoctorDashboard;
