import React, { useState, useEffect } from 'react';
import './_navbar.scss';
import Helper from '../../../utils/helpers/Helper';
import Link from 'next/link';
import ImageDefault from '../../../utils/helpers/ImageDefault';

function Navbar() {
	const [location, setLocation] = useState('');
	const [avt, setAvt] = useState(null);
	const [login, setLogin] = useState(false);

	useEffect(() => {
		var prevScrollpos = window.pageYOffset;
		window.addEventListener('scroll', function () {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollpos < currentScrollPos) {
				if (document.getElementById('navbar')) {
					document.getElementById('navbar').style.bottom = '0';
				}
			} else {
				if (document.getElementById('navbar')) {
					document.getElementById('navbar').style.bottom = '-60px';
				}
			}
			prevScrollpos = currentScrollPos;
		});
	}, []);

	useEffect(() => {
		setLogin(Helper.checkLogin());
		setAvt(Helper.getAvt());
		setLocation(Helper.getPathname(window.location.pathname));
	});

	return (
		<div id='navbar' className='navbar_bottom'>
			<Link href='/'>
				<a className='nbr_btn_icon'>
					{location == '/' ? (
						<img src='/images/icon-navbar-footer/home-on.svg' />
					) : (
						<img src='/images/icon-navbar-footer/home-off.svg' />
					)}
				</a>
			</Link>
			{/*<Link href='/ranking'>*/}
			{/*    <a className='nbr_btn_icon'>*/}
			{/*        {location == '/ranking' ? <img src='/images/icon-navbar-footer/bxh-on.svg'/> :*/}
			{/*            <img src='/images/icon-navbar-footer/bxh-off.svg'/>}*/}
			{/*    </a>*/}
			{/*</Link>*/}
			<Link href='/casualgame'>
				<a className='nbr_btn_icon'>
					{location == '/casualgame' ? (
						<img src='/images/icon-navbar-footer/game-on.svg' />
					) : (
						<img src='/images/icon-navbar-footer/game-off.svg' />
					)}
				</a>
			</Link>
			<Link href='/me'>
				<a className='nbr_btn_icon'>
					{login ? (
						avt && avt !== '' ? (
							location == '/me' ? (
								ImageDefault.AvatarImg(avt, 'nbr_avt nbr_avt-in')
							) : (
								ImageDefault.AvatarImg(avt, 'nbr_avt')
							)
						) : location == '/me' ? (
							<img src='/images/icon-navbar-footer/me-on.svg' />
						) : (
							<img src='/images/icon-navbar-footer/me-off.svg' />
						)
					) : location == '/me' ? (
						<img src='/images/icon-navbar-footer/me-on.svg' />
					) : (
						<img src='/images/icon-navbar-footer/me-off.svg' />
					)}
				</a>
			</Link>
		</div>
	);
}

export default Navbar;
