import React, { useEffect, useState, FormEvent } from "react";
import "./App.css";
import io from "socket.io-client";
const ENDPOINT = process.env.ENDPOINT || "http://localhost:8000";

function App() {
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  const socket = io(ENDPOINT);
  useEffect(() => {
    socket.on("FromAPI", function (msg: string) {
      setReceivedMessage(msg);
    });
  }, [socket]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit("message", typedMessage);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Room</h1>
      </header>
      <body>{receivedMessage}</body>
      <footer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Chat</label>
          <input type="text" onChange={(e) => setTypedMessage(e.target.value)} />
          <input type="submit" value="Send" />
        </form>
      </footer>
    </div>
  );
}

export default App;
