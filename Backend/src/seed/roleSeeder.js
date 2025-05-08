const mongoose = require('mongoose');
const Role = require('../Models/userRole.model');
require('dotenv').config();

const roles = [
    {
        roleName: 'ADMIN',
    },
    {
        roleName: 'DIRECTOR',
    },
    {
        roleName: 'SECRATORY',
    },
    {
        roleName: 'VP',
    },
    {
        roleName: 'PRESIDENT',
    },
    {
        roleName: 'SECURITY',
    }
];

const seedRoles = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Clear existing roles
        await Role.deleteMany({});
        console.log('Cleared existing roles');

        // Insert new roles
        const createdRoles = await Role.insertMany(roles);
        console.log('Roles seeded successfully:', createdRoles);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

// Run the seeder
seedRoles(); 