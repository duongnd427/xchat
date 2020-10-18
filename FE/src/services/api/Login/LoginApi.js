import ApiCaller from '../../../utils/apiCaller';
import * as Config from '../../../config/Config';
import QueryString from 'query-string';

function login(email, password) {
	let body = {
		email: email,
		password: password,
	};
	return ApiCaller.callApiXChat(Config.API_USER_LOGIN, 'POST', body);
}

function signup(email, name, password) {
	let body = {
		email: email,
		name: name,
		password: password,
	};
	return ApiCaller.callApiXChat(Config.API_USER_SIGN_UP, 'POST', body);
}

export default {
	login,
	signup,
};
