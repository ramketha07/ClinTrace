import express from 'express';
import { createPatient, getPatients, getPatientById } from '../controllers/patientController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('RECEPTIONIST'), createPatient);
router.get('/', protect, authorize('DOCTOR', 'RECEPTIONIST', 'ADMIN'), getPatients);
router.get('/:id', protect, authorize('DOCTOR', 'RECEPTIONIST', 'ADMIN'), getPatientById);

export default router;
