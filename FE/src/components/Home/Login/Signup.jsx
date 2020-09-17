import React, { useState } from 'react';
import { EXPIRES_TIME } from '../../../config/Config';
import LoginApi from '../../../services/api/Login/LoginApi';
import Helper from '../../../utils/helpers/Helper';

function Signup(props) {
	const [suUsername, setSuUsername] = useState('');
	const [suPw, setSuPw] = useState('');
	const [suRePw, setSuRePw] = useState('');
	const [suPhone, setSuPhone] = useState('');
	// const [suAvatar, setSuAvatar] = useState('');

	function _signup() {
		LoginApi.signup(suUsername, suPhone, suPw, suRePw).then((response) => {
			switch (response.data.code) {
				case 200:
					Helper.setCookie('info', response.data.userInfo, EXPIRES_TIME);
				case 404:
					alert('Mật khẩu không trùng khớp');
				case 500:
					alert('Có lỗi xảy ra, vui lòng thử lại sau');
			}
		});
	}

	return (
		<div className='lg_login'>
			<form>
				<input
					placeholder='Số điện thoại'
					autoComplete='off'
					type='text'
					onChange={(e) => {
						setSuUsername(e.target.value);
					}}
				/>
				<input
					placeholder='Username'
					autoComplete='off'
					type='text'
					onChange={(e) => {
						setSuPhone(e.target.value);
					}}
				/>
				<input
					placeholder='Mật khẩu'
					autoComplete='off'
					type='password'
					onChange={(e) => {
						setSuPw(e.target.value);
					}}
				/>
				<input
					placeholder='Nhập lại mật khẩu'
					autoComplete='off'
					type='password'
					onChange={(e) => {
						setSuRePw(e.target.value);
					}}
				/>

				<div className='signup-button pointer' onClick={_signup}>
					Đăng ký
				</div>
				<div className='line'></div>
				<div className='login-button pointer' onClick={props.showLogin}>
					Đã có tài khoản
				</div>
			</form>
		</div>
	);
}

export default Signup;
