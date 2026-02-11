import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get all users (doctors & receptionists)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private/Receptionist/Admin
export const getDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await User.find({ role: 'DOCTOR' }).select('name _id');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// @desc    Create a new user (Doctor/Receptionist)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
