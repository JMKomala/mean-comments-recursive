const responses = require('../models/responses');
const path = require('path');
const apiPrefix = '/api/commentPosts';
const commentModel = require('../models/comment');
const commentPostsService = require('../services/commentPosts.service')({
    modelService: commentModel
});

module.exports = commentPostsController;

function commentPostsController() {
    return {

        postComment: postComment

    };
    function postComment(req, res) {
        let document = req.body;
        document.ip = req.ip;
        let queryCondition = req.body.pageUrl;
        commentModel.findOne({ queryCondition }, function (err, pagePost) {
            if (err) {
                return res.send(err);
            }

            //VALIDATION
            let commentPost = new commentModel(document);
            commentPost.validate(err => {
                if (err) {
                    return res.status(400).send(new responses.ErrorResponse(err));
                }
                else {
                    commentPostsService.insert(document)
                        .then(commentPost => {
                            const responseModel = new responses.ItemResponse();
                            responseModel.item = commentPost;
                            console.log(responseModel);
                            return res.status(200).json(responseModel);
                        })
                        .catch(err => {
                            return res.status(500).send(new responses.ErrorResponse(err));
                        });
                }
            })
        })
    }
}

