import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Wand2, CheckCircle, ChevronLeft, Clock, User, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionOption {
    action: string;
    reasoning: string;
}

interface Decision {
    _id: string;
    patient: {
        _id: string;
    } | string;
    doctor: {
        _id: string;
        name: string;
    };
    contextSnapshot: {
        symptoms: string;
    };
    decisionOptions: DecisionOption[];
    constraints: {
        emergencyCondition: boolean;
        financialLimitation: boolean;
        limitedResources: boolean;
        patientPreference: boolean;
        timeConstraint: boolean;
        investigationDelay: boolean;
        other: string;
    };
    rawNotes: string;
    aiGeneratedRationale: string;
    approvedRationale: string;
    versionNumber: number;
    immutable: boolean;
    createdAt: string;
}

const DecisionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [decision, setDecision] = useState<Decision | null>(null);
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
        } catch (error) {
            console.error(error);
            alert('Failed to approve');
        }
    };

    if (!decision) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        to={`/patients/${typeof decision.patient === 'string' ? decision.patient : decision.patient._id}`} 
                        className="flex items-center text-textSecondary hover:text-textPrimary transition-colors group"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Patient Profile
                    </Link>
                    
                    <div className="flex items-center space-x-3">
                        {decision.immutable ? (
                            <span className="badge badge-success py-1.5 px-4 flex items-center">
                                <ShieldCheck size={14} className="mr-2" /> Immutable & Signed
                            </span>
                        ) : (
                            <span className="badge badge-warning py-1.5 px-4 flex items-center">
                                <Clock size={14} className="mr-2" /> Drafting Stage
                            </span>
                        ) }
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="card !p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <h1 className="text-2xl font-bold text-textPrimary flex items-center">
                                    <FileText className="mr-3 text-primary" size={24} />
                                    Clinical Decision Record
                                </h1>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* 1. Symptoms */}
                                <div className="space-y-4">
                                    <h3 className="section-title">Patient Context & Symptoms</h3>
                                    <div className="bg-black/20 rounded-xl p-5 border border-white/5 text-textPrimary/90 leading-relaxed whitespace-pre-wrap">
                                        {decision.contextSnapshot?.symptoms || 'No symptoms recorded'}
                                    </div>
                                </div>

                                {/* 2. Options */}
                                <div className="space-y-4">
                                    <h3 className="section-title">Decision Options Considered</h3>
                                    <div className="grid gap-4">
                                        {decision.decisionOptions && decision.decisionOptions.length > 0 ? (
                                            decision.decisionOptions.map((opt, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Option {i+1}</span>
                                                    </div>
                                                    <p className="font-semibold text-textPrimary mb-2">{opt.action}</p>
                                                    <div className="flex items-start text-sm text-textSecondary bg-black/20 p-3 rounded-lg">
                                                        <AlertCircle size={14} className="mt-0.5 mr-2 shrink-0 text-primary-light" />
                                                        <p className="italic">{opt.reasoning}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-textSecondary/50 bg-black/10 rounded-xl border border-dashed border-white/10 italic">
                                                No secondary options recorded
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Raw Notes */}
                                <div className="space-y-4">
                                    <h3 className="section-title">Clinical Reasoning (Raw Notes)</h3>
                                    <div className="bg-black/20 rounded-xl p-5 border border-white/5 text-textPrimary/90 leading-relaxed whitespace-pre-wrap">
                                        {decision.rawNotes}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* AI Section with Enhanced Visuals */}
                        <AnimatePresence>
                            {(loading || decision.aiGeneratedRationale) && (
                                <motion.section 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="card bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 border-indigo-500/20 relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4">
                                        <Wand2 className={`text-indigo-400 ${loading ? 'animate-spin' : 'animate-float'}`} size={24} />
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-indigo-300 mb-6 flex items-center">
                                        Clinical Trace AI Insights
                                        {loading && <span className="ml-3 text-xs font-normal text-indigo-400/60 animate-pulse">Processing...</span>}
                                    </h3>

                                    {loading ? (
                                        <div className="space-y-3">
                                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-4/6 animate-pulse"></div>
                                        </div>
                                    ) : (
                                        <div className="text-textPrimary/90 leading-relaxed prose prose-invert max-w-none">
                                            <div className="whitespace-pre-wrap">{decision.aiGeneratedRationale}</div>
                                        </div>
                                    )}

                                    {!decision.immutable && decision.aiGeneratedRationale && (
                                        <div className="mt-8 pt-6 border-t border-indigo-500/20 flex justify-end">
                                            <button
                                                onClick={handleApprove}
                                                className="btn btn-primary"
                                            >
                                                <CheckCircle size={18} className="mr-2" />
                                                Approve & Sign Record
                                            </button>
                                        </div>
                                    )}
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Metadata */}
                    <div className="space-y-6">
                        <section className="card p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-textSecondary mb-6 border-b border-white/5 pb-2">Record Metadata</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <User size={16} className="text-primary mr-3" />
                                    <div>
                                        <p className="text-textSecondary text-[10px] uppercase font-bold">Treating Doctor</p>
                                        <p className="text-textPrimary font-medium">Dr. {decision.doctor?.name || 'Assigned'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                    <Clock size={16} className="text-primary mr-3" />
                                    <div>
                                        <p className="text-textSecondary text-[10px] uppercase font-bold">Created On</p>
                                        <p className="text-textPrimary font-medium">
                                            {new Date(decision.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-sm">
                                    <ShieldCheck size={16} className="text-primary mr-3" />
                                    <div>
                                        <p className="text-textSecondary text-[10px] uppercase font-bold">Version</p>
                                        <p className="text-textPrimary font-medium">v{decision.versionNumber}.0.0</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="card p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-textSecondary mb-6 border-b border-white/5 pb-2">Constraints Identified</h3>
                            <div className="flex flex-wrap gap-2">
                                {decision.constraints?.emergencyCondition && <span className="badge badge-error">Emergency</span>}
                                {decision.constraints?.financialLimitation && <span className="badge badge-warning">Financial</span>}
                                {decision.constraints?.limitedResources && <span className="badge badge-warning">Resources</span>}
                                {decision.constraints?.patientPreference && <span className="badge badge-accent">Preference</span>}
                                {decision.constraints?.timeConstraint && <span className="badge badge-warning">Time</span>}
                                {decision.constraints?.investigationDelay && <span className="badge badge-warning">Delay</span>}
                                
                                {!(Object.values(decision.constraints || {}).some(v => v === true)) && (
                                    <p className="text-xs italic text-textSecondary/50">No constraints mapped</p>
                                )}
                            </div>
                            {decision.constraints?.other && (
                                <p className="mt-4 text-xs text-textSecondary italic border-l-2 border-primary/30 pl-3">
                                    "{decision.constraints.other}"
                                </p>
                            )}
                        </section>

                        {!decision.aiGeneratedRationale && !decision.immutable && (
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full btn btn-primary !py-4 group"
                            >
                                <Wand2 size={18} className={`mr-2 group-hover:rotate-12 transition-transform ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Analyzing Clinical Data...' : 'Generate AI Rationale'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default DecisionPage;
