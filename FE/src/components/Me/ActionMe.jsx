import React, {useState} from 'react';
import ConfirmLogout from '../Popup/ConfirmLogout';
import Link from "next/link";

function ActionMe(props) {
    const [cfLogout, setCfLogout] = useState(false);

    function _showCfLO() {
        setCfLogout(!cfLogout);
    }

    return (
        <div className='me_action'>
            <Link href='/becomestreamer'>
                <a>
                    <div className='ma_item'>
                        <img src='/images/tabme/user.svg' className='ma_icon'/>
                        <div className='ma_content'>Trở thành streamer</div>
                        <img src='/images/tabme/open.svg' className='ma_open'/>
                    </div>
                </a>
            </Link>
            <div className='ma_item pointer' onClick={props.showSV}>
                <img src='/images/tabme/info.svg' className='ma_icon'/>
                <div className='ma_content'>Thông tin dịch vụ</div>
                <img src='/images/tabme/open.svg' className='ma_open'/>
            </div>
            {props.islogin ? (
                <div className='ma_item pointer' onClick={_showCfLO}>
                    <img src='/images/tabme/logout.svg' className='ma_icon'/>
                    <div className='ma_content'>Đăng xuất</div>
                    <img src='/images/tabme/open.svg' className='ma_open'/>
                </div>
            ) : (
                ''
            )}
            {cfLogout ? <ConfirmLogout cancel={_showCfLO}/> : ''}
        </div>
    );
}

export default ActionMe;
