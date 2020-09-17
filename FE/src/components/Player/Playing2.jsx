import React from 'react';
import ReactPlayer from "react-player";
import Plyr from "plyr";

class Playing extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [],
            showCom: false,
            comment_1:''
        }
        this.touch = this.touch.bind(this);
    }
    componentDidMount(){
        // this is an "echo" websocket service
        this.connection = new WebSocket('wss://echo.websocket.org');
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                messages : this.state.messages.concat([ evt.data ]),
                comment_1: evt.data
            })
        };

        // for testing purposes: sending to the echo service which will send it back back
        setInterval( _ =>{
            this.connection.send( Math.random() )
        }, 2000 )

        this.initPlay();
        this.controls();
        // this.touch();

    }
    initPlay(){
        let content = document.getElementById('test_video');
        let videoContent = null;
        if (content) {
            videoContent = content.firstChild;
        }
        if (videoContent) {
            let options = {
                settings: [],
                tooltips: {controls: true, seek: true},
                i18n: {
                    "play": "Phát",
                    "pause": "Tạm dừng",
                    "seek": "Seek",
                    "played": "Played",
                    "buffered": "Buffered",
                    "currentTime": "Current time",
                    "duration": "Duration",
                    "enterFullscreen": "Toàn màn hình",
                    "exitFullscreen": "Thoát khỏi chế độ toàn màn hình",
                    "start": "Start",
                    "end": "End",
                },
                volume: 0.8
            };
            videoContent = new Plyr(videoContent, options);
        }
    }

    controls(){
        var self = this;
        let plyrProgress = document.getElementsByClassName("plyr__progress__container");
        if (plyrProgress.length > 0) {
            plyrProgress[0].style.visibility = 'hidden';
        }
        let plyrTime = document.getElementsByClassName("plyr__time");
        if (plyrTime.length > 0) {
            plyrTime[0].style.visibility = 'hidden';
        }
        let plyrVolume = document.getElementsByClassName("plyr__volume");
        if (plyrVolume.length > 0) {
            plyrVolume[0].style.visibility = 'hidden';
        }
        var list = document.getElementsByClassName("plyr__controls");
        if (list.length > 0) {
            var newItem = document.createElement("div");
            newItem.id = "div_live_id";
            let spanElement = document.createElement("span");
            spanElement.style.display = "inline-flex";
            spanElement.style.marginTop = "10px";

            let pElement = document.createElement("p");
            pElement.className = "roundLive";
            let textnode = document.createTextNode("LIVE");
            spanElement.appendChild(pElement);
            spanElement.appendChild(textnode);

            let spanElement2 = document.createElement("span");
            spanElement2.style.display = "inline-flex";
            spanElement2.style.marginTop = "10px";
            spanElement2.className = "span-view-live";
            //
            let pElement2 = document.createElement("p");
            pElement2.className = "roundLive";
            let textnode2 = document.createTextNode("150");
            spanElement2.appendChild(pElement2);
            spanElement2.appendChild(textnode2);

            newItem.appendChild(spanElement);
            newItem.appendChild(spanElement2);

            var newItem1 = document.createElement("div");
            newItem1.id = "div_quality_live";

            newItem1.onclick = function () {
                alert('Cai App')
            };

            let spanElement3 = document.createElement("span");
            spanElement3.style.display = "inline-flex";
            spanElement3.style.marginTop = "10px";
            spanElement3.className = "span-view-live";
            newItem1.appendChild(spanElement3);

            list[0].insertBefore(newItem, list[0].childNodes[1]);
            list[0].insertBefore(newItem1, list[0].childNodes[5]);
        }
    }
    componentDidUpdate(){
    }

    touch(){

        var self = this;
        document.getElementById('test_video').addEventListener('touchstart', handleTouchStart, false);
        document.getElementById('test_video').addEventListener('touchmove', handleTouchMove, false);

        var xDown = null;
        var yDown = null;

        function getTouches(evt) {
            return evt.touches ||             // browser API
                evt.originalEvent.touches; // jQuery
        }

        function handleTouchStart(evt) {
            const firstTouch = getTouches(evt)[0];
            xDown = firstTouch.clientX;
            yDown = firstTouch.clientY;
            let divComment = document.getElementById("div_comment_id");
            if (divComment){
                if (divComment.style.visibility === 'hidden'){
                    divComment.style.visibility='hidden';
                }else if (divComment.style.visibility==='visible'){
                    divComment.style.visibility='visible';
                }
            }
        };

        function handleTouchMove(evt) {
            if ( ! xDown || ! yDown ) {
                return;
            }

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                if ( xDiff > 0 ) {
                    let divComment = document.getElementById("div_comment_id");
                    if (!document.isFullScreen && !document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                        if (divComment){
                            divComment.style.visibility='hidden';
                        }
                    }
                    if (divComment){
                        divComment.style.visibility='visible';
                    }
                    var list = document.getElementsByClassName("plyr__controls");
                    list[0].style.visibility = 'hidden'
                    var list_1 = document.getElementsByClassName("plyr--full-ui");
                    list_1[0].style.visibility = 'visible'
                    if (list_1.length > 0) {
                        var newItem_1 = document.createElement("div");
                        newItem_1.id = "div_comment_id";
                        newItem_1.className = "comment_class"
                        list_1[0].insertBefore(newItem_1, list_1[0].childNodes[5]);
                    }
                } else {
                    var list = document.getElementsByClassName("plyr__control--overlaid");
                    list[0].style.visibility = 'visible';
                    var list_1 = document.getElementsByClassName("plyr__controls");
                    list_1[0].style.visibility = 'visible';
                    var list_2 = document.getElementsByClassName("plyr__video-wrapper");
                    list_2[0].style.visibility = 'visible';
                    var list_3 = document.getElementsByClassName("plyr--full-ui");
                    list_3[0].style.visibility = 'hidden'
                    let divComment = document.getElementById("div_comment_id");
                    if (divComment){
                        divComment.style.visibility='hidden';
                    }
                }
            } else {
                if ( yDiff > 0 ) {
                    /* up swipe */
                    console.log(3)
                } else {
                    /* down swipe */
                    console.log(4)
                }
            }
            /* reset values */
            xDown = null;
            yDown = null;
        };
    }

    render() {
        const {showCom} = this.state;

        if(typeof window !== 'undefined') {

            if (!document.isFullScreen && !document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                var divComment = document.getElementById("div_comment_id");
                if (divComment){
                    divComment.style.visibility='hidden';
                }
            }else {
                this.touch();
            }


            let list_1 = document.getElementsByClassName("comment_class");
            if (list_1.length > 0) {

                let ul = document.createElement('p');
                ul.className = "p_live_comment";
                let desComment = document.createTextNode(this.state.comment_1);
                ul.appendChild(desComment);

                // var t, tt;
                // var productList;
                // if (this.state.messages.length > 5){
                //     productList = this.state.messages.splice(-5)
                // }else {
                //     productList = this.state.messages;
                // }
                // productList.forEach(renderProductList);
                // function renderProductList(element, index, arr) {
                //     var li = document.createElement('li');
                //     li.setAttribute('key','msg-' + index);
                //     t = document.createTextNode(element);
                //     li.innerHTML=li.innerHTML + element;
                list_1[0].insertBefore(ul, list_1[0].childNodes[1]);
                // }
            }
        }

        return(
            <div>
                <div id="content" className="test_video">
                    <ReactPlayer
                        className='react-player'
                        id='test_video'
                        controls={true}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload'
                                }
                            }
                        }}
                        playsinline
                        url={'https://content.jwplatform.com/manifests/yp34SRmf.m3u8'}
                    />
                </div>
                {/*<ul>*/}
                {/*    { this.state.messages.slice(-5).map( (msg, idx) =>*/}
                {/*    <li key={'msg-' + idx }>{ msg }</li>*/}
                {/*    )}*/}
                {/*</ul>*/}
            </div>
        );
    }
};

export default Playing;
