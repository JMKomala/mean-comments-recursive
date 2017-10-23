(function() {
    'use strict'
    angular.module('green-public.components')
        .component('comment', {
            templateUrl: "public-unrestricted/modules/components/comments/comments.component.html",
            bindings: {
                countOutput: "&"
            },
            controller: commentController
        });

    commentController.$inject = ['$http', '$location', '$state', '$stateParams', 'commentService', 'authenticationService', 'toastr', 'userService'];

    function commentController($http, $location, $state, $stateParams, commentService, authenticationService, toastr, userService) {
        'use strict'
        var $ctrl = this;
        var defaultImage = '/public-unrestricted/images/placeholders/author-placeholder.jpg';

        $ctrl.commentsUrl = $location.url();
        $ctrl.selectedComment = null;
        $ctrl.postData = {};
        $ctrl.postForm = {};
        $ctrl.replyData = {}
        $ctrl.replyForm = {}


        $ctrl.loggedIn = localStorage.user;
        $ctrl.selectedReply = _selectedReply;
        $ctrl.submitPost = _submitPost;
        $ctrl.submitReply = _submitReply;
        $ctrl.$onInit = _$onInit;

        function _$onInit() {
            commentService.getCommentsByPage({ pageUrl: $ctrl.commentsUrl })
                .then(_onGetCommentSuccess)
                .catch(_onCommentError);
        }


        function checkUser() {

            if (localStorage.user) {

                var userData = JSON.parse(localStorage.user);

                $ctrl.postData.user = userData._id;
                $ctrl.replyData.user = userData._id;

                if (userData.facebook) {
                    $ctrl.postData.imageUrl = userData.facebook.photo;
                    $ctrl.postData.name = userData.facebook.name;
                    $ctrl.replyData.imageUrl = userData.facebook.photo;
                    $ctrl.replyData.name = userData.facebook.name;
                }
                if (userData.google) {
                    $ctrl.postData.imageUrl = userData.google.photo;
                    $ctrl.postData.name = userData.google.name;
                    $ctrl.replyData.imageUrl = userData.google.photo;
                    $ctrl.replyData.name = userData.google.name;
                } else {
                    $ctrl.postData.imageUrl = defaultImage;
                    $ctrl.postData.name = userData.name;
                    $ctrl.replyData.imageUrl = defaultImage;
                    $ctrl.replyData.name = userData.name;
                }
            } else {
                $ctrl.postData.imageUrl = defaultImage;
                $ctrl.replyData.imageUrl = defaultImage;

            }
        }





        function _submitPost() {
            if ($ctrl.postForm.$invalid) {
                console.log("Form is invalid");
                return;
            }
            checkUser();

            $ctrl.postData.pageUrl = $ctrl.commentsUrl;

            commentService.postPost($ctrl.postData)
                .then(_onCommentSubmitSuccess)
                .catch(_onCommentError);
        }

        function _submitReply(parentComment, id) {
            ////We have access to parent ID information here
            ////cess the original poster as parentComment.comment.user)
            checkUser();

            ////new fules here
            if (parentComment.comment.title) {
                commentService.postReplyParent($ctrl.replyData, id, parentComment.comment.user)
                    .then(_onReplySuccess)
                    .catch(_onCommentError)
            } else {
                $ctrl.replyData.pageUrl = $ctrl.commentsUrl;
                commentService.postReplyChild($ctrl.replyData, id, parentComment.comment.user)
                    .then(_onReplySuccess)
                    .catch(_onCommentError)
            }
        };

        function _selectedReply(commentId) {
            if (commentId == $ctrl.selectedComment) {
                $ctrl.selectedComment = null;
            } else {
                $ctrl.selectedComment = commentId;
            }
        }

        function _onCommentSubmitSuccess(response) {
            $ctrl.postData = {};
            $ctrl.postForm.$setPristine();
            toastr.success('Post Submitted')
            commentService.getCommentsByPage({ pageUrl: $ctrl.commentsUrl })
                .then(_onGetCommentSuccess)
                .catch(_onCommentError)
        }

        function _onReplySuccess(response) {

            $ctrl.replyData = {};
            $ctrl.replyForm.$setPristine();
            $ctrl.selectedComment = null;
            toastr.success('Reply Submitted')
            commentService.getCommentsByPage({ pageUrl: $ctrl.commentsUrl })
                .then(_onGetCommentSuccess)
                .catch(_onCommentError)
        }

        function _onGetCommentSuccess(response) {
            $ctrl.comments = response.item;
            $ctrl.countOutput({ number: $ctrl.countArray(response.item, "_id").length });

        }

        function _onCommentError(error) {
            if (error.status == 500 && error.data.errors == 'error-saving-reply') {
                toastr.error("Failure to Submit Reply. Try Again.")
            }
        }


        $ctrl.countArray = function findNested(obj, key, returnedArray) {
            var i,
                proto = Object.prototype,
                ts = proto.toString,
                hasOwn = proto.hasOwnProperty.bind(obj);

            if ('[object Array]' !== ts.call(returnedArray)) returnedArray = [];

            for (i in obj) {
                if (hasOwn(i)) {
                    if (i === key) {
                        returnedArray.push(obj[i]);
                    } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
                        findNested(obj[i], key, returnedArray);
                    }
                }
            }
            return returnedArray;
        }

    }
})();
