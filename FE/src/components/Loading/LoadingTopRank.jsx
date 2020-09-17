import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

function LoadingTopRank(){
    return (
        <div>
            <SkeletonTheme color="#808080" highlightColor="#444">
                <div style={{marginBottom: '10px'}}>
                    <Skeleton height={60} width={60} style={{marginBottom: "0px", borderRadius: '20px'}}/>
                </div>

            </SkeletonTheme>
        </div>
    );
}

export default LoadingTopRank;