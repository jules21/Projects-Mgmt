const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DB_URL)
    console.log(`MongoDB Connected: ${conn.connection.host}`.rainbow)
}

module.exports = connectDB;