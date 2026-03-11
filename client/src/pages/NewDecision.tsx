import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const NewDecision: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Patient ID
    const navigate = useNavigate();
    const [rawNotes, setRawNotes] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [emergency, setEmergency] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/decisions', {
                patient: id,
                contextSnapshot: { symptoms, vitals: {}, testResults: {}, missingData: '' },
                optionsConsidered: [],
                constraints: { emergency, resourceLimitations: '', financialConstraints: '', other: '' },
                rawNotes
            });
            // Redirect to decision view to generate rationale
            navigate(`/decisions/${res.data._id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create decision');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-textPrimary mb-6">New Clinical Decision</h1>
            <form onSubmit={handleSubmit} className="card shadow-lg sm:rounded-lg p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-textSecondary text-opacity-90">Patient Symptoms / Context</label>
                    <textarea
                        className="mt-1 input block w-full h-24"
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        placeholder="Patient presents with..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-textSecondary text-opacity-90">Clinical Reasoning (Raw Notes)</label>
                    <p className="text-xs text-textSecondary text-opacity-70 mb-2">Detailed notes on your thought process.</p>
                    <textarea
                        className="mt-1 input block w-full h-48"
                        value={rawNotes}
                        onChange={e => setRawNotes(e.target.value)}
                        placeholder="Considering X because of Y..."
                        required
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="emergency"
                        type="checkbox"
                        checked={emergency}
                        onChange={e => setEmergency(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-white/10 rounded"
                    />
                    <label htmlFor="emergency" className="ml-2 block text-sm text-textPrimary">
                        Emergency Situation
                    </label>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                        Save Draft & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewDecision;
