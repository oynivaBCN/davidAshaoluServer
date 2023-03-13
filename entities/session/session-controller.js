const SessionService = require('./session-service');
const ErrorHelper = require('../../services/error-helper/error-helper');

const SessionController = {
	async login(req, res) {
		const result = await SessionService.login(req.body.username, req.body.password, req.body.otp);
		if (result.error) {
			res.status(ErrorHelper.getErrorStatus(result));
		} else {
			res.status(200);
		}
		return await res.json(result);
	},

	async logout(req, res) {
		const result = await SessionService.logout(req.body.access_token);
		if (result?.error) {
			res.status(ErrorHelper.getErrorStatus(result));
		} else {
			res.status(200);
		}
		return await res.json(result);
	},

	async refreshToken(req, res) {
		const result = await SessionService.refreshToken(req.body.tokens);
		if (result?.error) {
			res.status(ErrorHelper.getErrorStatus(result));
		} else {
			res.status(200);
		}
		return await res.json(result);
	},

	async signUp(req, res) {
		const result = await SessionService.signUp(req.body.username, req.body.email, req.body.password);
		if (result.error) {
			res.status(ErrorHelper.getErrorStatus(result));
		} else {
			res.status(200);
		}
		return await res.json(result);
	},
};

module.exports = SessionController;
