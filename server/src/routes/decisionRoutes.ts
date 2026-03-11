import express from 'express';
import { createDecision, generateDecisionRationale, approveDecision, getDecisionsByPatient, getDecisionById, deleteDecision } from '../controllers/decisionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('DOCTOR'), createDecision);
router.get('/:id', protect, authorize('DOCTOR', 'ADMIN', 'RECEPTIONIST'), getDecisionById);
router.post('/:id/generate-rationale', protect, authorize('DOCTOR'), generateDecisionRationale);
router.post('/:id/approve', protect, authorize('DOCTOR'), approveDecision);
router.get('/patient/:patientId', protect, authorize('DOCTOR', 'ADMIN', 'RECEPTIONIST'), getDecisionsByPatient);
router.delete('/:id', protect, authorize('DOCTOR'), deleteDecision);

export default router;
