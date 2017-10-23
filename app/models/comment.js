const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    isArchived: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String
    },
    ip: {
        type: String,
        required: false
    },
    pageUrl: {
        type: String
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

const populateComments = function(next) {
    this.populate({ path: '_comments' });
    next();
}

CommentSchema.pre('find', populateComments);

module.exports = mongoose.model('Comment', CommentSchema)
