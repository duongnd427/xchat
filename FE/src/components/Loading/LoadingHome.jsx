import React from 'react';
import LoadingBanner from "./LoadingBanner";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import LoadingHomeStream from "./LoadingHomeStream";
import LoadingHomeRanking from "./LoadingHomeRanking";
import LoadingGame from "./LoadingGame";

function LoadingHome(props) {

    return (
        <div >
            <div style={{margin: '20px 15px 0 15px'}}><LoadingBanner/></div>
            <LoadingHomeRanking/>
            <LoadingGame/>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <div style={{width: 'auto', margin: "20px 15px 20px 15px"}}>
                    <Skeleton animation="wave" height={14} width="180px" style={{ borderRadius: '10px'}}/>
                </div>
            </SkeletonTheme>
            <LoadingHomeStream/>
        </div>
    );
}

export default LoadingHome;
