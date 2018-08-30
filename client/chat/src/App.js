import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {connectWs, addWsListener, removeWsListener} from "./utils/ws";

const { emit, connectionOpened } = connectWs('ws://192.168.110.49:3000');
let isConnectionOpened = false;

connectionOpened.then(() => {
    isConnectionOpened = true;
})

class App extends Component {
    state = {
        messageLabel: 'Connecting...',
        message: '',
        messages: []
    }

    componentDidMount() {
        if (isConnectionOpened) {
            this.changeMessageLabel('Enter name: ');
        } else {
            connectionOpened.then(() => {
                this.changeMessageLabel('Enter name: ');
            });
        }

        addWsListener("connected_new_user", () => {
            this.changeMessageLabel('Enter message: ');
            this.changeMessage('');
        });

        addWsListener("message", (data) => {
            this.changeMessage('');
            this.changeMessages(data);
        });
    }

    changeMessageLabel(messageLabel) {
        this.setState({ messageLabel })
    }

    changeMessages(message) {
        this.setState(({ messages }) => ({ messages: [...messages, message] }))
    }

    changeMessage(message) {
        this.setState({ message })
    }

    onSubmit(event) {
        event.preventDefault();
        emit(this.state.message);
    }

    onMessageChange({ target: { value: message } }) {
        this.setState({ message })
    }

    render() {
        const setAuthorColor = (color) => ({color})

        return (
            <div className="chat container">
                <div className="messages">
                    {this.state.messages.map(messageObj => {
                        const dt = new Date(messageObj.time)

                        return (
                            <div className="message row">
                                <span style={setAuthorColor(messageObj.color)}>
                                    {messageObj.author}
                                </span>
                                @ {dt.getHours()} : {dt.getMinutes() < 10 ? ('0' + dt.getMinutes()) : dt.getMinutes()} ---- {messageObj.text}
                    </div>
                    )
                    })}
                </div>
                <form onSubmit={event => this.onSubmit(event)}>
                    <div className="row justify-content-sm-center align-items-center form-group">
                        <label htmlFor="message">{this.state.messageLabel}</label>
                        <div className="col-sm-4">
                            <input
                                autoComplete="off"
                                id="message"
                                className="form-control"
                                type="text"
                                value={this.state.message}
                                onChange={event => this.onMessageChange(event)}/>
                        </div>
                        <input
                            className="btn btn-primary"
                            type="submit"
                            disabled={!isConnectionOpened}/>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
