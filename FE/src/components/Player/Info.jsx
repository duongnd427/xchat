import React, {useState} from 'react';
import Helper from "../../utils/helpers/Helper";
import Link from "next/link";
import ImageDefault from '../../utils/helpers/ImageDefault';
import UserApi from "../../services/api/User/UserApi";
import CircularJSON from "circular-json";
import Router from "next/router";
import UnFollow from "../Popup/UnFollow";
import CommentApi from "../../services/api/Comment/CommentApi";

function Info(props) {
    const [isFollow, setIsFollow] = useState(-1);
    const [popupUnfollow, setPopupUnfollow] = useState(false);
    const [info, setInfo] = useState(props.videoDetail);

    var info_follow = props.videoDetail.streamer;

    function follow() {
        let action = isFollow === -1 ? (info_follow.isFollow === 0 ? 1 : 0) : isFollow === 0 ? 1 : 0;
        if (action === 1) {
            UserApi.followStreamer(info.streamer.id, action).then((response) => {
                if (response) {
                    let data = JSON.parse(CircularJSON.stringify(response)).data;
                    Helper.checkTokenExpired(data);
                    Helper.renewToken(data);
                    if (data.code === 500) {
                        Helper.removeAllCookies();
                        Router.push('/login')
                    }
                    if (data.code === 200) {
                        setIsFollow(action)
                    }
                }
            })
        } else _showConfirm();
    }

    function unfollow() {
        let action = isFollow === -1 ? (info.isFollow === 0 ? 1 : 0) : isFollow === 0 ? 1 : 0;
        UserApi.followStreamer(info.streamer.id, action).then((response) => {
            if (response) {
                let data = JSON.parse(CircularJSON.stringify(response)).data;
                Helper.checkTokenExpired(data);
                Helper.renewToken(data);
                if (data.code === 500) {
                    Helper.removeAllCookies();
                    Router.push('/login')
                }
                if (data.code === 200) {
                    setIsFollow(action)
                }
            }
        })
        _showConfirm();
    }

    function _showConfirm() {
        setPopupUnfollow(!popupUnfollow)
    }

    const sendData = () => {
        if (props.videoDetail.isLive == 1) props.changeActiveTab(0);
        else props.changeActiveTab(1);
        window.scrollTo(0, 0);
    }

    function likeShare(action) {
        CommentApi.likeShareVideo(action, props.videoDetail).then((response) => {
            if(response){
                switch (action) {
                    case 'LIKE':
                        info.is_like=1;
                        info.total_like += 1;
                        setInfo({...info});
                        break;
                    case 'UNLIKE':
                        info.is_like=0;
                        info.total_like -= 1;
                        setInfo({...info});
                        break;
                    case 'SHARE':
                        info.total_share +=1;
                        setInfo({...info});
                        break;
                }
            }
        })
    }

    return (
        info.streamer ?
            <div style={{overflowX: 'hidden'}}>
                {popupUnfollow ?
                    <UnFollow cancel={_showConfirm} unfollow={unfollow}/>
                    : ''}
                <div className='info-streamer-live'>
                    <Link href='/streamer' as={'/streamer/' + info.streamer.id}>
                        <a>
                            <div className="user_info">
                                <div className="avatar-user">
                                    {ImageDefault.AvatarImg(info.streamer.avatar)}
                                    {/* <img src={info.streamer.avatar}
                                 alt=""/> */}
                                </div>
                                <div className="name_user">
                                    <p className="name"> {info.streamer.username}
                                        {info.streamer.isStreamer === 1 ? <img style={{
                                            width: '15px',
                                            marginLeft: '5px',
                                            position: 'absolute',
                                        }} src='/images/streamer/is-streamer.svg' alt=""/> : ''}
                                    </p>
                                    {info.streamer.isFollow > 0 ?
                                        <p style={{textAlign: 'left', margin: '5px'}}> {info.streamer.isFollow} theo
                                            dõi</p>
                                        : ''
                                    }

                                </div>
                            </div>
                        </a>
                    </Link>
                    {
                        isFollow === -1 ?
                            (info.streamer.isFollow ? <div className='pl-follow pl_followed' onClick={follow}>Đã theo dõi</div>
                                :
                                <div className='pl-follow followed' onClick={follow}><img
                                    src='/images/streamer/add.svg'/> Theo dõi</div>)
                            : (isFollow ? <div className='pl-follow pl_followed' onClick={follow}>Đã theo dõi</div>
                            :
                            <div className='pl-follow' onClick={follow}><img src='/images/streamer/add.svg'/> Theo dõi
                            </div>)

                    }
                </div>

                <span className='boder_bottom' style={{width: 'auto', margin: '-5px 15px 0'}}/>

                <div className="title1">
                    <h3 style={{fontSize: '12px'}}>{info.title} </h3>
                    {
                        info.total_view > 0
                            ?
                            <p className="infor1" style={{
                                marginTop: '4px',
                                fontFamily: 'SF UI Text Regular'
                            }}>{Helper.formatView(info.total_view)} lượt
                                xem  &bull; {Helper.publicTime(info.publish_time)}</p>
                            :
                            <p className="infor1" style={{
                                marginTop: '4px',
                                fontFamily: 'SF UI Text Regular'
                            }}>{Helper.publicTime(info.publish_time)}</p>
                    }
                </div>

                <div className='react-video'>
                    <div className="total-like cursor-pointer">{info.is_like === 1 ?
                        <img src='/images/streamer/liked.svg' onClick={()=>{likeShare('UNLIKE')}}/> :
                        <img src='/images/streamer/like.svg' onClick={()=>{likeShare('LIKE')}}/>}
                        <p>{info.total_like}</p></div>
                    <div className="total-comment cursor-pointer" onClick={sendData}><img
                        src='/images/streamer/comment.svg'/><p>{info.total_comment}</p></div>
                    <div className="total-comment cursor-pointer" onClick={props.showShare}><img
                        src='/images/streamer/share.svg'/><p>{info.total_share}</p></div>
                </div>
                <div className="title-bar">

                </div>

                <div className="content" style={{padding: '0 15px'}}>
                    <p style={{
                        fontFamily: 'SF UI Text Regular',
                        textAlign: 'left',
                        fontSize: '12px',
                        overflowWrap: 'break-word'
                    }}>
                        {info.description}
                    </p>
                </div>
            </div>
            : ''
    );
}

export default Info;
