const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', commentsController.getAll);

router.get('/:id', commentsController.getSingle);

router.post('/', isAuthenticated, validation.saveComment, commentsController.createComment);

router.put('/:id', isAuthenticated, validation.saveComment, commentsController.updateComment);

router.delete('/:id', isAuthenticated, commentsController.deleteComment);

module.exports = router;