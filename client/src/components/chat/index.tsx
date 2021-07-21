import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io, { Socket } from "socket.io-client";
import { RouteComponentProps } from "react-router-dom";

import Info from '../info/index';
import Messages from '../messages/index';
import Input from '../input/index';
import UsersConnected from '../usersConnected/index';

import './styles.css';

let socket: Socket;

const Chat = ({ location }: RouteComponentProps) => {
    const [name, setName] = useState<string | string[] |null>('');
    const [room, setRoom] = useState<string |string[] | null>('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    
    const API = 'localhost:5000';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
    
        socket = io(API);
    
        setRoom(room);
        setName(name)
    
        socket.emit('join', { name, room }, (error: any) => {
          if(error) {
            alert(error);
          }
        });
      }, [API, location.search]);
      
    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
    }, []);
    
    const sendMessage = (event: any) => {
      event.preventDefault();
  
      if(message) {
        socket.emit('sendMessage', message, () => setMessage(''));
      }
    }

    return (
      <div className="outerContainer">
          <div className="container">
              <Info room={room} />
              <Messages messages={messages} name={name} />
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
          <UsersConnected users={users}/>
      </div>
  )
}

export default Chat;