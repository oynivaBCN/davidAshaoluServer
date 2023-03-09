const { AuthenticationDetails, CognitoUserPool, CognitoUser } = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const Config = require('../../config');
const jwtDecode = require('jwt-decode');

const CognitoHelper = {
	async login(username, password, otp) {
		try {
			if (otp) {
				const confirmAccount = await this.confirmAccount(otp, username);
				if (confirmAccount.error) return { ...confirmAccount, error: true };
			}

			const authenticationData = {
				Username: username,
				Password: password,
			};
			const authenticationDetails = new AuthenticationDetails(authenticationData);

			const poolData = {
				UserPoolId: Config.UserPoolId,
				ClientId: Config.ClientId,
			};
			const userPool = new CognitoUserPool(poolData);

			const userData = {
				Username: username,
				Pool: userPool,
			};
			const cognitoUser = new CognitoUser(userData);

			const cognitoLoginInfo = await new Promise((resolve, reject) => {
				return cognitoUser.authenticateUser(authenticationDetails, {
					onSuccess: function (result) {
						resolve(result);
					},

					onFailure: function (err) {
						reject(err);
					},

					newPasswordRequired: function (err) {
						reject({
							message: 'User must change the password',
							code: 'force_change',
						});
					},
				});
			});

			if (cognitoLoginInfo.error) {
				console.error(cognitoLoginInfo.error);
				throw new Error();
			}

			return {
				payload: cognitoLoginInfo.idToken.payload,
				tokens: {
					access_token: cognitoLoginInfo.accessToken.jwtToken,
					refresh_token: cognitoLoginInfo.refreshToken.token,
				},
			};
		} catch (error) {
			console.error(error);
			return { ...error, error: true };
		}
	},

	async logout(access_token) {
		if (!access_token) return { error: true };
		try {
			const params = {
				AccessToken: access_token,
			};
			AWS.config.update({ region: 'us-east-1' });
			const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
			return cognitoIdentityServiceProvider.globalSignOut(params).promise();
		} catch (error) {
			console.error(error);
			return { ...error, error: true };
		}
	},

	isTokenExpired(decodedAccessToken) {
		const dateNowInSeconds = Math.trunc(Date.now() / 1000);
		const createdTokeninSeconds = parseInt(decodedAccessToken.iat);
		const expirationInSeconds = parseInt(decodedAccessToken.exp);

		const isExpiredAccess = dateNowInSeconds > expirationInSeconds || dateNowInSeconds > createdTokeninSeconds + 1800;
		return !!isExpiredAccess;
	},

	async refreshToken(access_token, refresh_token) {
		try {
			const accessToken = jwtDecode(access_token);
			if (!this.isTokenExpired(accessToken)) {
				console.log('access token not expired');
				return;
			}

			console.log('access token IS expired');
			const params = {
				UserPoolId: Config.UserPoolId,
				ClientId: Config.ClientId,
				AuthFlow: 'REFRESH_TOKEN_AUTH',
				AuthParameters: {
					REFRESH_TOKEN: refresh_token,
				},
			};
			AWS.config.update({ region: 'us-east-1' });
			const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
			const data = await cognitoIdentityServiceProvider.adminInitiateAuth(params).promise();

			const result = {};
			result['access_token'] = data.AuthenticationResult.AccessToken;
			result['id_token'] = data.AuthenticationResult.IdToken;
			result['refresh_token'] = refresh_token;
			return result;
		} catch (error) {
			console.log('refreshtokenerror');
			console.error(error);
			return { ...error, error: true };
		}
	},

	async signUp(username, email, password) {
		try {
			const poolData = {
				UserPoolId: Config.UserPoolId,
				ClientId: Config.ClientId,
			};
			const userPool = new CognitoUserPool(poolData);

			const emailAttribute = [{ Name: 'email', Value: email }];

			const cognitoSignUpInfo = await new Promise((resolve, reject) => {
				return userPool.signUp(username, password, emailAttribute, null, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(result.user);
				});
			});

			console.log('cognitoSignUpInfo', cognitoSignUpInfo);

			return {};
		} catch (error) {
			console.error(error);
			return { ...error, error: true };
		}
	},

	async confirmAccount(otp, username) {
		try {
			const poolData = {
				UserPoolId: Config.UserPoolId,
				ClientId: Config.ClientId,
			};
			const userPool = new CognitoUserPool(poolData);

			const userData = {
				Username: username,
				Pool: userPool,
			};
			const cognitoUser = new CognitoUser(userData);

			const cognitoConfirm = await new Promise((resolve, reject) => {
				return cognitoUser.confirmRegistration(otp, true, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(result);
				});
			});
			return !!cognitoConfirm;
		} catch (error) {
			console.error(error);
			return { ...error, error: true };
		}
	},
};

module.exports = CognitoHelper;

// DA-Resources
// https://www.npmjs.com/package/amazon-cognito-identity-js
// ChatGPT: Overall, to check if an Amazon Cognito access token and refresh token are valid, you can use the getUser method of the CognitoUserPool class to check the access token, and the adminInitiateAuth method of the CognitoIdentityServiceProvider class to check the refresh token.
//    should this be done via frontend or backend or both, to improve security?
//    It's recommended to perform token validation on the backend as well as on the frontend to improve security.
//    Validating the tokens on the backend can help prevent unauthorized access to protected resources even if an attacker has obtained a valid access token. The backend should check the signature and expiration time of the access token and make sure that the user is authorized to access the requested resource. If the token is invalid, the backend should return an HTTP error response.
//    Validating the tokens on the frontend can help provide a better user experience by preventing unnecessary API requests and reducing the chance of getting rate-limited by the backend. The frontend should check the expiration time of the access token and refresh it using the refresh token if necessary. If the refresh token is invalid, the user should be prompted to log in again.
//    By performing token validation on both the frontend and backend, you can add an extra layer of security to your application and help prevent unauthorized access.

// TODO
// Consider AWS-SDK global
