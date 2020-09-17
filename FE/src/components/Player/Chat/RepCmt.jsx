import React, {useState,useEffect} from 'react';
import ImageDefault from "../../../utils/helpers/ImageDefault";
import Helper from "../../../utils/helpers/Helper";
import './style.scss';
import NewComment from "./NewComment";
import {useDispatch, useSelector} from "react-redux";
import HeaderRepCmt from "./HeaderRepCmt";
import {listCmtRep, lstCmtVod} from "../../../../redux/actions";
import PopupLogin from "../../Popup/PopupLogin";
import CommentApi from "../../../services/api/Comment/CommentApi";
import CommentNull from "../../Popup/CommentNull";

function RepCmt(props) {

    const dispatch = useDispatch();
    const cmtR = useSelector((state) => state.listCmtRep);
    const [isLogin, setIsLogin] = useState(false);
    const [cmtNull, setCmtNull] = useState(false);
    const listCmtRedux = useSelector((state)=>(state.lstCmtVod))

    const vidDetail = useSelector((state)=>(state.videoDetail))

    function showLogin() {
        setIsLogin(!isLogin)
    }

    function _showCmtNull() {
        setCmtNull(!cmtNull)
    }

    function handleLike(id, is_like) {
        if (Helper.checkLogin()) {
            let data = vidDetail;

            let dataComment = {
                "actionType": is_like === 1 ? "UNLIKECOMMENT" : "LIKECOMMENT",
                "itemId": String(data.id),
                "url": data.link,
                "itemName": data.title,
                "imgUrl": data.image_path,
                "mediaUrl": data.original_path,
                "status": listCmtRedux[props.row].status,
                "gameId": String(data.gameId),
                "streamerId": String(data.user_id),
                "commentId": id,
            };

            if(is_like){
                listCmtRedux[props.row].is_like = 0
                listCmtRedux[props.row].number_like -=1;
            } else {
                listCmtRedux[props.row].is_like = 1
                listCmtRedux[props.row].number_like +=1;
            }

            dispatch(lstCmtVod([...listCmtRedux]))

            CommentApi.likeComment(dataComment, data.secinf).then(
                ({data}) => {
                    Helper.checkTokenExpired(data);
                    Helper.renewToken(data);

                    // if (data.code === 200) {
                    //     listCmtRedux[props.row].number_comment +=1
                    //     dispatch(lstCmtVod([...listCmtRedux]))
                    // }
                }).catch(error => {
                }
            );
        } else {
            setIsLogin(true)
        }
    }

    return (
        <div className='rep-cmt-show'>
            <HeaderRepCmt cancel={props.cancel}/>
            <div>
                <a className="avatar">
                    {ImageDefault.AvatarImg(listCmtRedux[props.row].userInfo.avatar, 'avatar')}
                </a>
                <div className='info-cmt'>
                    <p htmlFor="username" className="username"
                       style={{color: '#fff'}}>
                        <span className='name-user-cmt'>{listCmtRedux[props.row].userInfo.name}</span>
                        <span className='time-cmt'> &bull; {Helper.publicTime(listCmtRedux[props.row].stamp)}</span>
                    </p>
                    <p className="comment">{listCmtRedux[props.row].status}</p>
                    <div className='like-cmt'>
                        <div className='likecmt' onClick={()=> {
                            handleLike(listCmtRedux[props.row].base64RowID, listCmtRedux[props.row].is_like)
                        }}>
                            {listCmtRedux[props.row].is_like === 1 ?
                                <img src='/images/player/is_liked.svg'/>
                                : <img src='/images/player/likecmt.svg'/>}
                            {Helper.formatView(listCmtRedux[props.row].number_like)}
                        </div>
                        <div className='cmt'>
                            <img src='/images/player/cmt.svg'/>
                            <div className='number-cmt'>{Helper.formatView(listCmtRedux[props.row].number_comment) > 3 ? 3 : Helper.formatView(listCmtRedux[props.row].number_comment)}</div>
                        </div>
                    </div>
                    {cmtR ?
                        <ul className="cmt-rep">
                            {cmtR.map((data, index) => {
                                return <li className='detail-cmt-item' key={index}>
                                    <a className="avatar">
                                        {ImageDefault.AvatarImg(data.userInfo.avatar, 'avatar')}
                                    </a>
                                    <div className='list-rep-detail'>
                                <span htmlFor="username" className="username"
                                      style={{color: '#fff'}}>{data.userInfo.name}</span>
                                        <span className='time-cmt'> &bull; {Helper.publicTime(data.stamp)}</span>
                                        <p className="comment">{data.status}</p>
                                    </div>
                                </li>
                            })}
                        </ul>
                        : ''}
                </div>
            </div>
            {isLogin ?
                <PopupLogin cancel={showLogin}/>
                : ''
            }
            {cmtNull?
            <CommentNull cancel={_showCmtNull}/>
            :''}
            <NewComment idSub={listCmtRedux[props.row].base64RowID} showLogin={showLogin} avt={props.avt} cmtNull={_showCmtNull} row={props.row}/>
        </div>
    );
}

export default RepCmt;
