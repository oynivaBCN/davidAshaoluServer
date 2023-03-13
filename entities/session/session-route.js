const express = require('express');
const router = express.Router();
const SessionController = require('./session-controller');

router.post('/signup', SessionController.signUp);
router.post('/login', SessionController.login);
router.post('/logout', SessionController.logout);
router.post('/refresh-token', SessionController.refreshToken);

module.exports = router;
