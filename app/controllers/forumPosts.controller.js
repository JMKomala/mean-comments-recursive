const responses = require('../models/responses');
const path = require('path');
const apiPrefix = '/api/forumPosts';
const commentModel = require('../models/comment');
const forumPostModel = require('../models/forumPost');
const userModel = require('../models/user');

const forumPostsService = require('../services/forumPosts.service')({
    modelService: { forumPostModel: forumPostModel, commentModel: commentModel }
});
////used to get user email from ID
const usersService = require('../services/users.service')({
    modelService: userModel
})

//// SEND GRID EMAIL FORMAT 
const contactModel = require('../models/contact');
const contactsService = require('../services/contacts.service')({
    modelService: contactModel
});
//// brings in log service
const logModel = require('../models/log');
const logService = require('../services/log.service')({
    modelService: logModel
});

///Using Asynchronouse
const async = require('async')
///Send Grid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//the wrapper set here is what you need to use in your html/template
sgMail.setSubstitutionWrappers('{{', '}}');


module.exports = forumPostsController;

function forumPostsController() {
    return {
        getAllPosts: getAllPosts,
        getAllComments: getAllComments,
        getBoth: getBoth, //gets comments and posts in parrallel
        getCommentsByPage: getCommentsByPage,
        getOneById: getOneById,
        insert: insert,
        ///postReplyParent: postReplyParent,
        ///postReplyChild: postReplyChild,
        updateById: updateById,
        removeById: removeById,
        asyncPostReplyChild: asyncPostReplyChild,
        asyncPostReplyParent: asyncPostReplyParent
    };

    function insert(req, res) {
        ////sendgrid data
        let document = req.body;
        document.ip = req.ip;
        let forumPost = new forumPostModel(document);
        //VALIDATION
        forumPost.validate(err => {
            if (err) {
                return res.status(400).send(new responses.ErrorResponse(err));
            } else {
                ///insert async parrallel here /// 
                ///task one below
                /// 
                forumPostsService.insert(document)
                    .then(forumPost => {
                        const responseModel = new responses.ItemResponse();
                        responseModel.item = forumPost;
                        return res.status(200).json(responseModel);
                        // .location(path.join(apiPrefix, forumPost._id.toString()))
                    })
                    .catch(err => {
                        return res.status(500).send(new responses.ErrorResponse('FAILUR TO POST'));
                    });
            }
        })
    }

    function getBoth(req, res) {
        async.parallel({
                getPosts: function(callback) {
                    forumPostsService.getAllPosts()
                        .then(function(success) {
                            callback(null, success)
                        })
                        .catch(function(error) {
                            callback(error)
                        })
                },
                getComments: function(callback) {
                    forumPostsService.getAllComments()
                        .then(function(success) {
                            callback(null, success)
                        })
                        .catch(function(error) {
                            callback(error)
                        })
                }
            },
            function(err, results) {
                if (err && err.errors) {
                    res.status(400).json(err);
                } else if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(results);
                }
            }
        )
    };

    function asyncPostReplyParent(req, res) {

        let parentId = req.params.id
        let comment = new commentModel(req.body);
        let originalPosterId = req.body.originalPosterId
        comment.ip = req.ip;
        let originalPoster = ''

        comment.validate(function(error) {
            if (error) {
                //when client side error use 400
                return res.status(400).send(new responses.ErrorResponse(error))
            }
        })


        async.parallel({
            postCommentReply: function(callback) {
                forumPostsService.postReplyParent(comment, parentId)
                    .then(function(response) {

                        callback(null, response)
                        response => {
                            const responseModel = new responses.ItemResponse();
                            responseModel.item = response;
                            res
                                .status(201)
                                .json(responseModel);
                        }
                    })
                    .catch(error => {
                        //when error is from server use 500
                        return res.status(500).send(new responses.ErrorResponse('error-saving-reply'))
                    })
            },
            getUserEmail: function(callback) {
                let queryCondition = {
                    _id: originalPosterId
                }
                usersService
                    .getOne(queryCondition)
                    .then(function(user) {
                        ///callback(null, originalPoster)
                        const responseModel = new responses.ItemResponse();
                        responseModel.item = user;
                        res.json(responseModel);
                        let originalPoster = user

                        sendEmail(originalPoster, comment)

                    })
                    .catch(err => {
                        return res.status(400).send(new responses.ErrorResponse(err));
                    })
            },
        })
    }

    function asyncPostReplyChild(req, res) {

        let parentId = req.params.id
        let comment = new commentModel(req.body);
        let originalPosterId = req.body.originalPosterId
        let originalPoster = ''
        comment.ip = req.ip
        comment.validate(function(error) {
            if (error) {
                //when client side error use 400
                return res.status(400).send(new responses.ErrorResponse(error))
            }
        })
        async.parallel({
            postCommentReply: function(callback) {

                forumPostsService.postReplyChild(comment, parentId)
                    .then(function(response) {
                        callback(null, response)
                        response => {
                            const responseModel = new responses.ItemResponse();
                            responseModel.item = response;
                            res
                                .status(201)
                                .json(responseModel);
                        }
                    })
                    .catch(error => {
                        //when error is from server use 500
                        return res.status(500).send(new responses.ErrorResponse('error-saving-reply'))
                    })
            },
            getUserEmail: function originalPoster(callback) {

                let queryCondition = {
                    _id: originalPosterId
                };
                usersService
                    .getOne(queryCondition)
                    .then(function(user) {
                        ///callback(null, originalPoster)
                        const responseModel = new responses.ItemResponse();
                        responseModel.item = user;
                        res.json(responseModel);
                        let originalPoster = user

                        sendEmail(originalPoster, comment)

                    })
                    .catch(err => {
                        return res.status(400).send(new responses.ErrorResponse(err));
                    })
            },


        })
    }

    function sendEmail(originalPoster, replierInfo) {


        let document = {};
        ///SendGrid TO
        document.to = originalPoster.local.email;
        ///SendGrid FROM
        document.from = {
            email: "projectGreen@wca.ca.gov",
            name: "The GREEN Project"
        }
        ///Sendgrid SUBJECT
        document.subject = "You got a reply. Please Log In to View/ Reply."
        ///Sendgrid TEXT
        document.text = `A user has said  '${replierInfo.text}'  to your comment. Please login to view/reply.`
        let contact = new contactModel(document);
        contact.validate(function(error) {
            if (error) {
                return res.status(400).send(new responses.ErrorResponse(error))
            }
        })

        sgMail.send(document)
            .then(function(success) {

                logEmail(originalPoster, replierInfo)
            })
            .catch(function(error) {
                console.error(error.toString());
                //Extract error msg
                const { message, code, response } = error;
                //Extract response msg
                const { headers, body } = response;
            })
    }

    function logEmail(originalPoster, replierInfo) {
        var activityObject = {
            reply: replierInfo.text,
            id: replierInfo.id,
            commentData: replierInfo,
            userId: originalPoster._id,
            activityType: "NOTIFICATION_COMMENT_REPLY"
        }
        logService.notificationSent(replierInfo, activityObject)
            .then(log => {})
            .catch(err => {

                return
            });
        return
    }

    function getAllPosts(req, res) {
        forumPostsService
            .getAllPosts()
            .then(forumPosts => {
                const responseModel = new responses.ItemsResponse();
                responseModel.items = forumPosts;
                res.json(responseModel);
            })
            .catch(err => {
                res.status(500).send(new responses.ErrorResponse(err));
            });
    }

    function getAllComments(req, res) {
        forumPostsService
            .getAllComments()
            .then(commentPosts => {
                const responseModel = new responses.ItemsResponse();
                responseModel.items = commentPosts;
                res.json(responseModel);
            })
            .catch(err => {
                res.status(500).send(new responses.ErrorResponse(err));
            });
    }

    function getCommentsByPage(req, res) {
        let queryCondition = req.body.pageUrl;
        forumPostsService
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

        forumPostsService
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
                forumPostsService.update(queryCondition, document)
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
        forumPostsService
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
