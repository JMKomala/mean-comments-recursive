

function postsService(options) {
    let Posts
    let Comment
    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    Posts = options.modelService.postModel
    Comments = options.modelService.commentModel

    return {
        getAll: getAll,
        getAllByPage: getAllByPage,
        getOne: getOne,
        insert: insert,
        update: update,
        removeOne: removeOne,
        postReplyParent: postReplyParent,
        postReplyChild: postReplyChild
    }

    function insert(document) {
        let post = new Posts(document)
        return post.save()
    }

    function getAll() {
        return Posts.find()
    }

    function postReplyParent(document, postId) {
        let comment = new Comments(document)
        return comment.save()
            .then((newComment) => {
                Posts.findByIdAndUpdate(postId,
                    {
                        $push:
                        { _comments: newComment._id }
                    }).exec()
            })
    }

    function postReplyChild(document, parentId) {
        let comment = new Comments(document)
        return comment.save()
            .then((newComment) => {
                comment.findByIdAndUpdate(parentId,
                    {
                        $push:
                        { _comments: newComment._id }
                    }).exec()
            })
    }


    function getAllByPage(queryCondition) {
        return Posts.find(queryCondition).populate('_comments').exec()
    }

    function getOne(queryCondition) {
        return Posts.findOne(queryCondition)
    }

    function update(queryCondition, comment) {
        return Posts.findByIdAndUpdate(
            queryCondition,
            { $push: { 'comments': comment } },
            { new: true }
        ).exec()
    }

    function removeOne(queryCondition) {
        return Posts.findOneAndRemove(queryCondition)
    }
}

module.exports = postsService