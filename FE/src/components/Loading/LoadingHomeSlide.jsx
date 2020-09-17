import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton/lib";
function LoadingHomeSlide() {

    return (
        <SkeletonTheme color="#808080" highlightColor="#444">
            <div style={{marginBottom: '20px', borderRadius: '10px'}}>
                <Skeleton height={135} style={{marginBottom: "10px"}}/>
            </div>
            <div style={{width:'100%', display:'inline-block'}}>
                <div style={{width:'auto', margin:"20px 0 20px 75px"}}>
                    <div style={{marginBottom:'10px'}}><Skeleton animation="wave" height={14} width="75%"/></div>
                    <div><Skeleton animation="wave" height={10} width="60%"/></div>
                </div>
            </div>
        </SkeletonTheme>
    );
}

export default LoadingHomeSlide;
