const CognitoHelper = require('../../services/cognito/cognito-helper');
const { db } = require('../../services/db/db-queries.js');

const SessionService = {
	async login(username, password, otp) {
		const result = await CognitoHelper.login(username, password, otp);
		if (result.error) return result;

		const { payload, tokens } = result;
		const user = { sub: payload.sub, username: payload['cognito:username'] };

		const resultDB = await db.users.getUserBySub(payload.sub);
		user.id = resultDB.id;
		user.role = resultDB.role;

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
		const cognitoSubOnSignUp = await CognitoHelper.signUp(username, email, password);
		if (!cognitoSubOnSignUp.error) {
			await db.users.createUser(cognitoSubOnSignUp, 'student');
		}
		return {};
	},
};

module.exports = SessionService;
