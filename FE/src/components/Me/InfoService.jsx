import React from 'react';
import Link from 'next/link';

function InfoService(props) {
	return (
		<div className='me_info'>
			<div className='mi_header'>
				<img
					src='/images/tabme/back.svg'
					className='mi_back'
					onClick={props.back}
				/>
				<div className='mi_title'>Thông tin dịch vụ</div>
			</div>
			<div className='mi_app'>
				<img className='mi_logo' src='/images/invited/logo.svg' />
				<div className='mi_info-app'>
					<h2>Xgaming</h2>
					<h3>
						<span>Viettel Media Inc &bull; Miễn phí</span>
					</h3>
					<Link href='/app'>
						<button>Cài đặt ngay</button>
					</Link>
				</div>
			</div>
			<div className='mi_rule'>
				<Link href='/huongdansudung'>
					<a>
						<div className='mi_item'>
							<div className='mi_content'>Hướng dẫn sử dụng</div>
							<img src='/images/tabme/open.svg' className='mi_open' />
						</div>
					</a>
				</Link>
				<Link href='/rule'>
					<a>
						<div className='mi_item'>
							<div className='mi_content'>Thỏa thuận</div>
							<img src='/images/tabme/open.svg' className='mi_open' />
						</div>
					</a>
				</Link>
				<Link href='/policy'>
					<a>
						<div className='mi_item'>
							<div className='mi_content'>Điều khoản</div>
							<img src='/images/tabme/open.svg' className='mi_open' />
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
}

export default InfoService;
