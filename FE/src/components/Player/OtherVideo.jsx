import React, {useEffect, useState} from 'react';
import CircularJSON from "circular-json";
import CategoryApi from "../../../src/services/api/Category/CategoryApi";
import VideoDetail from "./VideoDetail";
import LoadingHomeDiscovery from "../Loading/LoadingHomeDiscovery";
import Helper from "../../utils/helpers/Helper";

function OtherVideo(props) {

    const [listVideo, setListVideo] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loadmoreControl, setLoadmoreControl] = useState(true);

    function showVideoLive(videos) {
        if (videos) {
            return videos.map((data, index) => {
                return <VideoDetail data={data} key={index}/>
            })
        }
        return <div style={{margin: '20px 15px'}}>
            <LoadingHomeDiscovery/>
        </div>
    }

    useEffect(() => {
        if (props.loadMore && loadmoreControl) {
            CategoryApi.getVideoRelate(props.id, 10, offset).then((response) => {
                if (response) {
                    props.setLoadMore(false);
                    let videos = JSON.parse(CircularJSON.stringify(response)).data;
                    Helper.checkTokenExpired(videos);
                    Helper.renewToken(videos);
                    setListVideo(listVideo.concat(videos.data))

                    if (videos.data.length === 10) {
                        setOffset(offset + 10)
                    } else setLoadmoreControl(false)
                }
            })
        }
    })

    useEffect(()=>{
        props.setLoadMore(true)
    },[])

    return (
        <div style={{padding: '20px 15px 15px 15px'}}>
            {showVideoLive(listVideo)}
        </div>
    );
}

export default OtherVideo;
