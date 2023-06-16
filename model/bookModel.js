const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        requrired: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type:String,
        requrired: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'user',
        trim: true
    },
    ISBN: {
        type: String,
        requrired: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        requrired: true
    },
    subcategory: {
        type: String,
        requrired: true
    },
    reviews: {
        type: Number,
        default: 0,
        
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        requrired: true
    }

}, {timestamps: true});
module.exports = mongoose.model('books', bookSchema);