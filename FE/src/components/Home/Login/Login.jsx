import React, { useState } from 'react';
import './login.scss';
import LoginForm from './LoginForm';
import Signup from './Signup';

function Login(props) {
	const [su, setSu] = useState(false);

	function _showSignup() {
		setSu(!su);
	}

	return (
		<div className='login'>
			<div className='lg_intro'>
				<div className='lg_logo'>XChat</div>
				<div className='lg_title'>
					Chào mừng bạn đến với ứng dụng nhắn tin XChat
				</div>
				<div className='lg_content'>
					Cùng trò chuyện, chia sẻ cảm xúc với bạn bè ngay thôi nào
				</div>
			</div>
			{su ? (
				<Signup showLogin={_showSignup} />
			) : (
				<LoginForm showSignup={_showSignup} />
			)}
		</div>
	);
}

export default Login;
