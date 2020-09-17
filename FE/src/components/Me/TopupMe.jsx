import React from 'react';
import Link from 'next/link';
import Helper from "../../utils/helpers/Helper";
import Router from "next/router";

function TopupMe(props) {
	return (
		<div className='me_topup'>
			<Link href='/topup'>
				<a>
					<div className='mt_item' onClick={()=>{Helper.setCookie('tabMe',0);Router.push('/topup')}}>
						<img src='/images/tabme/baongoc.svg' />
						<div className='mt_name'>Nạp bảo ngọc</div>
						{/* <div className='mt_promotion'>Còn 52</div> */}
					</div>
				</a>
			</Link>
			<div className='mt_item' onClick={()=>{Helper.setCookie('tabMe',1);Router.push('/topup')}}>
				<img src='/images/tabme/thegame.svg' />
				<div className='mt_name'>Mua thẻ game</div>
				{/* <div className='mt_promotion'>Giảm 50%</div> */}
			</div>
			<div className='mt_item' onClick={()=>{Helper.setCookie('tabMe',2);Router.push('/topup')}}>
				<img src='/images/tabme/napgame.svg' />
				<div className='mt_name'>Nạp game</div>
				{/* <div className='mt_promotion'>Giảm 50%</div> */}
			</div>
		</div>
	);
}

export default TopupMe;
