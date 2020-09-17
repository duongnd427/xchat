import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Plyr from 'plyr';
import Helper from '../../utils/helpers/Helper';
import {
	API_PUSH_LOG,
	ARR_TIME_LOG,
	DOMAIN_API_SERVICE,
} from '../../config/Config';
import LogXgame from '../../services/api/LogXgame';
import Popup from '../Popup/Popup';
import Error from '../Error';
import LoadingPlayer from '../Loading/LoadingPlayer';
import axios from 'axios';

export class Playing extends Component {
	constructor(props) {
		super(props);
		let isIos = Helper.getOperatingSystem() === 'iOS';
		this.state = {
			isError: false,
			countRetry: 0,
			isIos: isIos,
			url: null,
			pip: false,
			playing: true,
			controls: true,
			light: false,
			volume: 0.8,
			muted: false,
			played: 0,
			loaded: 0,
			duration: 0,
			playbackRate: 1.0,
			loop: false,
			isLogStart: false,
			isLogEnd: false,
			timesStart: 0,
			timePlayed: 0,
			isSeek: '0',
			isShowModal: false,
			isCount: true,
			seconds: 5,
			showCountDownTime: false,
			showPopup: false,
			ccu: this.props.ccu,
		};
		this.handleOrientationChange = this.handleOrientationChange.bind(this); //bind function once
		this.show = this.show.bind(this);
		this.handleBeforeunload = this.handleBeforeunload.bind(this);
	}

	load = (url) => {
		this.setState({
			url,
			played: 0,
			loaded: 0,
			pip: false,
		});
	};
	playPause = () => {
		this.setState({ playing: !this.state.playing });
	};
	stop = () => {
		this.setState({ url: null, playing: false });
	};

	toggleLoop = () => {
		this.setState({ loop: !this.state.loop });
	};
	setVolume = (e) => {
		this.setState({ volume: parseFloat(e.target.value) });
	};
	toggleMuted = () => {
		this.setState({ muted: !this.state.muted });
	};
	setPlaybackRate = (e) => {
		this.setState({ playbackRate: parseFloat(e.target.value) });
	};
	togglePIP = () => {
		this.setState({ pip: !this.state.pip });
	};
	onPlay = () => {
		if (this.state.isLogEnd) {
			let timesStart = new Date().getTime();
			this.setState(
				{
					playing: true,
					timesStart: timesStart,
					timePlayed: 0,
					isSeek: '0',
					isLogStart: false,
					isLogEnd: false,
				},
				() => {
					this.logStart();
				},
			);
		} else {
			this.setState({ playing: true });
		}
	};
	onEnablePIP = () => {
		this.setState({ pip: true });
	};
	onDisablePIP = () => {
		this.setState({ pip: false });
	};
	onPause = () => {
		this.setState({ playing: false });
	};
	// onBuffer = () => {
	//     this.setState({playing: false})
	// }
	onSeekMouseDown = (e) => {
		this.setState({ seeking: true });
	};
	onSeekChange = (e) => {
		this.setState({ played: parseFloat(e.target.value) });
	};
	onSeekMouseUp = (e) => {
		this.setState({ seeking: false });
		this.player.seekTo(parseFloat(e.target.value));
	};
	onProgress = (state) => {
		// We only want to update time slider if we are not currently seeking
		if (!this.state.seeking) {
			if (parseInt(this.state.playedSeconds) != parseInt(state.playedSeconds)) {
				state.timePlayed = this.state.timePlayed + 1;
			}
			this.setState(state, () => {
				if (Helper.inArr(ARR_TIME_LOG, this.state.timePlayed)) {
					let propsData = this.props.data;
					let dataLog = {
						timesstart: String(this.state.timesStart),
						videoId: String(propsData.id),
						mediaUrl: propsData.original_path,
						url: propsData.link,
						trackTime: String(parseInt(state.playedSeconds * 1000)),
						timePlay: String(this.state.timePlayed * 1000),
						duration: String(parseInt(this.state.duration * 1000)),
						isSeek: this.state.isSeek,
						flagLog: String(this.state.timePlayed + 's'),
						isVideoLive: this.props.data.isLive
							? String(this.props.data.isLive)
							: '0',
						cateId: String(this.props.data.gameInfo.id),
						gameId: Helper.checkObjExist(this.props.data, 'gameInfo')
							? String(this.props.data.gameInfo.id)
							: '',
						videoType: String(this.props.data.videoType),
						streamerId: String(this.props.data.streamer.id),
					};
					LogXgame.pushLog(dataLog).then(({ data }) => {
						Helper.renewToken(data);
					});
				}
			});
		}
	};

	onEnded = () => {
		if (!this.state.isLogEnd) {
			this.logEnded();
		}
		let isLive = this.props.data.isLive;
		if (isLive) {
			this.setState({
				isLogEnd: true,
				url: null,
				playing: false,
				loop: false,
			});
		} else {
			this.setState({
				isLogEnd: true,
				playing: this.state.loop,
				isPlay: this.state.loop,
			});
		}
	};
	onDuration = (duration) => {
		this.setState({ duration });
	};
	onClickFullscreen = () => {
		screenfull.request(findDOMNode(this.player));
	};
	renderLoadButton = (url, label) => {
		return <button onClick={() => this.load(url)}>{label}</button>;
	};
	ref = (player) => {
		this.player = player;
	};

	onReady = () => {};
	onStart = () => {
		let timesStart = new Date().getTime();
		let isLogStart = this.state.isLogStart;
		this.setState(
			{
				timesStart: timesStart,
				timePlayed: 0,
				isLogStart: true,
			},
			() => {
				if (!isLogStart) {
					this.logStart();
				}
			},
		);
	};
	onSeek = () => {
		if (this.state.isSeek === '0') {
			this.setState({
				isSeek: '1',
			});
		}
	};
	onError = () => {
		let { url, countRetry } = this.state;

		if (countRetry === 0) {
			this.setState({
				url: url,
				countRetry: 1,
			});
		}
	};

	componentDidMount() {
		var supportsOrientationChange = 'onorientationchange' in window,
			orientationEvent = supportsOrientationChange
				? 'orientationchange'
				: 'resize';

		window.addEventListener(orientationEvent, this.handleOrientationChange);

		if (this.props.data) {
			let data = this.props.data;
			this.setState(
				{
					id: data.id,
					url: data.original_path ? data.original_path : null,
					link: data.link ? data.link : '',
					aspecRatio: data.aspecRatio ? parseFloat(data.aspecRatio) : 0,
				},
				() => {
					this.initPlayer();
				},
			);
		}
		window.addEventListener('beforeunload', this.handleBeforeunload);
	}
	handleBeforeunload(e) {
		e.preventDefault();
		e.returnValue = '';
		let self = this;
		let data = {
			timesstart: String(self.state.timesStart),
			videoId: String(self.state.id),
			mediaUrl: self.state.url,
			url: self.state.link,
			trackTime: String(parseInt(self.state.playedSeconds * 1000)),
			timePlay: String(self.state.timePlayed * 1000),
			duration: String(parseInt(self.state.duration * 1000)),
			isSeek: self.state.isSeek,
			flagLog: 'end',
			isVideoLive: self.props.data.isLive
				? String(self.props.data.isLive)
				: '0',
			cateId: Helper.checkObjExist(self.props.data, 'gameInfo')
				? String(self.props.data.gameInfo.id)
				: '',
			gameId: Helper.checkObjExist(self.props.data, 'gameInfo')
				? String(self.props.data.gameInfo.id)
				: '',
			videoType: String(self.props.data.videoType),
			streamerId: String(self.props.data.streamer.id),
		};

		let timeStamp = new Date().getTime();
		let bodyFormData = new FormData();
		bodyFormData.set('dataEnc', Helper.encryptDataPushLog(data));
		bodyFormData.set('videoId', data.videoId);
		bodyFormData.set('url', data.url);
		bodyFormData.set('psid', Helper.md5Str(String(data.videoId + timeStamp)));
		bodyFormData.set(
			'security',
			Helper.encryptStrPushLog(Helper.md5Str(timeStamp + JSON.stringify(data))),
		);
		bodyFormData.set('platform', 'WAP');
		bodyFormData.set('token', Helper.getToken());

		axios({
			method: 'post',
			url: DOMAIN_API_SERVICE + API_PUSH_LOG,
			data: bodyFormData,
			headers: {
				'Content-Type': 'multipart/form-data',
				clientId: Helper.getClientId(),
				token: Helper.getCookie('tokenWeb') ? Helper.getCookie('tokenWeb') : '',
			},
		})
			.then(function (response) {
				//handle success
				console.log('res:', response);
			})
			.catch(function (response) {
				//handle error
				console.log('error:', response);
			});
	}
	handleOrientationChange = () => {
		this.resizeVideo();
	};

	componentDidUpdate(prevProps, prevState) {
		if (document.getElementsByClassName('roundLive_2')[0]) {
			document.getElementsByClassName(
				'roundLive_2',
			)[0].innerHTML = this.props.ccu;
		}
		if (this.props.data && Helper.checkObjExist(this.props.data, 'id')) {
			if (this.state.id && this.props.data.id !== this.state.id) {
				if (!this.state.isLogEnd) {
					this.logEnded();
				}
				let data = this.props.data;
				let timesStart = new Date().getTime();
				this.setState(
					{
						id: data.id,
						url: data.original_path ? data.original_path : null,
						link: data.link ? data.link : '',
						aspecRatio: data.aspecRatio ? parseFloat(data.aspecRatio) : 0,
						countRetry: 0,

						isSeek: '0',
						isLogStart: false,
						isLogEnd: false,
						timesStart: timesStart,
						timePlayed: 0,
						isCount: true,
						playing: true,
						playedSeconds: 0,
					},
					() => {
						this.initPlayer();
					},
				);
			}
		} else if (!this.state.isError) {
			this.setState(
				{
					isError: true,
				},
				() => {
					return <Error></Error>;
				},
			);
		}
	}

	componentWillUnmount() {
		window.removeEventListener(
			'orientationchange',
			this.handleOrientationChange,
		);
		window.removeEventListener('resize', this.handleOrientationChange);
		window.removeEventListener('beforeunload', this.handleBeforeunload);
		this.handleOrientationChange = null;

		if (!this.state.isLogEnd && !this.state.isError) {
			this.logEnded();
		}

		if (this.playerPlyr) {
			this.playerPlyr.destroy();
		}
	}

	logStart() {
		let dataLog = {
			timesstart: String(this.state.timesStart),
			videoId: String(this.state.id),
			mediaUrl: this.state.url,
			url: this.state.link,
			trackTime: '0',
			timePlay: '0',
			duration: String(parseInt(this.state.duration * 1000)),
			isSeek: this.state.isSeek,
			flagLog: 'start',
			isVideoLive: this.props.data.isLive
				? String(this.props.data.isLive)
				: '0',
			cateId: String(this.props.data.gameInfo.id),
			gameId: String(this.props.data.gameInfo.id),
			videoType: String(this.props.data.videoType),
			streamerId: String(this.props.data.streamer.id),
		};
		LogXgame.pushLog(dataLog).then(({ data }) => {
			Helper.renewToken(data);
		});
	}

	logEnded() {
		let dataLog = {
			timesstart: String(this.state.timesStart),
			videoId: String(this.state.id),
			mediaUrl: this.state.url,
			url: this.state.link,
			trackTime: String(parseInt(this.state.playedSeconds * 1000)),
			timePlay: String(this.state.timePlayed * 1000),
			duration: String(parseInt(this.state.duration * 1000)),
			isSeek: this.state.isSeek,
			flagLog: 'end',
			isVideoLive: this.props.data.isLive
				? String(this.props.data.isLive)
				: '0',
			cateId: Helper.checkObjExist(this.props.data, 'gameInfo')
				? String(this.props.data.gameInfo.id)
				: '',
			gameId: Helper.checkObjExist(this.props.data, 'gameInfo')
				? String(this.props.data.gameInfo.id)
				: '',
			videoType: String(this.props.data.videoType),
			streamerId: String(Helper.checkObjExist(this.props.data, 'streamer') ? this.props.data.streamer.id : ''),
		};
		LogXgame.pushLog(dataLog).then(({ data }) => {
			Helper.renewToken(data);
		});
	}

	initPlayer() {
		let content = document.getElementById('content_video');
		let videoContent = null;
		if (content) {
			videoContent = content.firstChild;
		}
		if (!this.state.isIos) {
			if (!this.playerPlyr) {
				if (videoContent) {
					let options = {
						settings: [],
						tooltips: { controls: true, seek: true },
						i18n: {
							play: 'Phát',
							pause: 'Tạm dừng',
							seek: 'Seek',
							played: 'Played',
							buffered: 'Buffered',
							currentTime: 'Current time',
							duration: 'Duration',
							volume: 'Âm lượng',
							mute: 'Tắt tiếng',
							unmute: 'Bật âm thanh',
							enterFullscreen: 'Toàn màn hình',
							exitFullscreen: 'Thoát khỏi chế độ toàn màn hình',
							start: 'Start',
							end: 'End',
							pip: 'Trình phát mini',
						},
						volume: 0.8,
					};

					this.playerPlyr = new Plyr(videoContent, options);
				}
			}
		}

		if (videoContent) {
			if (this.props.data.image_path) {
				let plyrPoster = document.getElementsByClassName('plyr__poster');
				if (plyrPoster.length > 0) {
					plyrPoster[0].style.backgroundImage =
						"url('" + this.props.data.image_path + "')";
				}
			}
			this.resizeVideo();
		}
		let isLive = this.props.data.isLive;
		let hasLive = this.props.data.hasLive;
		if (isLive == 1 && hasLive == 1) {
			this.checkLive();
		}
	}
	checkLive() {
		if (this.playerPlyr) {
			let plyrProgress = document.getElementsByClassName(
				'plyr__progress__container',
			);
			if (plyrProgress.length > 0) {
				plyrProgress[0].style.visibility = 'hidden';
			}
			let plyrTime = document.getElementsByClassName('plyr__time');
			if (plyrTime.length > 0) {
				plyrTime[0].style.visibility = 'hidden';
			}
			let plyrVolume = document.getElementsByClassName('plyr__volume');
			if (plyrVolume.length > 0) {
				plyrVolume[0].style.visibility = 'hidden';
			}
			var list = document.getElementsByClassName('plyr__controls');
			if (list.length > 0) {
				var newItem = document.createElement('div');
				newItem.id = 'div_live_id';
				newItem.style.display = 'inline-flex';
				newItem.style.fontSize = '12px';
				let spanElement = document.createElement('span');
				spanElement.className = 'span_live';
				// spanElement.style.display = "inline-flex";
				// spanElement.style.marginTop = "10px";

				let pElement = document.createElement('p');
				pElement.className = 'roundLive';
				let textnode = document.createTextNode('Live');
				spanElement.appendChild(pElement);
				spanElement.appendChild(textnode);

				let spanElement2 = document.createElement('span');
				spanElement2.style.display = 'inline-flex';
				// spanElement2.style.marginTop = "10px";
				spanElement2.className = 'span-view-live';

				let svgView = document.createElement('span');
				svgView.style.marginLeft = '-2px';
				svgView.style.marginRight = '3px';
				svgView.style.background = 'unset';
				svgView.style.padding = 'unset';
				svgView.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.74122C0.521305 2.90177 3.00971 0.75 6 0.75C8.99029 0.75 11.4781 2.90177 12 5.74122C11.4787 8.58067 8.99029 10.7324 6 10.7324C3.00971 10.7324 0.52186 8.58067 0 5.74122ZM5.99995 8.51412C7.53138 8.51412 8.77285 7.27265 8.77285 5.74122C8.77285 4.20979 7.53138 2.96832 5.99995 2.96832C4.46852 2.96832 3.22705 4.20979 3.22705 5.74122C3.22705 7.27265 4.46852 8.51412 5.99995 8.51412ZM4.33636 5.74122C4.33636 6.66008 5.08124 7.40496 6.0001 7.40496C6.91895 7.40496 7.66384 6.66008 7.66384 5.74122C7.66384 4.82237 6.91895 4.07748 6.0001 4.07748C5.08124 4.07748 4.33636 4.82237 4.33636 5.74122Z" fill="white"/>
</svg>`;
				spanElement2.appendChild(svgView);
				let pElement2 = document.createElement('p');
				pElement2.className = 'roundLive_2';
				// pElement2.style.display = "inline-flex";
				let textnode2 = document.createTextNode('');
				spanElement2.appendChild(pElement2);
				spanElement2.appendChild(textnode2);

				newItem.appendChild(spanElement);
				newItem.appendChild(spanElement2);

				var newItem1 = document.createElement('div');
				newItem1.id = 'div_quality_live';
				var self = this;
				newItem1.onclick = function () {
					self.setState({
						showPopup: !self.state.showPopup,
					});
				};

				let spanElement3 = document.createElement('span');
				spanElement3.style.display = 'inline-flex';
				spanElement3.style.marginTop = '10px';
				spanElement3.style.marginRight = '10px';
				spanElement3.className = 'span-view-live';
				newItem1.appendChild(spanElement3);

				list[0].insertBefore(newItem, list[0].childNodes[1]);
				list[0].insertBefore(newItem1, list[0].childNodes[5]);
			}
		}
	}
	show() {
		this.setState({
			showPopup: !this.state.showPopup,
		});
	}
	resizeVideo() {
		let screenWith = parseInt(screen.width);
		let strHeight = '231px';
		let aspecRatio = this.state.aspecRatio;

		if (aspecRatio && aspecRatio <= 1) {
			strHeight = parseInt(screenWith * aspecRatio) + 'px';
		} else if (aspecRatio && aspecRatio > 1) {
			strHeight = parseInt(screenWith / aspecRatio) + 'px';
		}
		let content = document.getElementById('content_video');
		if (content) {
			content.style.height = strHeight;
		}

		let plyrWrapper = document.getElementsByClassName('plyr--video');
		if (plyrWrapper.length > 0) {
			plyrWrapper[0].style.height = strHeight;
		}
	}
	render() {
		let data = this.props.data;

		const {
			isIos,
			url,
			playing,
			controls,
			light,
			volume,
			muted,
			loop,
			played,
			loaded,
			duration,
			playbackRate,
			pip,
			showPopup,
		} = this.state;
		if (data) {
			if (data.original_path) {
				return (
					<div>
						<div className='player-videojs'>
							<ReactPlayer
								className='video_react'
								ref={this.ref}
								id='content_video'
								url={url}
								pip={pip}
								playing={playing}
								// playing={true}
								controls={controls}
								config={{
									file: {
										attributes: {
											controlsList: 'nodownload',
											poster: data.image_path ? data.image_path : null,
										},
									},
								}}
								light={light}
								loop={loop}
								playbackRate={playbackRate}
								volume={volume}
								muted={muted}
								onReady={this.onReady}
								onStart={this.onStart}
								onPlay={this.onPlay}
								onEnablePIP={this.onEnablePIP}
								onDisablePIP={this.onDisablePIP}
								onPause={this.onPause}
								onSeek={this.onSeek}
								onEnded={this.onEnded}
								onError={this.onError}
								onProgress={this.onProgress}
								onDuration={this.onDuration}
								playsinline='true'
								webkit-playsinline='true'
							/>
						</div>
						{showPopup ? <Popup type='1' cancel={this.show} /> : ''}
					</div>
				);
			} else
				return (
					<img
						style={{ marginBottom: '-5px' }}
						src={this.props.data.image_path}
					/>
				);
		} else {
			return <LoadingPlayer />;
		}
	}
}
export default Playing;
