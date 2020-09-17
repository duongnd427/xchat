import React from 'react';
import './conversation.scss';
import DetailConversation from './DetailConversation/DetailConversation';
import ListConversation from './ListConversation/ListConversation';

function Conversation(props) {
	return (
		<div className='conversation'>
			<ListConversation />
			<DetailConversation />
		</div>
	);
}

export default Conversation;
