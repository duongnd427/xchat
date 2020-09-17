import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import { DOMAIN_SOCKET } from '../../config/Config';

const Endpoint = '/chatWS';
// const topicChannel = '/topic/messages/';
const topicChannel = '/user/chatlive/';

class Socket extends Component {
	constructor(props) {
		super(props);
	}

	sendMessage = (msg) => {
		this.clientRef.sendMessage('/app/chatlive/postmessageWap', msg);
	};

	render() {
		return (
			<div>
				<SockJsClient
					headers={this.props.info}
					url={DOMAIN_SOCKET + Endpoint}
					topics={[topicChannel + this.props.idVideo]}
					onMessage={(msg) => {
						console.log(msg);
						switch (msg.type) {
							case '0':
								this.props.setComment(
									this.props.comment.concat(msg.chatMessage),
								);
								break;
							case '1':
								this.props.setComment(
									this.props.comment.concat(msg.messageList),
								);
								break;
							case '4':
								msg.chatMessage.message = 'Đã thả tim ';
								this.props.setComment(
									this.props.comment.concat(msg.chatMessage),
								);
								break;
							case '3':
								this.props.setCcu(msg.numberLive);
								break;
						}
					}}
					ref={(client) => {
						this.clientRef = client;
					}}
				/>

				<button onClick={this.sendMessage}>click</button>
			</div>
		);
	}
}

export default Socket;
