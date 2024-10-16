const mongoose = require('mongoose')

const database = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('db connnected')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = database;