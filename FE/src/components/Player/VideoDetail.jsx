import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Helper from '../../utils/helpers/Helper'
import ImageDefault from "../../utils/helpers/ImageDefault";

function DiscoveryDetail(props) {

    const [pathname, setPathname] = useState('');
    useEffect(() => {
        setPathname(Helper.getPathname(window.location.pathname))
    })

    return (
        <div className="video-detail">
            <div className="chanel-video-top" style={{marginBottom: '10px'}}>
                <div style={{display: 'inline-block', width: '100%'}} onClick={props.setkey}>

                    <Link href='/player' as={Helper.replaceUrl(props.data.link)}>
                        <a>
                            <div style={{float: 'left', position: 'relative', height:'84px'}}>
                                <div style={{bottom: '10%'}}>
                                    {typeof (props.data.gameInfo) != 'undefined' && typeof (props.data.gameInfo.gameName) != 'undefined' ?
                                        <div className="number_bxh">
                                        <span className="span-name-3" style={{
                                            left: '10px',
                                            top: '10px',
                                            maxWidth: '130px',
                                            padding: '2.5px 5px'
                                        }}>{props.data.gameInfo.gameName}</span>
                                        </div>
                                        : ''}
                                </div>
                                {
                                    props.data.isLive === 1 ?
                                        <div style={{position: 'absolute', bottom: '10px', left: '10px'}}>
                                            {
                                                props.data.ccu>50
                                                    ?
                                                    <span className="span-view" style={{margin: 0}}>{Helper.formatView(props.data.ccu)}</span>
                                                    :
                                                    <span className="span-name-live" style={{margin: '0'}}>Live</span>
                                            }

                                        </div>
                                        :
                                        props.data.durationS  ?
                                            <div style={{position: 'absolute', bottom: '10px', right: '0px'}}>
                                            <span
                                                className="span-view1"
                                                style={{fontSize: '12px', padding: '3px 10px'}}>{Helper.getTimeVideo(props.data.durationS)}</span>
                                            </div>
                                            : ''
                                }

                                {ImageDefault.VideoImg(props.data.image_path,'video-detail-search','150px')}

                                {/*<img*/}
                                {/*    src={props.data.image_path}*/}
                                {/*    alt="" width="150px" style={{borderRadius: '10px', width: '150px'}}/>*/}
                            </div>
                        </a>
                    </Link>

                    <div style={{float: 'left', marginLeft: '160px',position: 'absolute'}}>
                        <h3 className="cvt-h3-channel">
                            <Link href='/player' as={Helper.replaceUrl(props.data.link)}>
                                <a className="cvt-h3-lnk-game-2">
                                    <p className="p_title_discover">{props.data.title}</p>
                                </a>
                            </Link>
                            <a className="chanel-dot-more"></a>
                        </h3>
                        <div className="cvt-p">
                            {props.data.streamer ? <span style={{marginRight: '5px', display: 'block'}}>{props.data.streamer.username}</span>: ''}
                            {/*<div>{props.data.streamer.username}</div>*/}
                            {/*<span className='view-time'*/}
                            {/*      style={{*/}
                            {/*          marginLeft: '5px',*/}
                            {/*          marginRight: '5px'*/}
                            {/*      }}>{Helper.formatView(props.data.total_view)} lượt xem</span>*/}
                            {/*&bull;*/}
                            <span className='view-time'
                                  style={{
                                      marginLeft: '0px',
                                      display: 'block',
                                      marginTop: '5px'
                                  }}>{Helper.publicTime(props.data.publish_time)}</span></div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscoveryDetail;
