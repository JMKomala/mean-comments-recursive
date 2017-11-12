
/* global angular */
(function () {
  "use strict";

  angular
    .module("appName")
    .factory("commentService", CommentServiceFactory);

  CommentServiceFactory.$inject = ["$http","$q"];

  function CommentServiceFactory($http,$q) {
    return {
      postComment: _postComment,
      getComments: _getComments,
      deleteComment: _deleteComment,
      postReply:_postReply,
      getCommentsByUrl:_getCommentsByUrl
    }

    //submit new postComment
    function _postComment(postData) {
      return $http
        .post('api/comments', postData)
        .then(_onPostCommentSuccess)
        .catch(_onPostCommentError)
    }

    //reply on a postComment
    function _postReply(comment, parentId) {
      return $http.post(`api/comments/post/${parentId}`, comment)
      .then(_onPostCommentSuccess)
      .catch(_onPostCommentError)
    }

    function _getComments() {
      return $http.get("api/comments")
        .then(_onGetCommentsSuccess)
        .catch(_onGetCommentsError)
    }
    function _getCommentsByUrl(pageUrl) {
      return $http.post('api/comments/getByUrl', pageUrl)
        .then(_onGetCommentsSuccess)
        .catch(_onGetCommentsError)
    }


    function _deleteComment(pageId) {
      return $http.delete("api/comments/:id")
        .then(xhrSuccess)
        .catch(onError)
    }

    function _onGetCommentsSuccess(response) {
      return response.data;
    }

    function _onGetCommentsError(error) {
      return $q.reject(error.data)
    }

    function _onPostCommentSuccess(response) {
      return response.data.item;
    }

    function _onPostCommentError(error) {
      console.log(error.data);
      return $q.reject(error.data)
    }

  }
})();
