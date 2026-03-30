import { Request, Response } from 'express';
import Decision from '../models/Decision';
import AuditLog from '../models/AuditLog';
import Patient from '../models/Patient';
import { generateRationale } from '../services/aiService';

export const createDecision = async (req: Request, res: Response) => {
    try {
        const { patient, contextSnapshot, optionsConsidered, constraints, rawNotes } = req.body;
        
        if (req.user!.role === 'DOCTOR') {
            const patientDoc = await Patient.findById(patient);
            if (!patientDoc || (patientDoc.assignedDoctor as any).toString() !== req.user!._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to create decision for this patient' });
            }
        }

        const timestamp = new Date().toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'medium' });
        const appendedNotes = `${rawNotes}\n\n--- Saved by Dr. ${req.user!.name} on ${timestamp} ---`;

        const decision = await Decision.create({
            patient,
            doctor: req.user!._id,
            contextSnapshot,
            optionsConsidered,
            constraints,
            rawNotes: appendedNotes,
        });

        await AuditLog.create({
            user: req.user!._id,
            action: `Created decision for patient ${patient}`,
        });

        res.status(201).json(decision);
    } catch (error) {
        res.status(500).json({ message: 'Error creating decision', error });
    }
};

export const generateDecisionRationale = async (req: Request, res: Response) => {
    try {
        const decision = await Decision.findById(req.params.id);
        if (!decision) {
            return res.status(404).json({ message: 'Decision not found' });
        }

        if (decision.immutable) {
            return res.status(403).json({ message: 'Decision is immutable' });
        }

        const rationale = await generateRationale(decision.rawNotes);
        decision.aiGeneratedRationale = rationale || '';
        await decision.save();

        await AuditLog.create({
            user: req.user!._id,
            action: `Generated rationale for decision ${decision._id}`,
        });

        res.json(decision);
    } catch (error) {
        console.error("Detailed Rationale Generation Error:", error);
        res.status(500).json({ message: 'Error generating rationale', error: error instanceof Error ? error.message : String(error) });
    }
};

export const approveDecision = async (req: Request, res: Response) => {
    try {
        const decision = await Decision.findById(req.params.id);
        if (!decision) {
            return res.status(404).json({ message: 'Decision not found' });
        }

        if (decision.immutable) {
            return res.status(400).json({ message: 'Decision already approved and immutable' });
        }

        const timestamp = new Date().toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'medium' });
        const appendedRationale = `${decision.aiGeneratedRationale}\n\n--- Approved by Dr. ${req.user!.name} on ${timestamp} ---`;

        decision.approvedRationale = appendedRationale;
        decision.immutable = true;
        decision.versionNumber += 1;
        await decision.save();

        await AuditLog.create({
            user: req.user!._id,
            action: `Approved decision ${decision._id}`,
        });

        res.json(decision);
    } catch (error) {
        res.status(500).json({ message: 'Error approving decision', error });
    }
};

export const getDecisionsByPatient = async (req: Request, res: Response) => {
    try {
        if (req.user!.role === 'DOCTOR') {
            const patientDoc = await Patient.findById(req.params.patientId);
            if (!patientDoc || (patientDoc.assignedDoctor as any).toString() !== req.user!._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view decisions for this patient' });
            }
        }
    
        const decisions = await Decision.find({ patient: req.params.patientId })
            .populate('doctor', 'name')
            .sort({ createdAt: -1 });
        res.json(decisions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching decisions', error });
    }
};

export const getDecisionById = async (req: Request, res: Response) => {
    try {
        const decision = await Decision.findById(req.params.id).populate('doctor', 'name');
        if (!decision) {
            return res.status(404).json({ message: 'Decision not found' });
        }
        
        if (req.user!.role === 'DOCTOR') {
            const patientDoc = await Patient.findById(decision.patient);
            if (!patientDoc || (patientDoc.assignedDoctor as any).toString() !== req.user!._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this decision' });
            }
        }
        
        res.json(decision);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching decision', error });
    }
};

export const deleteDecision = async (req: Request, res: Response) => {
    try {
        const decision = await Decision.findById(req.params.id);
        if (!decision) {
            return res.status(404).json({ message: 'Decision not found' });
        }

        if (decision.immutable) {
            return res.status(400).json({ message: 'Approved decisions cannot be deleted' });
        }

        await Decision.findByIdAndDelete(req.params.id);

        await AuditLog.create({
            user: req.user!._id,
            action: `Deleted draft decision ${decision._id}`,
        });

        res.json({ message: 'Decision deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting decision', error });
    }
};
