import { API_SEARCH_VIDEO } from '../../../config/Config';
import ApiCaller from '../../../utils/apiCaller';

function searchVideo(query, offset = 0) {
	let endpoint =
		API_SEARCH_VIDEO +
		'?limit=20&offset=' +
		offset +
		'&q=' +
		encodeURIComponent(query) +
		'&token=';
	return ApiCaller.callApiXChat(endpoint, 'GET', null);
}

export default {
	searchVideo,
};
