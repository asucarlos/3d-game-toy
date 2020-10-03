import React, { useEffect, useState, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
const ENDPOINT = process.env.ENDPOINT || "http://localhost:8000"


function App() {
  const [message, setMessage] = useState<string>('')
  const socket = io(ENDPOINT);
  useEffect(() => {
    socket.on('FromAPI', function(msg: string){
      setMessage(msg)
  })
  }, [socket])

  function handleSubmit (e: FormEvent<HTMLInputElement>) {
    console.log(e.currentTarget)
    e.preventDefault()
    socket.emit('message', e.currentTarget)
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {message}
        <input type="text" onChange={e => console.log(e.target.value)} onSubmit={e => handleSubmit(e)} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
