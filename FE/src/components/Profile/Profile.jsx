import React from 'react';
import './profile.scss';
import avt from '../../../styles/images/avatar.png';

function Profile(props) {
	return (
		<div className='profile'>
			<div className='p_avatar'>
				<img src={avt} />
				<div className='p_username'>duongnt</div>
			</div>
		</div>
	);
}

export default Profile;
