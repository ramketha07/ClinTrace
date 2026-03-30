import mongoose, { Schema, Document } from 'mongoose';

export interface IDecision extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    contextSnapshot: {
        symptoms: string;
        vitals: Map<string, any>;
        testResults: Map<string, any>;
        missingData: string;
    };
    decisionOptions: {
        action: string;
        reasoning: string;
    }[];
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
    createdAt: Date;
}

const DecisionSchema: Schema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contextSnapshot: {
        symptoms: { type: String, default: '' },
        vitals: { type: Map, of: String, default: {} },
        testResults: { type: Map, of: String, default: {} },
        missingData: { type: String, default: '' }
    },
    decisionOptions: [{
        action: { type: String, default: '' },
        reasoning: { type: String, default: '' }
    }],
    constraints: {
        emergencyCondition: { type: Boolean, default: false },
        financialLimitation: { type: Boolean, default: false },
        limitedResources: { type: Boolean, default: false },
        patientPreference: { type: Boolean, default: false },
        timeConstraint: { type: Boolean, default: false },
        investigationDelay: { type: Boolean, default: false },
        other: { type: String, default: '' }
    },
    rawNotes: { type: String, default: '' },
    aiGeneratedRationale: { type: String, default: '' },
    approvedRationale: { type: String, default: '' },
    versionNumber: { type: Number, default: 1 },
    immutable: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDecision>('Decision', DecisionSchema);
