import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
    patientId: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    assignedDoctor: mongoose.Types.ObjectId;
    createdAt: Date;
}

const PatientSchema: Schema = new Schema({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    assignedDoctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPatient>('Patient', PatientSchema);
