import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

function LoadingHomeStream() {

    return (
        <div className='chanel-video-top' style={{margin: '20px 15px 0 15px'}}>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div className='hometoplive'>
                    <Skeleton style={{marginBottom: "10px"}} className='banner-style'/>
                </div>
                <div style={{width:'100%'}}>
                    <div style={{float:'left', borderRadius:'10px'}}>
                        <Skeleton animation="wave" width={30} height={30}/>
                    </div>
                    <div style={{width:'auto', margin:"15px 0 20px 40px"}}>
                        <div style={{marginTop:'-15px'}}><Skeleton animation="wave" height={14} width="100%"/></div>
                        <div><Skeleton animation="wave" height={12} width="80%"/></div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    )
        ;
}

export default LoadingHomeStream;
