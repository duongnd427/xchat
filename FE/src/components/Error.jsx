import React from 'react';
import FooterVideoMocha from "./Global/Footer/FooterXgame";
import Router from "next/router";

class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.redirect = setInterval(function () {
            // history.goBack();
            Router.replace('/');
        }.bind(this), 5000);
    }


    componentWillUnmount() {
        clearInterval(this.redirect);
        this.redirect = false;
    }

    render() {
        return <div id="body">
            <div style={{paddingBottom: '10px'}}>
                <div style={{padding: '10px 0 15px 10px'}}>
                    <span><b>Xin lỗi quý khách, không tìm được nội dung yêu cầu</b></span>
                </div>
            </div>
            <FooterVideoMocha/>
        </div>;
    }
}

export default Error;
