import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";


function LoadingHomeRanking(){
    return (
        <div style={{marginLeft: '15px'}}>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div style={{width: 'auto', margin: "20px 15px 10px 0px"}}>
                    <Skeleton animation="wave" height={14} width="200px" style={{ borderRadius: '10px'}}/>
                </div>
            </SkeletonTheme>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div style={{marginBottom: '10px'}}>
                    <Skeleton height={50} width={50} style={{marginBottom: "0px", borderRadius: '20px'}}/>
                </div>
                <div style={{marginBottom: '20px', borderRadius: '25px'}}>
                    <Skeleton height={12} width={50} style={{marginBottom: "10px"}}/>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default LoadingHomeRanking;