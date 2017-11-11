const path = require('path');
const apiPrefix = '/api/forumPosts';
const commentModel = require('../models/comment');
const commentsService = require('../services/comments.service')({
    modelService: { commentModel: commentModel }
});

module.exports = commentsController;

function commentsController() {
    return {
        insert: insert,
        getAll: getAll,
        getCommentsByPage: getCommentsByPage,
        getOneById: getOneById,
        postReply: postReply,
        updateById: updateById,
        removeById: removeById
    };

    function insert(req, res) {
        let document = req.body;
        document.ip = req.ip;
        let post = new commentModel(document);
        post.validate(err => {
            if (err) {
                return res.status(400).send(err);
            }
            else {
                commentsService.insert(document)
                    .then(post => {
                        return res.status(200).json(post);
                    })
                    .catch(err => {
                        return res.status(500).send(err);
                    });
            }
        })
    }

    function postReply(req, res) {
        let parentId = req.params.id
        let comment = new commentModel(req.body);
        comment.ip = req.ip;
        comment.validate(err => {
            if (err) {
                //when client side error use 400
                return res.status(400).send(err)
            }
            commentsService
                .postReply(comment, parentId)
                .then(response => {
                    res
                        .status(201)
                        .json(response);
                })
                .catch(err => {
                    //when error is from server use 500
                    return res.status(500).send(err)
                })
        })
    }

    function getAll(req, res) {
        commentsService
            .getAll()
            .then(posts => {
                // const responseModel = new responses.ItemsResponse();
                res.json(posts);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }

    function getCommentsByPage(req, res) {
        let queryCondition = req.body.pageUrl;
        commentsService
            .getAllByPage({ 'pageUrl': queryCondition })
            .then(forumPost => {
                res.json(forumPost);
            })
            .catch(err => {
                return res.status(500).send(err);
            });
    }

    function getOneById(req, res) {
        let queryCondition = {
            _id: req.params.id
        };

        commentsService
            .getOne(queryCondition)
            .then(forumPost => {
                res.json(forumPost);
            })
            .catch(err => {
                return res.status(500).send(err);
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
                return res.status(400).send(err)
            } else {
                commentsService.update(queryCondition, document)
                    .then(forumPosts => {
                        return res.status(200).json(forumPost);
                    })
                    .catch(err => {
                        return res.status(500).send(err.stack);
                    })
            }

        })
    }

    function removeById(req, res) {
        let queryCondition = {
            _id: req.params.id
        };
        commentsService
            .removeOne(queryCondition)
            .then(forumPost => {
                res.json(forumPost);
            })
            .catch(err => {
                return res.status(500).send(err);
            });
    }

    function onUpdateSuccess(response) {
        res.status(200).json(response);
    }

}

