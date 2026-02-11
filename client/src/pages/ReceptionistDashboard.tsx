import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PatientList from '../components/PatientList';
import { UserPlus } from 'lucide-react';

const ReceptionistDashboard: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/users/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/patients', { name, age: Number(age), gender, phone, assignedDoctor: doctorId });
            alert('Patient added successfully');
            // Optimally, refresh list or clear form
            setName('');
            setAge('');
            setGender('');
            setPhone('');
            setDoctorId('');
        } catch (error) {
            console.error('Failed to add patient', error);
            alert('Failed to add patient');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Receptionist Dashboard</h1>

            <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                    <UserPlus className="mr-2" /> Add New Patient
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 input block w-full" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} className="mt-1 input block w-full" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="mt-1 input block w-full" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 input block w-full" placeholder="+1234567890" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned Doctor</label>
                        <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className="mt-1 input block w-full" required>
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <button type="submit" className="w-full btn btn-primary">Add Patient</button>
                    </div>
                </form>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient List</h2>
            <PatientList />
        </div>
    );
};

export default ReceptionistDashboard;
