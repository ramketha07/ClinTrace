import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { X, Plus, Save, ChevronLeft, Info, AlertTriangle, Wand2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionConstraints {
    emergencyCondition: boolean;
    financialLimitation: boolean;
    limitedResources: boolean;
    patientPreference: boolean;
    timeConstraint: boolean;
    investigationDelay: boolean;
    other: string;
}

const NewDecision: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Patient ID
    const navigate = useNavigate();
    const [rawNotes, setRawNotes] = useState('');
    const [symptoms, setSymptoms] = useState('');
    
    const [decisionOptions, setDecisionOptions] = useState<{ action: string; reasoning: string }[]>([]);
    
    const [constraints, setConstraints] = useState<DecisionConstraints>({
        emergencyCondition: false,
        financialLimitation: false,
        limitedResources: false,
        patientPreference: false,
        timeConstraint: false,
        investigationDelay: false,
        other: ''
    });

    const addOption = () => {
        setDecisionOptions([...decisionOptions, { action: '', reasoning: '' }]);
    };

    const updateOption = (index: number, field: 'action' | 'reasoning', value: string) => {
        const newOptions = [...decisionOptions];
        newOptions[index][field] = value;
        setDecisionOptions(newOptions);
    };

    const removeOption = (index: number) => {
        setDecisionOptions(decisionOptions.filter((_, i) => i !== index));
    };

    const handleConstraintChange = (field: keyof typeof constraints, value: boolean | string) => {
        setConstraints({ ...constraints, [field]: value });
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/decisions', {
                patient: id,
                contextSnapshot: { symptoms, vitals: {}, testResults: {}, missingData: '' },
                decisionOptions,
                constraints,
                rawNotes
            });
            navigate(`/decisions/${res.data._id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create decision');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        to={`/patients/${id}`} 
                        className="flex items-center text-textSecondary hover:text-textPrimary transition-colors group"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Patient
                    </Link>
                    <h1 className="text-2xl font-bold text-textPrimary">New Decision Record</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="card space-y-10">
                        {/* 1. Context */}
                        <section className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Info size={18} className="text-primary" />
                                <h3 className="text-lg font-semibold">1. Patient Context & Symptoms</h3>
                            </div>
                            <textarea
                                className="input block w-full h-32 resize-none"
                                value={symptoms}
                                onChange={e => setSymptoms(e.target.value)}
                                placeholder="Describe current patient presentation, symptoms, and relevant clinical findings..."
                                required
                            />
                        </section>

                        {/* 2. Options */}
                        <section className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Plus size={18} className="text-primary" />
                                    <h3 className="text-lg font-semibold">2. Alternatives Considered</h3>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={addOption}
                                    className="btn btn-secondary !py-1.5 !px-3 text-xs"
                                >
                                    Add Option
                                </button>
                            </div>
                            
                            <div className="grid gap-4">
                                <AnimatePresence mode="popLayout">
                                    {decisionOptions.map((option, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-5 border border-white/5 rounded-2xl bg-white/[0.02] space-y-4 relative group"
                                        >
                                            <button 
                                                type="button" 
                                                onClick={() => removeOption(index)}
                                                className="absolute top-4 right-4 text-textSecondary hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                            
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Alternative {index + 1}</span>
                                            </div>

                                            <div className="space-y-3">
                                                <input 
                                                    className="input !py-2 text-sm bg-black/40 border-none ring-1 ring-white/5 focus:ring-primary/50"
                                                    value={option.action}
                                                    onChange={e => updateOption(index, 'action', e.target.value)}
                                                    placeholder="Diagnosis or proposed action..."
                                                />
                                                <textarea 
                                                    className="input !py-2 text-sm h-20 bg-black/40 border-none ring-1 ring-white/5 focus:ring-primary/50 resize-none"
                                                    value={option.reasoning}
                                                    onChange={e => updateOption(index, 'reasoning', e.target.value)}
                                                    placeholder="Rationale for considering this path..."
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {decisionOptions.length === 0 && (
                                    <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-sm text-textSecondary/40 italic">
                                        No secondary options added.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 3. Constraints */}
                        <section className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle size={18} className="text-primary" />
                                <h3 className="text-lg font-semibold">3. Constraints & Factors</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                {[
                                    { id: 'emergencyCondition' as const, label: 'Emergency' },
                                    { id: 'financialLimitation' as const, label: 'Financial' },
                                    { id: 'limitedResources' as const, label: 'Resources' },
                                    { id: 'patientPreference' as const, label: 'Preference' },
                                    { id: 'timeConstraint' as const, label: 'Time' },
                                    { id: 'investigationDelay' as const, label: 'Delay' },
                                ].map(constraint => (
                                    <label 
                                        key={constraint.id} 
                                        className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                            constraints[constraint.id] 
                                                ? 'bg-primary/20 border-primary/50 text-primary-light' 
                                                : 'bg-black/20 border-white/5 text-textSecondary hover:border-white/10'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={constraints[constraint.id]}
                                            onChange={e => handleConstraintChange(constraint.id, e.target.checked)}
                                        />
                                        <span className="text-sm font-medium">{constraint.label}</span>
                                    </label>
                                ))}
                            </div>
                            
                            <input 
                                className="input !py-2 text-sm mt-4"
                                value={constraints.other}
                                onChange={e => handleConstraintChange('other', e.target.value)}
                                placeholder="Other specific factors influencing this decision..."
                            />
                        </section>

                        {/* 4. Notes */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">4. Clinical Reasoning & Synthesis</h3>
                            <textarea
                                className="input block w-full h-48 resize-none"
                                value={rawNotes}
                                onChange={e => setRawNotes(e.target.value)}
                                placeholder="Provide a detailed synthesis of your clinical thought process..."
                                required
                            />
                        </section>

                        <div className="pt-6 border-t border-white/5 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn btn-primary !px-10 !py-4 shadow-primary/20"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <Wand2 size={18} className="mr-2 animate-spin" />
                                        Generating Rationale...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Save size={18} className="mr-2" />
                                        Save & Finalize Record
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
};

export default NewDecision;
