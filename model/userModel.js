const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true,

    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 15,
        unique: true,
        trim: true
    },
    address: {

        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }

    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);