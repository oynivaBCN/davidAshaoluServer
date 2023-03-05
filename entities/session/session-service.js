const CognitoHelper = require('../../services/cognito/cognito-helper');

const SessionService = {
	async login(username, password) {
		const { payload, tokens } = await CognitoHelper.login(username, password);
		const user = { sub: payload.sub, username: payload['cognito:username'] };
		return { user, tokens };
	},

	async logout(access_token) {
		console.log('trying logout', !!access_token);
		return await CognitoHelper.logout(access_token);
	},

	async refreshToken(tokens) {
		return await CognitoHelper.refreshToken(tokens.access, tokens.refresh);
	},
};

module.exports = SessionService;
