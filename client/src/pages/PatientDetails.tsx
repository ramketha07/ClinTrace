import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, FileText, Lock, Trash2, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patient, setPatient] = useState<any>(null);
    const [decisions, setDecisions] = useState<any[]>([]);
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

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="card shadow-lg overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-textPrimary">Patient Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-textSecondary text-opacity-70">{patient.name}</p>
                    </div>
                    {user?.role === 'DOCTOR' && (
                        <Link to={`/patients/${id}/new-decision`} className="btn btn-primary flex items-center">
                            <PlusCircle className="mr-2" size={18} /> New Decision
                        </Link>
                    )}
                </div>
                <div className="border-t border-white/10 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-white/10">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-textSecondary text-opacity-70">Age</dt>
                            <dd className="mt-1 text-sm text-textPrimary sm:mt-0 sm:col-span-2">{patient.age}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-textSecondary text-opacity-70">Gender</dt>
                            <dd className="mt-1 text-sm text-textPrimary sm:mt-0 sm:col-span-2">{patient.gender}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-textSecondary text-opacity-70 flex items-center">
                                Assigned Doctor
                            </dt>
                            <dd className="mt-1 text-sm text-textPrimary sm:mt-0 sm:col-span-2 flex items-center">
                                {!isReassigning ? (
                                    <>
                                        <span className="mr-3">{patient.assignedDoctor?.name || 'Unassigned'}</span>
                                        {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && (
                                            <button 
                                                onClick={() => {
                                                    setIsReassigning(true);
                                                    setNewDoctorId(patient.assignedDoctor?._id || '');
                                                }}
                                                className="text-primary hover:text-primary-dark transition-colors"
                                                title="Reassign Doctor"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <select 
                                            value={newDoctorId} 
                                            onChange={(e) => setNewDoctorId(e.target.value)}
                                            className="input py-1 px-2 text-sm"
                                        >
                                            <option value="">Select Doctor</option>
                                            {doctors.map(doc => (
                                                <option key={doc._id} value={doc._id}>{doc.name}</option>
                                            ))}
                                        </select>
                                        <button onClick={handleReassign} className="text-green-500 hover:text-green-400 p-1" title="Save Reassignment">
                                            <Check size={18} />
                                        </button>
                                        <button onClick={() => setIsReassigning(false)} className="text-red-500 hover:text-red-400 p-1" title="Cancel">
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-textPrimary mb-4">Decision History</h2>
            <div className="card shadow-lg overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-white/10">
                    {decisions.map((decision) => (
                        <li 
                            key={decision._id} 
                            className="px-4 py-4 sm:px-6 hover:bg-black/10 cursor-pointer transition duration-150 ease-in-out"
                            onClick={() => navigate(`/decisions/${decision._id}`)}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-primary flex items-center pr-16">
                                    <FileText className="mr-2" size={16} /> Decision from {new Date(decision.createdAt).toLocaleDateString()}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${decision.immutable ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {decision.immutable ? <><Lock size={12} className="mr-1" /> Approved</> : 'Draft'}
                                    </span>
                                    {!decision.immutable && user?.role === 'DOCTOR' && (
                                        <button 
                                            onClick={(e) => handleDeleteDraft(e, decision._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Delete draft"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-textSecondary line-clamp-2 pr-8">
                                {decision.rawNotes}
                            </div>
                            {decision.approvedRationale && (
                                <div className="mt-2 bg-transparent p-2 rounded text-xs text-textSecondary text-opacity-70 italic border-l-2 border-primary">
                                    Rationale: {decision.approvedRationale.substring(0, 100)}...
                                </div>
                            )}
                        </li>
                    ))}
                    {decisions.length === 0 && <li className="px-4 py-8 text-center text-textSecondary text-opacity-70">No decisions recorded yet.</li>}
                </ul>
            </div>
        </div>
    );
};

export default PatientDetails;
