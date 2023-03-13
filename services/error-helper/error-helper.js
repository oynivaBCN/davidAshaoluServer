const ErrorHelper = {
	ERROR_STATUS_CODES: {
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		INTERNAL_ERROR: 500,
	},

	COGNITO_ERRORS: {
		NOT_AUTHORIZED: 'NotAuthorizedException',
		INVALID_TOKEN: 'Invalid token specified',
		EXPIRED_CODE: 'ExpiredCodeException',
		INVALID_PASSWORD: 'InvalidPasswordException',
	},

	getErrorStatus(error) {
		// console.log('error-helper:', error);
		if (error.name === this.COGNITO_ERRORS.NOT_AUTHORIZED) {
			return this.ERROR_STATUS_CODES.UNAUTHORIZED;
		}
		if (error.name === this.COGNITO_ERRORS.EXPIRED_CODE) {
			return this.ERROR_STATUS_CODES.UNAUTHORIZED;
		}
		if (error.name === this.COGNITO_ERRORS.INVALID_PASSWORD) {
			return this.ERROR_STATUS_CODES.BAD_REQUEST;
		}

		if (error.error?.message === this.COGNITO_ERRORS.INVALID_TOKEN) {
			return this.ERROR_STATUS_CODES.UNAUTHORIZED;
		}
		if (typeof error.code === 'number') {
			return error.code;
		}
		return this.ERROR_STATUS_CODES.INTERNAL_ERROR;
	},
};

module.exports = ErrorHelper;
