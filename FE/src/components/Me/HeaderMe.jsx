import React from 'react';
import Link from 'next/link';

function HeaderMe(props) {
	return props.islogin ? (
		<div className='me_header'>
			<span className='mh_title'>{props.username}</span>
			<span className='mh_stm'>
				{props.isStreamer == 1 ? <img src='/images/tabme/streamer.svg' /> : ''}
			</span>
			{/*<Link href='/me/update'><a><img src='/images/tabme/change.svg' className='mh_profile' /></a></Link>*/}
		</div>
	) : (
		<div className='me_header'>
			<div className='mh_title'>Chưa đăng nhập</div>
			<Link href='/login'>
				<a>
					<img src='/images/tabme/login.svg' className='mh_profile' />
				</a>
			</Link>
		</div>
	);
}

export default HeaderMe;
