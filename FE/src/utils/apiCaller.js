import axios from 'axios';
import * as Config from './../config/Config';
import qs from 'qs';
import Helper from './helpers/Helper';

function callApiXChat(endpoint, method = 'GET', body = null, headers = null) {
	if (!headers) {
		headers = {
			'content-type': 'application/x-www-form-urlencoded',
		};
	}

	return axios({
		method: method,
		url: `${Config.API_URL}${endpoint}`,
		data: qs.stringify(body),
		headers: headers,
	}).catch((err) => {
		console.log(err);
	});
}

export default {
	callApiXChat,
};
