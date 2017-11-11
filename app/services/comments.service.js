module.exports = commentsService

function commentsService(options) {
    let Comments
    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

   Comments = options.modelService.commentModel

    return {
        getAll: getAll,
        getAllByPage: getAllByPage,
        getOne: getOne,
        insert: insert,
        update: update,
        removeOne: removeOne,
        postReply: postReply,
        postReplyChild: postReplyChild
    }
    function getAll() {
        return Comments.find()
    }

    function getAllByPage(queryCondition) {
        // return Comments.find(queryCondition).populate('comments').exec()

        return Comments.aggregate( [
            { $match: { pageUrl: queryCondition } },
            {
                $unwind:
                  {
                    path: "$comments",
                    includeArrayIndex: <string>,
                  }
              }
            {
               $graphLookup: {
                  from: "comments",
                  startWith: "$parentId",
                  connectFromField: "$parentId",
                  connectToField: "name",
                  as: "reportingHierarchy"
               }
            }
         ] ).exec()
    }

    function insert(document) {
        let post = new Comments(document)
        return post.save()
    }

    function postReply(document, parentId) {
        let reply = new Comments(document)
        reply.parentId = parentId;
        return reply.save()
            .then((reply) => {
                Comments.findByIdAndUpdate(parentId,
                    {
                        $push:
                        { comments: reply._id }
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


    function getOne(queryCondition) {
        return Comments.findOne(queryCondition)
    }

    function update(queryCondition, comment) {
        return Comments.findByIdAndUpdate(
            queryCondition,
            { $push: { 'comments': comment } },
            { new: true }
        ).exec()
    }

    function removeOne(queryCondition) {
        return Comments.findOneAndRemove(queryCondition)
    }
}

