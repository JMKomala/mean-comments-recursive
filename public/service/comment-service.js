/* global angular */
(function() {
    "use strict";

    angular
        .module("green-public.services")
        .factory("commentService", CommentServiceFactory);

    CommentServiceFactory.$inject = ["$http", "$q"];

    function CommentServiceFactory($http, $q) {
        return {
            postPost: _postPost,
            getComments: _getComments,
            getCommentsByPage: _getCommentsByPage,
            deleteComment: _deleteComment,
            postReplyParent: _postReplyParent,
            postReplyChild: _postReplyChild,
            getBoth: _getBoth

        }

        function _getBoth() {
            return $http.get('api/forumPosts/forumComments')
                .then(_onGetCommentsSuccess)
                .catch(_onError)

        }
        //submit new postComment
        function _postPost(postData) {
            return $http
                .post("api/forumPosts", postData)
                .then(_onPostCommentSuccess)
                .catch(_onPostCommentError)
        }

        //reply on a postComment
        function _postReplyParent(comment, parentId, originalPosterId) {

            comment.originalPosterId = originalPosterId
            return $http.post(`api/forumPosts/post/${parentId}`, comment)
                .then(_onPostCommentSuccess)
                .catch(_onPostCommentError)
        }

        //reply on a replyComment 
        function _postReplyChild(comment, parentId, originalPosterId) {
            comment.originalPosterId = originalPosterId
            return $http.post(`api/forumPosts/comment/${parentId}`, comment)
                .then(_onPostCommentSuccess)
                .catch(_onPostCommentError)
        }

        function _getComments(pageUrl) {
            return $http.get("api/forumPosts")
                .then(_onGetCommentsSuccess)
                .catch(_onGetCommentsError)
        }

        function _getCommentsByPage(pageUrl) {
            return $http.post("api/forumPosts/profilePage", pageUrl)
                .then(_onGetCommentsSuccess)
                .catch(_onGetCommentsError)
        }

        function _deleteComment(pageId) {
            return $http.delete("api/forumPosts/:id")
                .then(xhrSuccess)
                .catch(onError)
        }

        function _onGetCommentsSuccess(response) {
            return response.data;
        }

        function _onGetCommentsError(error) {
            return $q.reject(error.data)
        }

        function _onError(error) {
            return $q.reject(error.data)
        }

        function _onPostCommentSuccess(response) {
            return response.data.item;
        }

        function _onPostCommentError(error) {
            console.log(error.data);
            return $q.reject(error)
        }

    }
})();
