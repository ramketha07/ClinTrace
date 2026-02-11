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
    optionsConsidered: string[];
    constraints: {
        emergency: boolean;
        resourceLimitations: string;
        financialConstraints: string;
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
    optionsConsidered: [{ type: String }],
    constraints: {
        emergency: { type: Boolean, default: false },
        resourceLimitations: { type: String, default: '' },
        financialConstraints: { type: String, default: '' },
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
