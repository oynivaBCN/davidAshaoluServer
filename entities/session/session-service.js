const CognitoHelper = require('../../services/cognito/cognito-helper');

const SessionService = {
	async login(username, password, otp) {
		const result = await CognitoHelper.login(username, password, otp);
		if (result.error) return result;

		const { payload, tokens } = result;
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

	async signUp(username, email, password) {
		return await CognitoHelper.signUp(username, email, password);
	},
};

module.exports = SessionService;
