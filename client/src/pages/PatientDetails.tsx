import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, FileText, Trash2, Edit2, Check, X, ChevronLeft, User, Activity, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

interface Patient {
    _id: string;
    name: string;
    age: number;
    gender: string;
    patientId: string;
    assignedDoctor: {
        _id: string;
        name: string;
    };
}

interface Decision {
    _id: string;
    doctor: {
        name: string;
    };
    createdAt: string;
    immutable: boolean;
    rawNotes: string;
}

const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [doctors, setDoctors] = useState<{ _id: string; name: string }[]>([]);
    const [isReassigning, setIsReassigning] = useState(false);
    const [newDoctorId, setNewDoctorId] = useState('');

    const handleDeleteDraft = async (e: React.MouseEvent, decisionId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this draft decision?')) {
            try {
                await api.delete(`/decisions/${decisionId}`);
                setDecisions(decisions.filter(d => d._id !== decisionId));
            } catch (error) {
                console.error('Error deleting draft', error);
                alert('Failed to delete draft.');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patRes = await api.get(`/patients/${id}`);
                setPatient(patRes.data);
                const decRes = await api.get(`/decisions/patient/${id}`);
                setDecisions(decRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') {
            const fetchDoctors = async () => {
                try {
                    const response = await api.get('/users/doctors');
                    setDoctors(response.data);
                } catch (error) {
                    console.error('Failed to fetch doctors', error);
                }
            };
            fetchDoctors();
        }
    }, [user?.role]);

    const handleReassign = async () => {
        if (!newDoctorId) return;
        try {
            const res = await api.put(`/patients/${id}/reassign`, { assignedDoctor: newDoctorId });
            setPatient(res.data);
            setIsReassigning(false);
            setNewDoctorId('');
        } catch (error) {
            console.error('Error reassigning doctor', error);
            alert('Failed to reassign doctor.');
        }
    };

    if (!patient) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <Link 
                        to="/dashboard" 
                        className="flex items-center text-textSecondary hover:text-textPrimary transition-colors group"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    
                    {user?.role === 'DOCTOR' && (
                        <Link to={`/patients/${id}/new-decision`} className="btn btn-primary">
                            <PlusCircle className="mr-2" size={18} /> New Decision
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <div className="flex flex-col items-center text-center space-y-4 mb-8">
                                <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                    <User size={48} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-textPrimary">{patient.name}</h2>
                                    <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">Patient Profile</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-textSecondary flex items-center text-sm">
                                        <Activity size={16} className="mr-2 text-primary" /> Age / Gender
                                    </span>
                                    <span className="text-textPrimary font-medium text-sm">{patient.age}y / {patient.gender}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-textSecondary flex items-center text-sm">
                                        < ShieldCheck size={16} className="mr-2 text-primary" /> Hospital ID
                                    </span>
                                    <span className="text-textPrimary font-medium text-sm text-xs font-mono">{patient.patientId}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center text-sm text-textSecondary mb-2">
                                            <Edit2 size={14} className="mr-2 text-primary" /> Assigned Doctor
                                        </div>
                                        {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && !isReassigning && (
                                            <button 
                                                onClick={() => {
                                                    setIsReassigning(true);
                                                    setNewDoctorId(patient.assignedDoctor?._id || '');
                                                }}
                                                className="text-[10px] text-primary hover:underline font-bold uppercase"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    
                                    {!isReassigning ? (
                                        <p className="text-textPrimary font-bold text-lg">{patient.assignedDoctor?.name || 'Unassigned'}</p>
                                    ) : (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <select 
                                                value={newDoctorId} 
                                                onChange={(e) => setNewDoctorId(e.target.value)}
                                                className="input !py-1.5 !px-3 text-sm flex-1"
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doc => (
                                                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                                                ))}
                                            </select>
                                            <button onClick={handleReassign} className="btn-primary p-2 rounded-xl">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setIsReassigning(false)} className="btn-secondary p-2 rounded-xl">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decision History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold text-textPrimary">Clinical History</h3>
                            <span className="badge badge-accent">
                                {decisions.length} Records
                            </span>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {decisions.map((decision, index) => (
                                    <motion.div
                                        key={decision._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="card !p-0 overflow-hidden group hover:border-white/20 transition-all cursor-pointer shadow-lg hover:shadow-primary/5"
                                        onClick={() => navigate(`/decisions/${decision._id}`)}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${decision.immutable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-textPrimary">Record by Dr. {decision.doctor?.name?.split(' ')[1] || 'Assigned'}</p>
                                                        <p className="text-[10px] text-textSecondary flex items-center">
                                                            <Clock size={10} className="mr-1" />
                                                            {new Date(decision.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })} • {new Date(decision.createdAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {decision.immutable ? (
                                                        <span className="badge badge-success lowercase flex items-center">
                                                            <ShieldCheck size={10} className="mr-1" /> Approved
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-warning lowercase">Draft</span>
                                                    )}
                                                    
                                                    {!decision.immutable && user?.role === 'DOCTOR' && (
                                                        <button 
                                                            onClick={(e) => handleDeleteDraft(e, decision._id)}
                                                            className="text-textSecondary hover:text-red-500 transition-colors p-1"
                                                            title="Delete draft"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-textSecondary line-clamp-2 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 italic">
                                                "{decision.rawNotes}"
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {decisions.length === 0 && (
                                <div className="text-center py-20 card bg-white/[0.01] border-dashed border-white/10">
                                    <p className="text-textSecondary italic">No decisions recorded yet for this patient.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PatientDetails;
