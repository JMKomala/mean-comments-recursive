const router = require('express').Router()
const postsController = require('../controllers/posts.controller')()

module.exports = router

// api routes ===========================================================
router.get('/', postsController.getAll)
router.get('/:id', postsController.getOneById)

router.post('/profilePage', postsController.getCommentsByPage)
router.post('/', postsController.insert)
router.post('/post/:id', postsController.postReplyParent)
router.post('/comment/:id', postsController.postReplyChild)


router.put('/:id', postsController.updateById)
router.delete('/:id', postsController.removeById)


