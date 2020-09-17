import React, { Component } from 'react';
import Link from 'next/link';

export default class Footer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className='footer'>
					<div className='download-app'>
						<h3>Trải nghiệm tốt nhất trên ứng dụng</h3>
						<div className='logo_store'>
							<div className='logo_store_left'>
								<Link href='/app'>
									<img
										src='/images/icon-footer/google-play.svg'
										alt=''
										style={{ width: '100%' }}
									/>
								</Link>
							</div>
							<div className='logo_store_right'>
								<img
									src='/images/icon-footer/app-store.svg'
									alt=''
									style={{ width: '100%' }}
								/>
							</div>
						</div>
					</div>
					<div className='logo'/>
					<div className='company-info'>
						<p>
							Giấy phép: Số 365/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 28/07/2017
						</p>
						<p>
							Cơ quan chủ quản: Công ty Truyền thông Viettel (Viettel Media) – Chi nhánh Tập đoàn Công nghiệp – Viễn
							thông Quân đội.
						</p>
						<p>
							Trụ sở: Tòa nhà The Light, Đường Tố Hữu, Nam Từ Liêm, Hà Nội
						</p>
						<p>
							Chịu trách nhiệm nội dung: Ông Võ Thanh Hải
						</p>
						<p>
							Liên hệ: 198 hoặc duyentnt38@viettel.com.vn
						</p>

						<Link href='/rule'>
							<a style={{marginRight:'18px'}}>Thỏa thuận sử dụng</a>
						</Link>
              <Link href='/policy'>
                  <a>Điều khoản</a>
              </Link>
					</div>
					<img
						src='/images/icon-footer/certificate.svg'
						alt=''
						className='cirtificate'
					/>
				</div>
			</div>
		);
	}
}
