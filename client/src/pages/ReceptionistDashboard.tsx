import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PatientList from '../components/PatientList';
import { UserPlus, Plus, Clipboard, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const ReceptionistDashboard: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState<{ _id: string; name: string }[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/users/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/patients', { name, age: Number(age), gender, phone, assignedDoctor: doctorId });
            setName('');
            setAge('');
            setGender('');
            setPhone('');
            setDoctorId('');
            setShowForm(false);
            // In a real app we might want to refresh the list component
            window.location.reload(); 
        } catch (error) {
            console.error('Failed to add patient', error);
        }
    };

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-textPrimary mb-2 text-glow">Receptionist Terminal</h1>
                        <p className="text-textSecondary text-sm">Patient intake and administration system</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center shadow-lg transition-all`}
                    >
                        {showForm ? <><X className="mr-2" size={18} /> Cancel</> : <><UserPlus className="mr-2" size={18} /> New Intake</>}
                    </button>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="card border-primary/20 bg-primary/5">
                                <h2 className="section-title">New Patient Admission</h2>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">Full Name</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="input !py-2.5" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">Age</label>
                                        <input type="number" value={age} onChange={e => setAge(e.target.value)} className="input !py-2.5" placeholder="45" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">Gender Identity</label>
                                        <select value={gender} onChange={e => setGender(e.target.value)} className="input !py-2.5" required>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">Contact Phone</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input !py-2.5" placeholder="+1234..." required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">Primary Care Physician</label>
                                        <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className="input !py-2.5" required>
                                            <option value="">Select Doctor</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor._id} value={doctor._id}>
                                                    Dr. {doctor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit" className="w-full btn btn-primary !py-2.5 h-[42px]">
                                            <Plus size={18} className="mr-2" /> Complete Registration
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-textPrimary flex items-center">
                            <Clipboard className="mr-2 text-primary" size={20} />
                            Universal Patient Registry
                        </h2>
                    </div>
                    <PatientList />
                </div>
            </div>
        </PageTransition>
    );
};

export default ReceptionistDashboard;
