import { Request, Response } from 'express';
import Decision from '../models/Decision';
import AuditLog from '../models/AuditLog';
import { generateRationale } from '../services/aiService';

export const createDecision = async (req: Request, res: Response) => {
    try {
        const { patient, contextSnapshot, optionsConsidered, constraints, rawNotes } = req.body;
        const decision = await Decision.create({
            patient,
            doctor: req.user!._id,
            contextSnapshot,
            optionsConsidered,
            constraints,
            rawNotes,
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

        decision.approvedRationale = decision.aiGeneratedRationale;
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
        const decisions = await Decision.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
        res.json(decisions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching decisions', error });
    }
};

export const getDecisionById = async (req: Request, res: Response) => {
    try {
        const decision = await Decision.findById(req.params.id);
        if (!decision) {
            return res.status(404).json({ message: 'Decision not found' });
        }
        // Check if user is authorized to view this decision (e.g. assigned doctor or admin)
        // For simplicity, allowed if role is sufficient
        res.json(decision);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching decision', error });
    }
};
