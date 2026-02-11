import express from 'express';
import { createDecision, generateDecisionRationale, approveDecision, getDecisionsByPatient, getDecisionById } from '../controllers/decisionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('DOCTOR'), createDecision);
router.get('/:id', protect, authorize('DOCTOR', 'ADMIN'), getDecisionById);
router.post('/:id/generate-rationale', protect, authorize('DOCTOR'), generateDecisionRationale);
router.post('/:id/approve', protect, authorize('DOCTOR'), approveDecision);
router.get('/patient/:patientId', protect, authorize('DOCTOR', 'ADMIN'), getDecisionsByPatient);

export default router;
