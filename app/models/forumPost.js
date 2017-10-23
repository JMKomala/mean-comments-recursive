const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('../models/comment');


const ForumPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    pageUrl: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String
    },
    ip: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    text: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    isApproved: { 
        type: Boolean, 
        default: true 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    _comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }]
})

module.exports = mongoose.model('ForumPost', ForumPostSchema)

