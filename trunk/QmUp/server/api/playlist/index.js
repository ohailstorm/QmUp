'use strict';

var express = require('express');
var controller = require('./playlist.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/user/:id',auth.isAuthenticated(), controller.showForUser);


router.post('/', auth.isAuthenticated(), controller.create);

router.post('/:id', auth.isAuthenticated(), controller.addSong);
router.post('/:id/collaborator', auth.isAuthenticated(), controller.addCollaborator);


router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.delete('/:id/song/:songId',auth.isAuthenticated(), controller.deleteSong);

module.exports = router;