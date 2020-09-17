import React, {useState} from 'react';
import ImageDefault from "../../../utils/helpers/ImageDefault";
import Helper from "../../../utils/helpers/Helper";
import CommentApi from "../../../services/api/Comment/CommentApi";
import {useDispatch, useSelector} from "react-redux";
import {listCmtRep, lstCmtVod} from "../../../../redux/actions";

function NewComment(props) {

    const dispatch = useDispatch();
    const vidDetail = useSelector((state) => (state.videoDetail));
    const listCmtR = useSelector((state) => (state.listCmtRep));

    const [newComment, setNewComment] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const listCmtRedux = useSelector((state)=>(state.lstCmtVod))


    function handleComment(e) {
        e.preventDefault();

        setNewComment('')

        if (newComment !== '') {
            if (Helper.checkLogin()) {
                if(!Helper.checkCmtNull(newComment)){
                    let data = vidDetail;

                    let userinfo = {
                        "msisdn": Helper.getCookie('msisdn'),
                        "avatar": Helper.getCookie('avatar'),
                        "name": Helper.getCookie('username'),
                        "isMochaUser": 0,
                        "isXgameUser": 1,
                        "user_type": 0,
                        "userId": Helper.getCookie('userId'),
                        "username": Helper.getCookie('username'),
                        "user_from": Helper.getCookie('user_from')
                    }

                    let dataComment = {
                        "actionType": "COMMENT",
                        "itemId": String(data.id),
                        "url": data.link,
                        "itemName": data.title,
                        "imgUrl": data.image_path,
                        "mediaUrl": data.original_path,
                        "status": newComment,
                        "gameId": String(data.gameId),
                        "streamerId": String(data.user_id),
                        "commentId": String(props.idSub),
                        "userinfo": JSON.stringify(userinfo)
                    };

                    CommentApi.postComment(dataComment, data.secinf).then(
                        ({data}) => {
                            Helper.checkTokenExpired(data);
                            Helper.renewToken(data);
                            if (data.code === 200) {
                                // let divNumComment = document.getElementById('ms-comment');
                                // if (divNumComment && !isNaN(divNumComment.innerHTML)) {
                                //     divNumComment.innerHTML = parseInt(divNumComment.innerHTML) + 1;
                                // }
                                listCmtRedux[props.row].number_comment +=1
                                dispatch(lstCmtVod([...listCmtRedux]))
                                addComment(newComment, data.data.base64RowID);
                            }

                        }).catch(error => {
                        alert("Lỗi");
                    });
                } else {
                    props.cmtNull();
                }
            } else {
                props.showLogin();
            }


        }
    }

    function addComment(text, rowId = '', toRowId = "") {
        let comment = {
            base64RowID: rowId,
            stamp: new Date().getTime(),
            status: text,
            number_comment: 0,
            number_like: 0,
            is_like: 0
        };
        comment.userInfo = {
            avatar: Helper.getCookie('avatar') ? Helper.getCookie('avatar') : '',
            name: Helper.getCookie('username') ? Helper.getCookie('username') : ''
        };

        if (typeof listCmtR !== "undefined") {
            dispatch(listCmtRep([comment, ...listCmtR]))
        } else {
            dispatch(listCmtRep([comment]))
        }


        // if (toRowId === '') {
        //     comments.unshift(comment);
        //
        //     setComment('');
        //     setComments(comments);
        // } else {
        //     //comment.base64RowID = rowId;
        //     for (var i = 0; i < comments.length; i++) {
        //         if (comments[i].base64RowID === toRowId) {
        //             if (!Helper.checkArrNotEmpty(comments[i], 'lstSubComment')) {
        //                 comments[i].lstSubComment = [];
        //             }
        //             comments[i].lstSubComment.unshift(comment);
        //             comments[i].number_comment = parseInt(comments[i].number_comment) + 1;
        //
        //             setNewRepCmt({
        //                 ['commentReply_' + toRowId]: '',
        //             });
        //             setComments(comments);
        //             return;
        //         }
        //     }
        //     return null;
        // }

    }

    return (
        <div className='input-new-cmt'>
            <div className='icon-avt'>
                {ImageDefault.AvatarImg(props.avt, 'avt-me')}
            </div>
            <div className="enter-comment">
                    <textarea placeholder="Nhập bình luận ..."
                        // onFocus={onTyping}
                        // onBlur={() => {
                        //     if (newComment === '')
                        //         setTyping(false)
                        // }}
                              value={newComment}
                              onChange={(e) => {
                                  e.preventDefault()
                                  setNewComment(e.target.value)
                              }}
                    />
            </div>
            <div className='icon' onClick={handleComment}>
                <button className='heart'><img src='images/player/icon_send.svg'/></button>
            </div>
        </div>
    );
}

export default NewComment;
