const express = require('express');
const router = express.Router();

const participantsController = require('../controllers/participants');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', participantsController.getAll);

router.get('/:id', participantsController.getSingle);

router.post('/:id', isAuthenticated, validation.saveParticipant, participantsController.createParticipant);

router.put('/:id', isAuthenticated, validation.saveParticipant, participantsController.updateParticipant);

router.delete('/:id', isAuthenticated, participantsController.deleteParticipant);

module.exports = router;