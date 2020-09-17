export const actionTypes = {
	FAILURE: 'FAILURE',
	INCREMENT: 'INCREMENT',
	DECREMENT: 'DECREMENT',
	RESET: 'RESET',
	LOAD_DATA: 'LOAD_DATA',
	LOAD_DATA_SUCCESS: 'LOAD_DATA_SUCCESS',
	START_CLOCK: 'START_CLOCK',
	TICK_CLOCK: 'TICK_CLOCK',
	HYDRATE: 'HYDRATE',
	RECEIVED_MESSAGES: 'RECEIVED_MESSAGES',
	DATA_VIDEO_DETAIL: 'DATA_VIDEO_DETAIL',
	LIST_CMT_REP: 'LIST_CMT_REP',
	LST_CMT_VOD: 'LST_CMT_VOD',
	THE_NAP: 'THE_NAP',
	NEW_CMT_SOCKET: 'NEW_CMT_SOCKET',
};

export function failure(error) {
	return {
		type: actionTypes.FAILURE,
		error,
	};
}

export function increment() {
	return { type: actionTypes.INCREMENT };
}

export function decrement() {
	return { type: actionTypes.DECREMENT };
}

export function reset() {
	return { type: actionTypes.RESET };
}

export function loadData() {
	return { type: actionTypes.LOAD_DATA };
}

export function loadDataSuccess(data) {
	return {
		type: actionTypes.LOAD_DATA_SUCCESS,
		data,
	};
}

export function startClock() {
	return { type: actionTypes.START_CLOCK };
}

export function tickClock(isServer) {
	return {
		type: actionTypes.TICK_CLOCK,
		light: !isServer,
		ts: Date.now(),
	};
}

export function receivedMessage(msg) {
	return {
		type: actionTypes.RECEIVED_MESSAGES,
		msg: msg,
	};
}

export function dataVideoDetail(videoDetail) {
	return {
		type: actionTypes.DATA_VIDEO_DETAIL,
		videoDetail: videoDetail,
	};
}

export function listCmtRep(cmts) {
	return {
		type: actionTypes.LIST_CMT_REP,
		listCmtRep: cmts,
	};
}

export function lstCmtVod(cmts) {
	return {
		type: actionTypes.LST_CMT_VOD,
		lstCmtVod: cmts,
	};
}

export function listTheNap(list) {
	return {
		type: actionTypes.THE_NAP,
		listTheNap: list,
	};
}

export function newCmt(newCmt) {
	return {
		type: actionTypes.NEW_CMT_SOCKET,
		newCmt: newCmt,
	};
}
