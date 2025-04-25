const mongoose = require('mongoose')


const connectDB = async () => {
    try{
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const conn = await mongoose.connect(process.env.MONGO_URL) 
        console.log(`MongoDB Connected: ${conn.connection.host}`);  
        
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}


module.exports = connectDB;