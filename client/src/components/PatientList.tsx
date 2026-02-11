import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { User, ClipboardList } from 'lucide-react';

interface Patient {
    _id: string;
    patientId: string;
    name: string;
    age: number;
    gender: string;
    assignedDoctor: {
        _id: string;
        name: string;
    };
}

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/patients');
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients', error);
            }
        };
        fetchPatients();
    }, []);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {patients.map((patient) => (
                    <li key={patient._id}>
                        <Link to={`/patients/${patient._id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-primary truncate">
                                        {patient.name} <span className="text-gray-500 text-xs ml-2">({patient.patientId})</span>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            {patient.gender}, {patient.age} years
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            <ClipboardList className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            Dr. {patient.assignedDoctor?.name || 'Unassigned'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientList;
