import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
