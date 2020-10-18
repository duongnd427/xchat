import React, { useEffect, useState } from 'react';
import Helper from '../../utils/helpers/Helper';
import Login from './Login/Login';
import Conversation from './Conversation/Conversation';

function Home(props) {
	const [login, setLogin] = useState(false);

	useEffect(() => {
		setLogin(Helper.checkLogin());
	}, []);

	return login ? <Conversation /> : <Login />;
}

export default Home;
