import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connectWs, addWsListener, removeWsListener } from './utils/ws';
import { formatDate, setElementColor } from './utils/utils';

const { emit, connectionOpened } = connectWs('ws://192.168.110.49:3000');

class App extends Component {
    state = {
        messageLabel: 'Connecting...',
        message: '',
        messages: [],
        isConnectionOpened: false
    };

    onSubmit = event => {
        event.preventDefault();
        emit(this.state.message);
    };

    onMessageChange = ({ target: { value: message } }) => {
        this.setState({ message });
    };

    componentDidMount() {
        connectionOpened.then(() => {
            this.isConnectionOpened = true;
        });

        this.changeMessageLabelOnConnection();
        this.connectWsListeners();
    }

    changeMessageLabelOnConnection() {
        if (this.isConnectionOpened) {
            this.changeMessageLabel('Enter name: ');
        } else {
            connectionOpened.then(() => {
                this.changeMessageLabel('Enter name: ');
            });
        }
    }

    connectWsListeners() {
        addWsListener('connected_new_user', () => {
            this.handleMessagesAndLabel('Enter message: ', '');
        });

        addWsListener('message', (message) => {
            this.handleMessages(message);
        });
    }

    handleMessages(message) {
        this.setState(({ messages }) => ({
            messages: [...messages, message],
            message: ''
        }));
    }

    handleMessagesAndLabel(messageLabel, message) {
        this.setState({ messageLabel, message });
    }

    changeMessageLabel(messageLabel) {
        this.setState({ messageLabel });
    }

    render() {
        const { message, messageLabel, messages } = this.state;

        return (
            <div className="chat container">
                <div className="messages">
                    {messages.map(messageObj => {
                        const dt = new Date(messageObj.time)

                        return (
                            <div className="message row">
                                <span style={setElementColor(messageObj.color)}>
                                    {messageObj.author}
                                </span>
                                {formatDate(dt)} ---- {messageObj.text}
                    </div>
                    )
                    })}
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="row justify-content-sm-center align-items-center form-group">
                        <label htmlFor="message">{messageLabel}</label>
                        <div className="col-sm-4">
                            <input
                                autoComplete="off"
                                id="message"
                                className="form-control"
                                type="text"
                                value={message}
                                onChange={this.onMessageChange}/>
                        </div>
                        <input
                            className="btn btn-primary"
                            type="submit"
                            disabled={!this.isConnectionOpened}/>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
