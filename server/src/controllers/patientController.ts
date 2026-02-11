import { Request, Response } from 'express';
import Patient from '../models/Patient';

export const createPatient = async (req: Request, res: Response) => {
    try {
        const { name, age, gender, phone, assignedDoctor } = req.body;

        // Generate a simple unique ID (e.g., P-YYYYMMDD-XXXX)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const patientId = `P-${dateStr}-${randomNum}`;

        const patient = await Patient.create({
            patientId,
            name,
            age,
            gender,
            phone,
            assignedDoctor,
        });
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await Patient.find().populate('assignedDoctor', 'name email');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
};

export const getPatientById = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('assignedDoctor', 'name email');
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient' });
    }
};
