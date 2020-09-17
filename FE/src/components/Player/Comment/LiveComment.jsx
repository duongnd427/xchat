import React, {useEffect, useState} from 'react';
import './style.scss';
import ImageDefault from '../../../utils/helpers/ImageDefault';
import PopupLogin from '../../Popup/PopupLogin';
import PopupNewMessage from '../../Popup/PopupNewMessage';
import Helper from '../../../utils/helpers/Helper';
import CommentNull from '../../Popup/CommentNull';
import CmtDonate from './CmtDonate';
import {useDispatch, useSelector} from 'react-redux';
import {newCmt} from '../../../../redux/actions';

function LiveComment(props) {
    const [typing, setTyping] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLike, setIsLike] = useState(false);

    const [popupLogin, setPopupLogin] = useState(false);
    const [commentNull, setCommentNull] = useState(false);

    const [timeDisplay, setTimeDisplay] = useState(false);
    const showed = useSelector((state) => state.newCmt);
    const dispatch = useDispatch();
    const length = useSelector((state) => state.newCmt);

    function createHeart() {
        var body = document.querySelector('body');
        var heart = document.createElement('span');
        heart.className = 'fly-heart';
        heart.style.left = Math.random() * (screen.width - 35) + 'px';
        heart.style.top = '0px';
        body.appendChild(heart);

        setTimeout(function () {
            heart.remove();
        }, 2000);
    }

    function like() {
        if (Helper.checkLogin()) {
            createHeart();
            if (!isLike) {
                sendNewData(4);
                setIsLike(true);
            }
        } else {
            setPopupLogin(!popupLogin);
        }
    }

    function _showCmtNull() {
        setCommentNull(!commentNull);
    }

    function onTyping() {
        setTyping(true);
    }

    function showLogin() {
        setPopupLogin(!popupLogin);
    }

    function hideTyping() {
        setTyping(!typing);
        setNewComment('');
    }

    function sendCmt() {
        if (props.userId !== '') {
            if (Helper.checkCmtNull(newComment)) {
                setCommentNull(!commentNull);
            } else {
                sendNewData(0, newComment);
                hideTyping();
            }
        } else {
            setPopupLogin(!popupLogin);
        }
    }

    function sendNewData(type, newMsgSoc = null) {
        var time = new Date().getTime();
        var idcmtVal = Helper.makeIdcmt();
        let security = props.username + '|' + Helper.getIpAddress() + '|' + time;

        let data = {
            action_type: null,
            channel_avatar: null,
            channel_name: null,
            content_action: null,
            content_url: props.videoDetail.link,
            img_url: props.videoDetail.image_path,
            item_name: props.videoDetail.title,
            item_type: null,
            numfollow: 0,
            post_action_from: 'xgaming',
            site: props.videoDetail.link,
            stampId: time,
            stampId_of_url: 0,
            status: newMsgSoc,
            url: props.videoDetail.link,
            url_temp: null,
            userId: props.userId,
            user_type: 0,

            // action_type: null,
            // channel_avatar: null,
            // channel_name: null,
            // content_action: null,
            // item_type: null,
            // numfollow: 0,
            // post_action_from: 'xgaming',
            // stampId: 1598953267638,
            // stampId_of_url: 0,
            // status: null,
            // url_temp: null,
            // userId: props.userId,
            // user_type: 0
        };

        let chatMessage = {
            idcmt: idcmtVal,
            userId: props.userId,
            message: newMsgSoc,
            from: props.username,
            avatar: props.avtMe,
            roomId: props.idVideo,
            type: type,
            msisdn: props.msisdn,
            countLike: '0',
            isLike: '0',
            levelMessage: '0',
            idRep: null,
            tags: null,
            data: JSON.stringify(data),
            secinf: null,
            token: null,
            security: null,
            timestamp: time,
            timeServer: time,
        };

        let newMsg = {
            type: type,
            chatMessage: chatMessage,
            security: Helper.encryptDataSocket(security),
            user_id: props.userId,
            roomId: props.idVideo,
            timestamp: time,
            messageList: null,
            numberLive: '0',
            typeGift: null,
        };

        props.setNewMsgSocket(JSON.stringify(newMsg));
    }

    useEffect(() => {
        if (
            props.comment.length > 0 &&
            props.comment[props.comment.length - 1].type === '2' &&
            JSON.parse(props.comment[props.comment.length - 1].data).giftType === 1 &&
            length !== props.comment.length
        ) {
            dispatch(newCmt(props.comment.length));
            setTimeDisplay(true);
            setTimeout(() => {
                setTimeDisplay(false);
            }, 3000);
        } else {
            dispatch(newCmt(props.comment.length));
        }
    }, [props.comment]);

    return (
        <div className='live-comment'>
            {timeDisplay ? (
                <CmtDonate data={props.comment[props.comment.length - 1]}/>
            ) : (
                ''
            )}
            <ul className='lc__chat-list'>
                {props.comment && props.comment.length > 0
                    ? props.comment.map((data, index) => {
                        return (
                            <li className='lc__clearfix' key={index}>
                                <a className='avatar'>
                                    {ImageDefault.AvatarImg(data.avatar, 'avatar')}
                                </a>
                                <div>
                                    <p htmlFor='username' className='username'>
                                        {data.from}
                                    </p>
                                    <p className='comment'>
                                        {data.type != '2' ? (
                                            data.type == '4' ? (
                                                <>
                                                    Đã thả tim{' '}
                                                    <img
                                                        style={{width: '16px', marginLeft: '5px'}}
                                                        src='images/player/heart.svg'
                                                    />
                                                </>
                                            ) : (
                                                data.message
                                            )
                                        ) : (
                                            <p style={{color: '#E6C229'}}>
                                                {JSON.parse(data.data).giftType === 1 ? (
                                                    <>
                                                        Đã ủng hộ 1
                                                        <img
                                                            style={{
                                                                width: '26px',
                                                                marginLeft: '5px',
                                                                marginBottom: '-8px',
                                                                marginTop: '-6px',
                                                            }}
                                                            src={JSON.parse(data.data).icon}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        Đã ủng hộ {JSON.parse(data.data).amount}
                                                        <img
                                                            style={{
                                                                width: '14px',
                                                                marginLeft: '5px',
                                                                marginBottom: '-6px',
                                                                marginTop: '-6px',
                                                            }}
                                                            src={JSON.parse(data.data).icon}
                                                        />
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </p>
                                </div>
                            </li>
                        );
                    })
                    : ''}
            </ul>
            <footer style={{display: props.rote.footer}}>
                {typing ? (
                    <div className='icon-avt'>
                        {ImageDefault.AvatarImg(props.avtMe, 'avt-me')}
                    </div>
                ) : (
                    ''
                )}
                <div className='enter-comment'>
					<textarea
                        placeholder='Nhập bình luận ...'
                        onFocus={onTyping}
                        onBlur={() => {
                            if (newComment === '') setTyping(false);
                        }}
                        value={newComment}
                        onChange={(e) => {
                            e.preventDefault();
                            setNewComment(e.target.value);
                        }}
                    />
                </div>
                {!typing ? (
                    <div className='icon'>
                        <button className='donate' onClick={props.showDonate}>
                            Ủng hộ
                        </button>
                        <button className='heart' onClick={like}>
                            <img src='images/player/heart.svg' alt=''/>
                        </button>
                    </div>
                ) : (
                    <div className='icon' onClick={sendCmt}>
                        <button className='heart'>
                            <img src='images/player/icon_send.svg'/>
                        </button>
                    </div>
                )}
            </footer>
            {popupLogin ? <PopupLogin cancel={showLogin}/> : ''}
            {commentNull ? <CommentNull cancel={_showCmtNull}/> : ''}
            {props.isNewMsg ? <PopupNewMessage scroll={props.scrollNewMsg}/> : ''}
        </div>
    );
}

export default LiveComment;
