import React from 'react';
import Navbar from '../../Global/Navbar/Navbar';
import './conversation.scss';
import DetailConversation from './DetailConversation/DetailConversation';
import ListConversation from './ListConversation/ListConversation';

function Conversation(props) {
	return (
		<div className='conversation'>
			<Navbar />
			<ListConversation />
			<DetailConversation />
		</div>
	);
}

export default Conversation;
