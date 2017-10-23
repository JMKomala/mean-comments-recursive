const router = require('express').Router()
const forumPostsController = require('../controllers/forumPosts.controller')()

module.exports = router

// api routes ===========================================================
router.get('/', forumPostsController.getAllPosts)
router.get('/comments', forumPostsController.getAllComments)
router.get('/forumComments', forumPostsController.getBoth)
router.get('/:id', forumPostsController.getOneById)
router.post('/profilePage', forumPostsController.getCommentsByPage)
router.post('/', forumPostsController.insert)
router.post('/post/:id', forumPostsController.asyncPostReplyParent)
router.post('/comment/:id', forumPostsController.asyncPostReplyChild)
router.put('/:id', forumPostsController.updateById)
router.delete('/:id', forumPostsController.removeById)
