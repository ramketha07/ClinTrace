import express from 'express';
import { createPatient, getPatients, getPatientById, reassignDoctor } from '../controllers/patientController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('RECEPTIONIST'), createPatient);
router.get('/', protect, authorize('DOCTOR', 'RECEPTIONIST', 'ADMIN'), getPatients);
router.get('/:id', protect, authorize('DOCTOR', 'RECEPTIONIST', 'ADMIN'), getPatientById);
router.put('/:id/reassign', protect, authorize('RECEPTIONIST', 'ADMIN'), reassignDoctor);

export default router;
