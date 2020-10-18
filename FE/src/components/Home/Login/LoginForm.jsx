import React, { useState } from 'react';
import { EXPIRES_TIME } from '../../../config/Config';
import LoginApi from '../../../services/api/Login/LoginApi';
import Helper from '../../../utils/helpers/Helper';

function LoginForm(props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function _login() {
		LoginApi.login(email, password).then((response) => {
			switch (response.data.code) {
				case 200:
					Helper.setCookie('token', response.data.token, EXPIRES_TIME);
					window.location.reload();
					break;
				case 401:
					alert('Email không tồn tại');
					break;
				case 402:
					alert('Sai mật khẩu');
					break;
				default:
					alert('Có lỗi xảy ra, vui lòng thử lại');
			}
		});
	}

	return (
		<div className='lg_login'>
			<form>
				<input
					placeholder='Email'
					type='text'
					autoComplete='off'
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					placeholder='Mật khẩu'
					type='password'
					autoComplete='off'
					onChange={(e) => {
						setPassword(e.target.value);
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
