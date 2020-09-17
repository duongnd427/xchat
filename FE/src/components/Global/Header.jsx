import React, {useState, useEffect} from 'react';
import Link from "next/link";

function Header(props) {
    const [showPopup, setShowPopup] = useState(false);

    function show() {
        setShowPopup(!showPopup)
    }

    function goBack() {
        window.history.back();
    }

    return (
        <div className='listvideo_title' style={{height: '60px'}}>
            <img src='/images/icon-search/back.svg' onClick={props.back ? props.back : goBack} className='icon-back' style={{cursor:'pointer'}}/>
            <h3 className='title_listvideo'>{props.title}</h3>
            <Link href='/app'>
                <img src='/images/icon-header/app.svg' className='download_icon' />
            </Link>
            {/*{showPopup ? <Popup cancel={show} show={showPopup}/> : ''}*/}
        </div>
    );
}

export default Header;
