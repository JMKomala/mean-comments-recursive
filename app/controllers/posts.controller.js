// const responses = require('../models/responses');
const path = require('path');
const apiPrefix = '/api/forumPosts';
const commentModel = require('../models/comment');
const postModel = require('../models/post');
const postsService = require('../services/post.service')({
    modelService: { postModel: postModel, commentModel: commentModel }
});

module.exports = postsController;

function postsController() {
    return {
        insert: insert,
        getAll: getAll,
        getCommentsByPage: getCommentsByPage,
        getOneById: getOneById,
        postReplyParent: postReplyParent,
        postReplyChild: postReplyChild,
        updateById: updateById,
        removeById: removeById
    };

    function insert(req, res) {
        let document = req.body;
        document.ip = req.ip;
        let post = new postModel(document);
        post.validate(err => {
            if (err) {
                return res.status(400).send(err);
            }
            else {
                postsService.insert(document)
                    .then(post => {
                        return res.status(200).json(post);
                    })
                    .catch(err => {
                        return res.status(500).send(err);
                    });
            }
        })
    }


    function getAll(req, res) {
        postsService
            .getAll()
            .then(posts => {
                // const responseModel = new responses.ItemsResponse();
                res.json(posts);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }

    function postReplyParent(req, res) {
        let parentId = req.params.id
        let comment = new commentModel(req.body);
        comment.ip = req.ip;
        comment.validate(error => {
            if (error) {
                //when client side error use 400
                return res.status(400).send(new responses.ErrorResponse(error))
            }
            postsService
                .postReplyParent(comment, parentId)
                .then(response => {
                    const responseModel = new responses.ItemResponse();
                    responseModel.item = response;
                    res
                        .status(201)
                        .json(responseModel);
                })
                .catch(error => {
                    //when error is from server use 500
                    return res.status(500).send(new responses.ErrorResponse(error))
                })
        })
    }

    function postReplyChild(req, res) {
        let parentId = req.params.id
        let comment = new commentModel(req.body);
        comment.ip = req.ip
        comment.validate(error => {
            if (error) {
                //when client side error use 400
                return res.status(400).send(new responses.ErrorResponse(error))
            }
            postsService
                .postReplyChild(comment, parentId)
                .then(response => {
                    const responseModel = new responses.ItemResponse();
                    responseModel.item = response;
                    res
                        .status(201)
                        .json(responseModel);
                })
                .catch(error => {
                    //when error is from server use 500
                    return res.status(500).send(new responses.ErrorResponse(error))
                })
        })
    }



    function getCommentsByPage(req, res) {
        let queryCondition = req.body.pageUrl;
        postsService
            .getAllByPage({ 'pageUrl': queryCondition })
            .then(forumPost => {
                const responseModel = new responses.ItemResponse();
                responseModel.item = forumPost;
                res.json(responseModel);
            })
            .catch(err => {
                return res.status(500).send(new responses.ErrorResponse(err));
            });
    }

    function getOneById(req, res) {
        let queryCondition = {
            _id: req.params.id
        };

        postsService
            .getOne(queryCondition)
            .then(forumPost => {
                const responseModel = new responses.ItemResponse();
                responseModel.item = forumPost;
                res.json(responseModel);
            })
            .catch(err => {
                return res.status(500).send(new responses.ErrorResponse(err));
            });
    }

    function updateById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }
        let document = req.body;
        let commentUpdate = new commentModel(document);
        //VALIDATION
        commentUpdate.validate(err => {
            if (err) {
                return res.status(400).send(new responses.ErrorResponse(err))
            } else {
                postsService.update(queryCondition, document)
                    .then(forumPosts => {
                        const responseModel = new responses.ItemResponse();
                        responseModel.item = forumPosts;
                        return res.status(200).json(responseModel);
                    })
                    .catch(err => {
                        return res.status(500).send(new responses.ErrorResponse(err.stack));
                    })
            }

        })
    }

    function removeById(req, res) {
        let queryCondition = {
            _id: req.params.id
        };
        postsService
            .removeOne(queryCondition)
            .then(forumPost => {
                const responseModel = new responses.ItemResponse();
                responseModel.item = forumPost;
                res.json(responseModel);
            })
            .catch(err => {
                return res.status(500).send(new responses.ErrorResponse(err));
            });
    }

    function onUpdateSuccess(response) {
        const responseModel = new responses.ItemsResponse()
        responseModel.items = response
        res.status(200).json(responseModel);
    }

}

