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
                setDecision(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDecision();
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

    if (!decision) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-textPrimary mb-4">Clinical Decision Record</h1>
            <div className="card shadow-lg overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-textPrimary">Decision details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-textSecondary text-opacity-70">
                            Version: {decision.versionNumber} | ID: {decision._id}
                        </p>
                    </div>
                    {decision.immutable && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                            <Lock className="mr-1 h-4 w-4" /> Immutable
                        </span>
                    )}
                </div>
                <div className="border-t border-white/10 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-white/10">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-textSecondary text-opacity-70">Raw Clinical Notes</dt>
                            <dd className="mt-1 text-sm text-textPrimary sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{decision.rawNotes}</dd>
                        </div>
                        {decision.aiGeneratedRationale && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-blue-500/10">
                                <dt className="text-sm font-medium text-blue-400">AI Structured Rationale</dt>
                                <dd className="mt-1 text-sm text-textPrimary sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{decision.aiGeneratedRationale}</dd>
                            </div>
                        )}
                    </dl>
                </div>
                <div className="px-4 py-3 bg-transparent text-right sm:px-6 space-x-3">
                    {!decision.immutable && (
                        <>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex justify-center py-2 px-4 border shadow-lg text-sm font-medium  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : <><Wand2 className="mr-2 h-4 w-4" /> Generate Rationale</>}
                            </button>
                            {decision.aiGeneratedRationale && (
                                <button
                                    onClick={handleApprove}
                                    className="inline-flex justify-center py-2 px-4 border shadow-lg text-sm font-medium  text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
