const router = require('express').Router()
const commentsController = require('../controllers/comments.controller')()

module.exports = router

// api routes ===========================================================
router.get('/', commentsController.getAll)
router.get('/:id', commentsController.getOneById)

router.post('/profilePage', commentsController.getCommentsByPage)
router.post('/', commentsController.insert)
router.post('/post/:id', commentsController.postReply)


router.put('/:id', commentsController.updateById)
router.delete('/:id', commentsController.removeById)


