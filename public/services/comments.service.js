
/* global angular */
(function () {
  "use strict";

  angular
    .module("appName")
    .factory("commentService", CommentServiceFactory);

  CommentServiceFactory.$inject = ["$http"];

  function CommentServiceFactory($http) {
    return {
      post: _post,
      getComments: _getComments,
      deleteComment: _deleteComment,
      postReplyParent: _postReplyParent,
      postReplyChild: _postReplyChild
    }

    //submit new postComment
    function _post(postData) {
      return $http
        .post('api/comments', postData)
        .then(_onPostCommentSuccess)
        .catch(_onPostCommentError)
    }

    function _getComments() {
      return $http.get("api/comments")
        .then(_onGetCommentsSuccess)
        .catch(_onGetCommentsError)
    }

    
    //reply on a postComment
    function _postReplyParent(comment, parentId) {
      return $http.post(`api/comments/post/${parentId}`, comment)
      .then(_onPostCommentSuccess)
      .catch(_onPostCommentError)
    }

    //reply on a replyComment 
    function _postReplyChild(comment, parentId) {
      return $http.post(`api/comments/comment/${parentId}`, comment)
      .then(_onPostCommentSuccess)
      .catch(_onPostCommentError)
    }

 

  //   function _getCommentsByPage(pageUrl) {
  //     return $http.post("api/comments/profilePage", pageUrl)
  //       .then(_onGetCommentsSuccess)
  //       .catch(_onGetCommentsError)
  //   }

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
