import React, { useState } from 'react';
import LoginApi from '../../../services/api/Login/LoginApi';

function LoginForm(props) {
	const [username, setUsername] = useState('');
	const [pw, setPw] = useState('');

	function _login() {
		LoginApi.login(username, pw).then((response) => {
			console.log(response);
		});
	}

	return (
		<div className='lg_login'>
			<form>
				<input
					placeholder='Username hoặc số điện thoại'
					type='text'
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<input
					placeholder='Mật khẩu'
					type='password'
					onChange={(e) => {
						setPw(e.target.value);
					}}
				/>
				<div className='lg_forgot-pw pointer'>Quên mật khẩu?</div>
				<div className='login-button pointer' onClick={_login}>
					Đăng nhập
				</div>
			</form>
			<div className='line'></div>
			<div className='signup-button pointer' onClick={props.showSignup}>
				Chưa có tài khoản
			</div>
		</div>
	);
}

export default LoginForm;
