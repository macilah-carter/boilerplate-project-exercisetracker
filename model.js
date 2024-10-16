const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise' 
    }]
})

const exerciseSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const logSchema = new mongoose.Schema({
    count: {
        type: Number
    },
    log:{
        type: [String]
    }
})

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema)
const Logs = mongoose.model('Logs', logSchema)
module.exports = {User, Exercise, Logs}