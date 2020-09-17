import React from 'react';
import ImageDefault from '../../../utils/helpers/ImageDefault';

function CmtDonate(props) {
	return (
		<div className='cmt-donate'>
			{ImageDefault.AvatarImg(props.data.avatar, 'cd_avt')}
			<div className='cd_user-donate'>
				<h4 className='username'>{props.data.from}</h4>
				<h3 className='comment'>Đã ủng hộ</h3>
			</div>
			<img className='cd_item-donate' src={JSON.parse(props.data.data).icon} />
		</div>
	);
}

export default CmtDonate;
