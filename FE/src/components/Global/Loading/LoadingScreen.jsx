import React from 'react';

import { css } from '@emotion/core';
import { BeatLoader } from 'react-spinners';

const override = css`
        text-align: center;
        margin-top: 23.5%;
`;

class LoadingScreen extends React.Component {
    render() {
        return (
            <div style={{position: 'absolute', left: 0, top: 0, height:'100%', width: '100%', backgroundColor: '#fff', zIndex: '10000000001'}}>
                <BeatLoader
                    css={override}
                    sizeUnit={"px"}
                    size={15}
                    color={"#03cc35"}
                />
            </div>
        )
    }
}

export default LoadingScreen;
