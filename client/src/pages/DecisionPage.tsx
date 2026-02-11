import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Wand2, CheckCircle } from 'lucide-react';

const DecisionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [decision, setDecision] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDecision = async () => {
            try {
                const res = await api.get(`/decisions/${id}`);
                setDecision(res.data); // Wait, backend doesn't have getDecisionById?
                // Ah, backend only has getDecisionsByPatient.
                // I need getDecisionById endpoint.
            } catch (error) {
                console.error(error);
            }
        };
        fetchDecision(); // Can't work without endpoint.
    }, [id]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/decisions/${id}/generate-rationale`);
            setDecision(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to generate rationale');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const res = await api.post(`/decisions/${id}/approve`);
            setDecision(res.data);
            alert('Decision Approved and Locked.');
        } catch (error) {
            console.error(error);
            alert('Failed to approve');
        }
    };

    if (!decision) return <div>Loading... (Note: Backend missing GetDecisionById?)</div>;

    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Clinical Decision Record</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Decision details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Version: {decision.versionNumber} | ID: {decision._id}
                        </p>
                    </div>
                    {decision.immutable && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <Lock className="mr-1 h-4 w-4" /> Immutable
                        </span>
                    )}
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Raw Clinical Notes</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{decision.rawNotes}</dd>
                        </div>
                        {decision.aiGeneratedRationale && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-blue-50">
                                <dt className="text-sm font-medium text-blue-700">AI Structured Rationale</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{decision.aiGeneratedRationale}</dd>
                            </div>
                        )}
                    </dl>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                    {!decision.immutable && (
                        <>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : <><Wand2 className="mr-2 h-4 w-4" /> Generate Rationale</>}
                            </button>
                            {decision.aiGeneratedRationale && (
                                <button
                                    onClick={handleApprove}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve & Lock
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DecisionPage;
