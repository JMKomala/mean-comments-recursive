(function () {
    'use strict'
    angular.module('appName')
        .controller('commentsController', CommentsController)

    CommentsController.$inject = ['$http', '$location', 'commentService',]

    function CommentsController($http, $location, commentService) {
        'use strict'
        var vm = this
        vm.projectData = {}
        vm.projectData.benefits = []

        vm.postData = {};
        vm.postForm = {};
        vm.replyData = {}
        vm.replyForm = {}

        vm.loggedIn = localStorage.user;
        // var defaultImage = '/public-unrestricted/images/placeholders/author-placeholder.jpg'
        var url = $location.url();
        vm.pageComments = [];
        vm.selectedReply = selectedReply;
        vm.selectedComment = null;
        vm.templatePath = "replyForm.html";

        vm.$onInit = () => {
            //gets all posts and comments
            let pageUrl = url;
            commentService.getComments()
            // commentService.getCommentsByUrl(pageUrl)
                .then(onGetCommentSuccess)
                .catch(onCommentError)
                
        }

        //submit a new post
        vm.submitPost = () => {
            vm.postData.pageUrl = url;
            if (vm.postForm.$invalid) {
                console.log("FormInvalid");
                return;
            }
            commentService.postComment(vm.postData)
                .then(onCommentSubmitSuccess)
                .catch(onCommentError)
        }

        //submits the reply form & checks if its a reply on a post or on a reply
        vm.submitReply = (parentComment, id) => {
            if (parentComment.comment.title) {
                vm.postData.title = parentComment.comment.title
            }
            commentService.postReply(vm.postData, id)
                .then(onReplySuccess)
                .catch(onCommentError)
        }

        //toggle display of reply form
        function selectedReply(commentId) {
            if (commentId == vm.selectedComment) {
                vm.selectedComment = null;
            }
            else {
                vm.selectedComment = commentId;
            }
        }

        vm.showForm = function () {
            vm.showReplyForm = !vm.showReplyForm
        }

        function onGetByIdSuccess(res) {
            vm.projectData = res.data.item
            console.log(vm.projectData)
        }

        function onError(err) {
            console.log(err)
        }

        function onGetCommentSuccess(response) {
            console.log(response);
            vm.pageComments = response;
        }


        function onCommentSubmitSuccess(response) {
            console.log(response);
            vm.postData = {};
            vm.postForm.$setPristine();
            alert('Post Submitted')
            commentService.getCommentsByUrl({ pageUrl: url })
                .then(onGetCommentSuccess)
                .catch(onCommentError)
        }

        function onReplySuccess(response) {
            console.log(response);
            vm.replyData = {};
            vm.replyForm.$setPristine();
            vm.selectedComment = null;
            alert('Reply Submitted')
            commentService.getCommentsByUrl({ pageUrl: url })
                .then(onGetCommentSuccess)
                .catch(onCommentError)
        }
        function onCommentError(error) {
            console.log(error)
        }
    }
})();