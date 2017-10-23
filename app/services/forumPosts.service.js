module.exports = forumPostsService

function forumPostsService(options) {
    let ForumPosts
    let CommentPosts

    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    ForumPosts = options.modelService.forumPostModel
    CommentPosts = options.modelService.commentModel

    return {
        getAllPosts: getAllPosts,
        getAllComments: getAllComments,
        getAllByPage: getAllByPage,
        getOne: getOne,
        insert: insert,
        update: update,
        removeOne: removeOne,
        postReplyParent: postReplyParent,
        postReplyChild: postReplyChild
    }

    function postReplyParent(document, postId) {
        
        let commentPosts = new CommentPosts(document)
        return commentPosts.save()
            .then((newComment) => {
                ForumPosts.findByIdAndUpdate(postId, {
                    $push: { _comments: newComment._id }
                }).exec()
            })
    }

    function postReplyChild(document, parentId) {
        let commentPosts = new CommentPosts(document)
        return commentPosts.save()
            .then((newComment) => {
                CommentPosts.findByIdAndUpdate(parentId, {
                    $push: { _comments: newComment._id }
                }).exec()
            })
    }

    function getAllPosts() {
        return ForumPosts.find()
    }

    function getAllComments() {
        return CommentPosts.find()
    }

    function getAllByPage(queryCondition) {
        return ForumPosts.find(queryCondition).populate('_comments').exec()
    }

    function getOne(queryCondition) {
        return ForumPosts.findOne(queryCondition)
    }

    function insert(document) {
        let forumPosts = new ForumPosts(document)
        return forumPosts.save()
    }

    function update(queryCondition, comment) {
        return ForumPosts.findByIdAndUpdate(
            queryCondition, { $push: { 'comments': comment } }, { new: true }
        ).exec()
    }

    function removeOne(queryCondition) {
        return ForumPosts.findOneAndRemove(queryCondition)
    }
}
