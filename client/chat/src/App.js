import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {connectWs, addWsListener, removeWsListener} from "./utils/ws";

const {emit} = connectWs('ws://192.168.110.49:3000');

addWsListener("connected_new_user", (data) => {
  console.log(data);
})

addWsListener("disconnected_user", (data) => {
  console.log(data);
})

addWsListener("message", (data) => {
  console.log(data);
});

setTimeout(() => {
  emit(`User: ${+new Date}`)
}, 1000)

setTimeout(() => {
  emit(`Message: ${+new Date}`)
}, 3000)


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
