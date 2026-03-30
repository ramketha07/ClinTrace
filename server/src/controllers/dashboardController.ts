import { Request, Response } from 'express';
import Patient from '../models/Patient';
import Decision from '../models/Decision';

export const getDoctorStats = async (req: Request, res: Response) => {
    try {
        const doctorId = req.user!._id;

        // 1. Assigned Patients
        const assignedPatients = await Patient.countDocuments({ assignedDoctor: doctorId });

        // 2. Pending Rationales (Draft decisions)
        const pendingRationales = await Decision.countDocuments({ 
            doctor: doctorId, 
            immutable: false 
        });

        // 3. Urgent Cases (Emergency Condition in decisions or patients)
        // Let's count patients who have at least one emergency decision pending
        const urgentCases = await Decision.distinct('patient', {
            doctor: doctorId,
            'constraints.emergencyCondition': true,
            immutable: false
        });

        // 4. Completed Reviews (Immutable decisions)
        const completedReviews = await Decision.countDocuments({
            doctor: doctorId,
            immutable: true
        });

        res.json({
            assignedPatients,
            pendingRationales,
            urgentCases: urgentCases.length,
            completedReviews
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};
