import React, { Component } from 'react';
import '../index.css';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected : false
    };
  }

  componentWillMount() {
    this.socket = new WebSocket('ws://localhost:1337/');

    this.socket.addEventListener('open', (event) => {
      this.socket.send('Hello Server!');
    });

    this.socket.addEventListener('message', (event) => {
      console.log('Message from server', event.data);
    });

    this.socket.addEventListener('onopen', () => {
      this.setState({
        connected : true
      })
    });
  }

  render() {
    if (!this.state.connected) {
      return (<div> Connecting... </div>);
    }

    return (
      <div className="chat">
      </div>
    );
  }
}

export default Chat;
