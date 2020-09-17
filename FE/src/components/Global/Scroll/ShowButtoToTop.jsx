import React, { Component } from 'react';
import ScrollUpButton from 'react-scroll-up-button';
import icon_gototop from '../../../../styles/images/icon_gototop.png';

class ShowButtoToTop extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollUpButton
                ContainerClassName="AnyClassForContainer"
                TransitionClassName="AnyClassForTransition"
            >
                <a>
                    <img src={icon_gototop} alt="goto top" style={{paddingBottom: '15px'}}/>
                </a>
            </ScrollUpButton>
        );
    }
}

export default ShowButtoToTop;

