import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, FileText, Lock } from 'lucide-react';

const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<any>(null);
    const [decisions, setDecisions] = useState<any[]>([]);

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

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{patient.name}</p>
                    </div>
                    <Link to={`/patients/${id}/new-decision`} className="btn btn-primary flex items-center">
                        <PlusCircle className="mr-2" size={18} /> New Decision
                    </Link>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Age</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.age}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.gender}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Assigned Doctor</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.assignedDoctor?.name}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Decision History</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {decisions.map((decision) => (
                        <li key={decision._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-primary flex items-center">
                                    <FileText className="mr-2" size={16} /> Decision from {new Date(decision.createdAt).toLocaleDateString()}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${decision.immutable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {decision.immutable ? <><Lock size={12} className="mr-1" /> Approved</> : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {decision.rawNotes}
                            </div>
                            {decision.approvedRationale && (
                                <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-500 italic border-l-2 border-primary">
                                    Rationale: {decision.approvedRationale.substring(0, 100)}...
                                </div>
                            )}
                        </li>
                    ))}
                    {decisions.length === 0 && <li className="px-4 py-8 text-center text-gray-500">No decisions recorded yet.</li>}
                </ul>
            </div>
        </div>
    );
};

export default PatientDetails;
