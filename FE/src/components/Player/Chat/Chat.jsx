import React, { useEffect, useState } from 'react';
import ImageDefault from '../../../utils/helpers/ImageDefault';
import './style.scss';
import Helper from '../../../utils/helpers/Helper';
import CommentApi from '../../../services/api/Comment/CommentApi';
import CircularJSON from 'circular-json';
import RepCmt from './RepCmt';
import PopupLogin from '../../Popup/PopupLogin';
import { listCmtRep, lstCmtVod } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import CommentNull from '../../Popup/CommentNull';

function Chat(props) {
	const dispatch = useDispatch();
	const cmtRedux = useSelector((state) => state.lstCmtVod);

	const [typing, setTyping] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [listComments, setListComments] = useState([]);

	const [rowStart, setRowStart] = useState('');
	const [showRepCmt, setShowRepCmt] = useState(false);
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	const [isLogin, setIsLogin] = useState(false);

	const [newComment, setNewComment] = useState('');

	const [newRepCmt, setNewRepCmt] = useState({});
	const [loadMoreControl, setLoadMoreControl] = useState(false);
	const [idCmt, setIdCmt] = useState('');
	const [cmtNull, setCmtNull] = useState(false);

	function onTyping() {
		setTyping(true);
	}

	function handleComment(e) {
		e.preventDefault();

		setNewComment('');

		if (newComment !== '') {
			if (Helper.checkLogin()) {
				if (Helper.checkCmtNull(newComment)) {
					setCmtNull(true);
				} else {
					let data = props.videoDetail;
					let dataComment = {
						actionType: 'COMMENT',
						itemId: String(data.id),
						url: data.link,
						itemName: data.title,
						imgUrl: data.image_path,
						mediaUrl: data.original_path,
						status: newComment,
						gameId: String(data.gameId),
						streamerId: String(data.user_id),
						commentId: '',
					};

					CommentApi.postComment(dataComment, data.secinf)
						.then(({ data }) => {
							Helper.checkTokenExpired(data);
							Helper.renewToken(data);
							if (data.code === 200) {
								// let divNumComment = document.getElementById('ms-comment');
								// if (divNumComment && !isNaN(divNumComment.innerHTML)) {
								//     divNumComment.innerHTML = parseInt(divNumComment.innerHTML) + 1;
								// }
								addComment(newComment, data.data.base64RowID);
							}
						})
						.catch((error) => {
							alert('Lỗi');
						});
				}
			} else {
				setIsLogin(true);
			}
		}
	}

	function addComment(text, rowId = '', toRowId = '') {
		let comment = {
			base64RowID: rowId,
			stamp: new Date().getTime(),
			status: text,
			number_comment: 0,
			number_like: 0,
			is_like: 0,
		};
		comment.userInfo = {
			avatar: Helper.getCookie('avatar') ? Helper.getCookie('avatar') : '',
			name: Helper.getCookie('username') ? Helper.getCookie('username') : '',
		};

		// setListComments([comment, ...listComments])
		dispatch(lstCmtVod([comment, ...cmtRedux]));

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

	function handleLike(id, is_like, row) {
		let userLoggedIn = Helper.checkUserLoggedIn();
		if (!userLoggedIn) {
			setIsLogin(true);
			return;
		}

		let data = props.videoDetail;

		let dataComment = {
			actionType: is_like === 1 ? 'UNLIKECOMMENT' : 'LIKECOMMENT',
			itemId: String(data.id),
			url: data.link,
			itemName: data.title,
			imgUrl: data.image_path,
			mediaUrl: data.original_path,
			status: cmtRedux[row].status,
			gameId: String(data.gameId),
			streamerId: String(data.user_id),
			commentId: id,
		};

		if (is_like) {
			cmtRedux[row].is_like = 0;
			cmtRedux[row].number_like -= 1;
		} else {
			cmtRedux[row].is_like = 1;
			cmtRedux[row].number_like += 1;
		}

		dispatch(lstCmtVod([...cmtRedux]));
		// setListComments([...listComments])
		CommentApi.likeComment(dataComment, data.secinf)
			.then(({ data }) => {
				Helper.checkTokenExpired(data);
				Helper.renewToken(data);

				// if (data.code === 200) {
				//
				// }
			})
			.catch((error) => {});
	}
	function fetchData() {
		// let url = Helper.replaceUrlGetCommentLocal(window.location.href);
		let token = Helper.getCookie('token') ? Helper.getCookie('token') : '';

		CommentApi.getCommentVideo(props.videoDetail.link, rowStart, token).then(
			(response) => {
				if (response) {
					setIsLoaded(true);
					props.setLoadMore(!props.loadMore);
					let data = JSON.parse(CircularJSON.stringify(response.data.data));
					Helper.checkTokenExpired(data);
					Helper.renewToken(data);
					if (data.listComment.length == 10) {
						setLoadMoreControl(true);
					} else {
						setLoadMoreControl(false);
					}
					if (data.listComment.length > 0) {
						setRowStart(
							data.listComment[data.listComment.length - 1].base64RowID,
						);
					}
					// setListComments(listComments.concat(data.listComment));
					dispatch(lstCmtVod(data.listComment));
				}
			},
		);
	}

	function showLogin() {
		setIsLogin(!isLogin);
	}

	function _showCmtNull() {
		setCmtNull(!cmtNull);
	}

	function _showRep(id = '') {
		setIdCmt(id);
		dispatch(listCmtRep(cmtRedux[id].lstSubComment));
		setShowRepCmt(!showRepCmt);
	}

	function cancelRepCmt() {
		setShowRepCmt(!showRepCmt);
		// let url = Helper.replaceUrlGetCommentLocal(window.location.href);
		let token = Helper.getCookie('token') ? Helper.getCookie('token') : '';

		CommentApi.getCommentVideo(props.videoDetail.link, '', token).then(
			(response) => {
				if (response) {
					let data = JSON.parse(CircularJSON.stringify(response.data.data));
					Helper.checkTokenExpired(data);
					Helper.renewToken(data);
					if (data.listComment.length > 0) {
						setRowStart(
							data.listComment[data.listComment.length - 1].base64RowID,
						);
					}
					dispatch(lstCmtVod(data.listComment));
				}
			},
		);
	}

	function getLastCommentReply(id) {
		let comments = cmtRedux;
		for (var i = 0; i < comments.length; i++) {
			if (comments[i].base64RowID === id) {
				let lstSubComment = comments[i].lstSubComment;
				if (lstSubComment && lstSubComment.length > 0) {
					return lstSubComment[lstSubComment.length - 1].base64RowID;
				}
			}
		}
	}

	useEffect(() => {
		// if (!isLoaded) {
		//     fetchData()
		// } else {
		//     if (loadMoreControl && props.loadMore) {
		fetchData();
		// }
		// }
	}, []);

	if (loadMoreControl && props.loadMore) {
		// let url = Helper.replaceUrlGetCommentLocal(window.location.href);
		let token = Helper.getCookie('token') ? Helper.getCookie('token') : '';

		CommentApi.getCommentVideo(props.videoDetail.link, rowStart, token).then(
			(response) => {
				if (response) {
					setIsLoaded(true);
					props.setLoadMore(!props.loadMore);
					let data = JSON.parse(CircularJSON.stringify(response.data.data));
					Helper.checkTokenExpired(data);
					Helper.renewToken(data);
					if (data.listComment.length == 10) {
						setLoadMoreControl(true);
					} else {
						setLoadMoreControl(false);
					}
					if (data.listComment.length > 0) {
						setRowStart(
							data.listComment[data.listComment.length - 1].base64RowID,
						);
					}
					// setListComments(listComments.concat(data.listComment));
					dispatch(lstCmtVod(cmtRedux.concat(data.listComment)));
				}
			},
		);
	}

	return !showRepCmt ? (
		<div className='live-comment'>
			<ul className='chat-list' id='live-cmt'>
				{cmtRedux.length > 0
					? cmtRedux.map((data, index) => {
							return (
								data.userInfo ? <li className='clearfix' key={index}>
                                    <a className='avatar'>
                                        {ImageDefault.AvatarImg(
                                            data.userInfo.avatar ? data.userInfo.avatar : '',
                                            'avatar',
                                        )}
                                    </a>
                                    <div style={{ width: '100%' }}>
                                        <p
                                            htmlFor='username'
                                            className='username'
                                            style={{ color: '#fff' }}
                                        >
											<span className='name-user-cmt'>
												{data.userInfo.name}
											</span>
                                            <span className='time-cmt'>
												{' '}
                                                &bull; {Helper.publicTime(data.stamp)}
											</span>
                                        </p>
                                        <p className='comment'>{data.status}</p>
                                        <div className='like-cmt'>
                                            <div
                                                className='likecmt'
                                                onClick={() => {
                                                    handleLike(data.base64RowID, data.is_like, index);
                                                }}
                                            >
                                                {data.is_like === 1 ? (
                                                    <img src='/images/player/is_liked.svg' />
                                                ) : (
                                                    <img src='/images/player/likecmt.svg' />
                                                )}
                                                {Helper.formatView(data.number_like)}
                                            </div>
                                            <div
                                                className='cmt'
                                                onClick={() => {
                                                    _showRep(index);
                                                }}
                                            >
                                                <img src='/images/player/cmt.svg' />
                                                <div className='number-cmt'>
                                                    {Helper.formatView(data.number_comment) > 3
                                                        ? 3
                                                        : Helper.formatView(data.number_comment)}
                                                </div>
                                            </div>
                                        </div>
                                        {data.lstSubComment ? (
                                            <div className='cmt-rep'>
                                                {data.lstSubComment.length > 1 ? (
                                                    <div
                                                        onClick={() => {
                                                            _showRep(index);
                                                        }}
                                                        className='view-more-repcmt'
                                                    >
                                                        Xem {data.lstSubComment.length - 1} bình luận khác
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                                <a className='avatar'>
                                                    {ImageDefault.AvatarImg(
                                                        data.lstSubComment[0].userInfo.avatar,
                                                        'avatar',
                                                    )}
                                                </a>
                                                <div>
													<span
                                                        htmlFor='username'
                                                        className='username'
                                                        style={{ color: '#fff' }}
                                                    >
														{data.lstSubComment[0].userInfo.name}
													</span>
                                                    <span className='time-cmt'>
														{' '}
                                                        &bull;{' '}
                                                        {Helper.publicTime(data.lstSubComment[0].stamp)}
													</span>
                                                    <p className='comment'>
                                                        {data.lstSubComment[0].status}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </li>
                                    : ''
							);
					  })
					: ''}
			</ul>
			<footer style={{ display: props.rote.footer }}>
				<div className='icon-avt'>
					{ImageDefault.AvatarImg(props.avt, 'avt-me')}
				</div>
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
				<div className='icon' onClick={handleComment}>
					<button className='heart'>
						<img src='images/player/icon_send.svg' />
					</button>
				</div>
			</footer>
			{isLogin ? <PopupLogin cancel={showLogin} /> : ''}
			{cmtNull ? <CommentNull cancel={_showCmtNull} /> : ''}
		</div>
	) : (
		<RepCmt
			data={cmtRedux[idCmt]}
			cancel={cancelRepCmt}
			avt={props.avt}
			row={idCmt}
		/>
	);
}

export default Chat;
