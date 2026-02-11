import express from 'express';
import { getUsers, createUser, deleteUser, getDoctors } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// Public to authenticated users (or specific roles)
router.get('/doctors', authorize('ADMIN', 'RECEPTIONIST'), getDoctors);

// Admin only routes
router.route('/')
    .get(authorize('ADMIN'), getUsers)
    .post(authorize('ADMIN'), createUser);

router.route('/:id')
    .delete(authorize('ADMIN'), deleteUser);

export default router;
