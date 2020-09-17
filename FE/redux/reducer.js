import { actionTypes } from './actions';

const initialState = {
	count: 0,
	error: false,
	lastUpdate: 0,
	light: false,
	placeholderData: null,
	messages: [],
	videoDetail: [],
	listCmtRep: [],
	lstCmtVod: [],
	listTheNap: [],
	newCmt: 0,
};

function reducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.FAILURE:
			return {
				...state,
				...{ error: action.error },
			};

		case actionTypes.INCREMENT:
			return {
				...state,
				...{ count: state.count + 1 },
			};

		case actionTypes.DECREMENT:
			return {
				...state,
				...{ count: state.count - 1 },
			};

		case actionTypes.RESET:
			return {
				...state,
				...{ count: initialState.count },
			};

		case actionTypes.LOAD_DATA_SUCCESS:
			return {
				...state,
				...{ placeholderData: action.data },
			};

		case actionTypes.TICK_CLOCK:
			return {
				...state,
				...{ lastUpdate: action.ts, light: !!action.light },
			};

		case actionTypes.RECEIVED_MESSAGES:
			return {
				...state,
				...{ messages: state.messages.concat(action.msg) },
			};

		case actionTypes.DATA_VIDEO_DETAIL:
			return {
				...state,
				...{ videoDetail: action.videoDetail },
			};

		case actionTypes.LIST_CMT_REP:
			return {
				...state,
				...{ listCmtRep: action.listCmtRep },
			};

		case actionTypes.LST_CMT_VOD:
			return {
				...state,
				...{ lstCmtVod: action.lstCmtVod },
			};
		case actionTypes.THE_NAP:
			return {
				...state,
				...{ listTheNap: action.listTheNap },
			};

		case actionTypes.NEW_CMT_SOCKET:
			return {
				...state,
				...{ newCmt: action.newCmt },
			};

		default:
			return state;
	}
}

export default reducer;
