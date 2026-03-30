import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { User, ClipboardList, ChevronRight, Activity, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="input-group flex items-center px-4">
                <Search size={18} className="text-textSecondary mr-3" />
                <input 
                    type="text" 
                    placeholder="Search patients by name or ID..." 
                    className="bg-transparent border-none focus:ring-0 text-sm py-3 w-full outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPatients.map((patient, index) => (
                    <motion.div
                        key={patient._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link to={`/patients/${patient._id}`} className="group block">
                            <div className="card !p-5 bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04] transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-textPrimary text-lg group-hover:text-primary transition-colors">
                                                {patient.name}
                                            </h4>
                                            <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">
                                                ID: {patient.patientId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="badge badge-success lowercase py-1 px-3">
                                        Active
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center text-xs text-textSecondary">
                                            <Activity size={14} className="mr-2 text-primary/60" />
                                            {patient.gender}, {patient.age}y
                                        </div>
                                        <div className="flex items-center text-xs text-textSecondary">
                                            <ClipboardList size={14} className="mr-2 text-primary/60" />
                                            Dr. {patient.assignedDoctor?.name?.split(' ')[0] || 'Unassigned'}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-textSecondary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-20 card bg-white/[0.01] border-dashed border-white/10">
                    <p className="text-textSecondary italic">No patients found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default PatientList;
