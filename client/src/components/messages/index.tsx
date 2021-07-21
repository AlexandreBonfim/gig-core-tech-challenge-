import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './message/index'; 

import './styles.css';

const Messages = ({ messages, name } : any) => (
  <ScrollToBottom className="messages">
    {messages.map((message: any, index: number) => <div key={index}><Message message={message} name={name}/></div>)}
  </ScrollToBottom>
);

export default Messages;