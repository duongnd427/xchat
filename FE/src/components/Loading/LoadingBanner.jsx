import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton/lib";

function LoadingBanner() {

    return (
        <div className='banner-homepage'>
            <SkeletonTheme color="#1f1f1f" highlightColor="#444">
                <Skeleton className='banner-style' />
            </SkeletonTheme>
        </div>
    );
}

export default LoadingBanner;
