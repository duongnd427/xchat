import React, {useState, useEffect} from 'react';

function HeaderRepCmt(props) {

    return (
        <div className='header-repcmt'>
            <img src='/images/icon-search/back.svg' className='rc_back' style={{cursor: 'pointer'}} onClick={props.cancel}/>
            <h2 className='rc_title'>Trả lời bình luận</h2>
        </div>
    );
}

export default HeaderRepCmt;
