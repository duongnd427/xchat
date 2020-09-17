import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";


function LoadingGame(){
    return (
        <div style={{marginLeft: '15px'}}>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div style={{width: 'auto', margin: "0px 15px 20px 0px"}}>
                    <Skeleton animation="wave" height={14} width="160px" style={{ borderRadius: '10px'}}/>
                </div>
            </SkeletonTheme>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div style={{marginBottom: '10px'}}>
                    <Skeleton height={130} width={97} style={{marginBottom: "0px", borderRadius: '10px'}}/>
                </div>
                <div style={{marginBottom: '20px', borderRadius: '25px'}}>
                    <Skeleton height={12} width={97} style={{marginBottom: "20px"}}/>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default LoadingGame;