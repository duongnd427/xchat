import ApiCaller from '../../../utils/apiCaller';
import * as Config from '../../../config/Config';
import QueryString from 'query-string';

function login(username, pw) {
	return ApiCaller.callApiXChat(
		Config.API_USER_LOGIN + '?username=' + username + '&password=' + pw,
		'GET',
		null,
	);
}

function signup(phone, username, pw, repw) {
	let body = {
		username: username,
		phone: phone,
		password: pw,
		repassword: repw,
		avatar: '',
	};
	return ApiCaller.callApiXChat(Config.API_USER_SIGN_UP, 'POST', body);
}

export default {
	login,
	signup,
};
