import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">GIG Challenge</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <select 
          className="joinInput mt-20"
          defaultValue=""
          onChange={(event) => setRoom(event.target.value)}
          >
            <option value="">Choose a room</option>
            <option value="NodeJs">NodeJS</option>
            <option value="Python">Python</option>
            <option value=".Net">.Net</option>
          </select>
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Join</button>
        </Link>
      </div>
    </div>
  );
}

export default Join;