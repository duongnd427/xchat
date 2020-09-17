import React, {Component} from 'react';
import Link from "next/link";
import Helper from "../../utils/helpers/Helper";
import ModalSubcribe from "../Modal/ModalSubcribe";
import AuthService from "../../services/auth/AuthService";
import {DEFAULT_AVATAR, DEFAULT_IMG} from "../../config/Config";
import ModalLogin from "../Modal/ModalLogin";

class ChannelReleted extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            id: '',
            isFollow: 0,
            modalLogin: false
        };
        this.toggle = this.toggle.bind(this);
        this.unFollow = this.unFollow.bind(this);
        this.callBack = this.callBack.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
    }
    toggleLogin(){
        this.setState({
            modalLogin: false
        });
    }
    toggle(id) {
        if (Helper.checkUserLoggedIn()){
            AuthService.follow(this.state.id, 1).then(
                data => {
                    Helper.renewToken(data);

                    this.setState({
                        isFollow: 1
                    });
                },
                error => {
                    this.setState({
                        error: error
                    });
                }
            );
        }else {
            this.setState({
                modalLogin: true
            });
        }
    }

    unFollow(id) {
        this.setState({
            isShow: !this.state.isShow,
            id: id,
        });
    }

    callBack() {
        this.setState({
            isShow: !this.state.isShow,
        });
        AuthService.follow(this.state.id, 0).then(
            data => {
                Helper.renewToken(data);

                this.setState({
                    isFollow: 0
                });
            },
            error => {
                this.setState({
                    error: error
                });
            }
        );
    }

    render() {
        const {slide} = this.props;
        const {isFollow} = this.state;
        var channel = this.props.channel;
        return (
            <div>
                <a href={Helper.replaceUrl(channel.link) + '.html'}>
                    <img src={channel.url_avatar} width="100%" style={{borderRadius: '70px'}}/>
                </a>

                <div className="play-chanel-info-2">
                    <h3 className="play-channel-h3-2">
                        <Link href="/channeldetail" as={Helper.replaceUrl(channel.link) + '.html'} style={{whiteSpace: 'nowrap'}}>{channel.name}</Link>
                    </h3>
                    <p className="play-chanel-view-2">{Helper.formatNumber(channel.numfollow)} followers</p>

                    {isFollow ?
                        <p style={{display: 'block'}}
                           onClick={() => this.unFollow(channel.id)}
                           className="chanel-btn-dk-more-2 follow1"><a>Đã theo dõi </a></p>
                        :
                        <p onClick={() => this.toggle(channel.id)} className="chanel-btn-dk-more-2"><a style={{color: '#5e48ce'}}>Theo dõi</a></p>
                    }
                </div>

                <ModalSubcribe modal={this.state.isShow}
                               type={'unfollow'}
                               callBack={this.callBack}
                               body={'Xác nhận bỏ theo dõi kênh?'}
                               toggle={this.unFollow}/>
                <ModalLogin isOpen={this.state.modalLogin}
                            body={'Quý khách chưa đăng nhập! Để hoàn thành thao tác, mời quý khách bấm OK để đăng nhập.'}
                            toggle={this.toggleLogin}/>
            </div>
        );
    }
}

export default ChannelReleted;
