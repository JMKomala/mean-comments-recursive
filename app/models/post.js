const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('../models/comment');


const PostSchema = new Schema({
    pageUrl: {
        type: String
    },
    title: {
        type: String,
        // required: true,
    },
    text: {
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
        // required: true
    },
    imageUrl: {
        type: String
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Post', PostSchema)

