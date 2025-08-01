const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug: Check if .env is loaded
console.log('Current working directory:', process.cwd());
console.log('.env path:', path.join(__dirname, '.env'));
console.log('Environment variables loaded:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  NODE_ENV: process.env.NODE_ENV
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const connectDB = require('./src/Config/db')
const authRoutes = require('./src/Routes/auth.routes')
const userRoutes = require('./src/Routes/user.routes')
const userRole = require('./src/Routes/role.routes')
const department = require('./src/Routes/department.routes')
const guest = require('./src/Routes/guest.routes')
const car = require('./src/Routes/car.routes')
const visit = require('./src/Routes/visit.routes')
const upload = require('./src/Routes/upload.routes')
const errorHandler = require('./src/Middlewares/errorHandler')
const cookieParser = require('cookie-parser')

const app = express();
connectDB();

// MIDDLEWARES
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React development servers
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/role", userRole)
app.use("/api/department", department)
app.use("/api/guest", guest)
app.use("/api/car", car)
app.use("/api/visit", visit)
app.use("/api/upload", upload)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
    console.log(`testing for notification `)
});

