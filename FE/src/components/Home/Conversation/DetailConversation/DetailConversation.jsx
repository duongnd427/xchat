import React from 'react';
import avt from '../../../../../styles/images/avatar.png';
function DetailConversation(props) {
	return (
		<div className='detailconversation'>
			<div className='detail_item-partner'>
				<img className='dip_avt' src={avt} />
				<div className='dip_msg'>an com roi</div>
			</div>

			<div className='detail_item-me'>
				<img className='dim_avt' src={avt} />
				<div className='dim_msg'>an com roi</div>
			</div>
		</div>
	);
}

export default DetailConversation;
