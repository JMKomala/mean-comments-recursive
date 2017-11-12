const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    parentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
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

const populateComments = function(next) {
    this.populate({ path: 'comments' });
    next();
}

commentSchema.pre('find', populateComments);

module.exports = mongoose.model('Comment', commentSchema)

