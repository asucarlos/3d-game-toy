import React, { useEffect, useState, FormEvent } from "react";
import "./App.css";
import io from "socket.io-client";
import * as THREE from 'three'
const ENDPOINT = process.env.ENDPOINT || "http://localhost:8000";

function App() {
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  const socket = io(ENDPOINT);
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };
    animate();
  }, [])
  
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
