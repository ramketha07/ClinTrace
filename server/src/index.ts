import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import decisionRoutes from './routes/decisionRoutes';
import userRoutes from './routes/userRoutes';
import User from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clintrace');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('ClinTrace API is running');
});

// Start Server
connectDB().then(async () => {
    // Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@clintrace.com' });
    if (!adminExists) {
        await User.create({
            name: 'System Admin',
            email: 'admin@clintrace.com',
            password: 'admin123',
            role: 'ADMIN',
        });
        console.log('Default Admin User Created:');
        console.log('Email: admin@clintrace.com');
        console.log('Password: admin123');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
