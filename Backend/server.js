const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const connectDB = require('./src/Config/db')
const authRoutes = require('./src/Routes/auth.routes')
const userRoutes = require('./src/Routes/user.routes')
const errorHandler = require('./src/Middlewares/errorHandler')
const cookieParser = require('cookie-parser')


const app = express();
dotenv.config();
connectDB();


// MIDDLEWARES
app.use(cors())

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)


app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});

