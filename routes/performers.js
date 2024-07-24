const express = require('express');
const router = express.Router();

const performersController= require('../controllers/performers');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', performersController.getAll);

router.get('/:id', performersController.getSingle);

router.post('/', isAuthenticated, validation.savePerformer, performersController.createPerformer);

router.put('/:id', isAuthenticated, validation.savePerformer, performersController.updatePerformer);

router.delete('/:id', isAuthenticated, performersController.deletePerformer);

module.exports = router;