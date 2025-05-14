const mongoose = require('mongoose');
const Department = require('../Models/department.model');
require('dotenv').config();

const departments = [
    {
        departmentName: 'R&D',
        description: 'Research and Development Department'
    },
    {
        departmentName: 'NLP',
        description: 'Natural Language Processing Department'
    },
    {
        departmentName: 'HR',
        description: 'Human Resources Department'
    },
    {
        departmentName: 'DATA',
        description: 'Data Department'
    },
    {
        departmentName: 'IT',
        description: 'Information Technology Department'
    }
]

const seedRoles = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Clear existing roles
        await Department.deleteMany({});
        console.log('Cleared existing Departments');

        // Insert new roles
        const createdDepartments = await Department.insertMany(departments);
        console.log('Departments seeded successfully:', createdDepartments);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding Departments:', error);
        process.exit(1);
    }
};

// Run the seeder
seedRoles(); 