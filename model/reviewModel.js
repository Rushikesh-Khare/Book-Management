const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'book',
        requrired: true,
        trim: true
    },
    reviewedBy: {
        type: String,
        requrired: true,
        default: 'Guest',
        value:{
            type: String,
            trim: true
        },
        trim: true,
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        requrired: true,
        min: 1,
        max: 5,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});
module.exports = mongoose.model('review', reviewSchema);