import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton/lib";

function LoadingHomeDiscovery() {

    return (

        <div className="disco">
            <SkeletonTheme color="#808080" highlightColor="#444">
                <div style={{display: 'inline-block', width: '100%'}}>
                    <div style={{borderRadius: '10px', float: 'left'}}>
                        <Skeleton height={106} width={188} style={{marginBottom: "10px"}}/>
                    </div>
                    <div style={{marginLeft: '130px', marginTop: '-10px'}}>
                        <div style={{width: 'auto', margin: "20px 0 20px 75px"}}>
                            <div style={{margin: '15px 0'}}>
                                <Skeleton animation="wave" height={14}/>
                            </div>
                            <div>
                                <Skeleton animation="wave" height={10} width="80%"/>
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default LoadingHomeDiscovery;
