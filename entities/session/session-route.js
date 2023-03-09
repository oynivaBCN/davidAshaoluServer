const express = require('express');
const router = express.Router();
const SessionController = require('./session-controller');

router.post('/login', SessionController.login);
router.post('/logout', SessionController.logout);
router.post('/refresh-token', SessionController.refreshToken);
router.post('/signup', SessionController.signUp);

module.exports = router;
