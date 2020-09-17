import React, { useState, useEffect } from 'react';
import HeaderMe from './HeaderMe';
import BannerMe from './BannerMe';
import ActionMe from './ActionMe';
import TopupMe from './TopupMe';
import './me.scss';
import Helper from '../../utils/helpers/Helper';
import InfoService from './InfoService';

function Me(props) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [islogin, setIslogin] = useState(false);
	const [username, setUsername] = useState('');
	const [isStreamer, setIsStreamer] = useState(0);
	const [showService, setShowService] = useState(false);

	function _showSV() {
		setShowService(!showService);
	}

	useEffect(() => {
		if (!isLoaded) {
			setIslogin(Helper.checkLogin());
			setUsername(Helper.getUsername());
			setIsStreamer(
				Helper.getCookie('is_streamer')
					? Helper.getCookie('is_streamer')
					: null,
			);
			setIsLoaded(true);
		}
	}, []);

	return isLoaded ? (
		!showService ? (
			<div className='tabme'>
				<HeaderMe
					username={username}
					isStreamer={isStreamer}
					islogin={islogin}
				/>
				<BannerMe />
				<TopupMe />
				<ActionMe islogin={islogin} showSV={_showSV} />
			</div>
		) : (
			<InfoService back={_showSV} />
		)
	) : (
		''
	);
}

export default Me;
