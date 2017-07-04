import React, { Component } from 'react';
import ChatWindow from './ChatWindow';
import '../index.css';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected : false,
      clients : [],
      messages : {},
      active : null,
      unread : {}
    };
  }

  clientClick = (active) => {
    let newUnread = this.state.unread;
    newUnread[active] = 0;
    this.setState({
      active,
      newUnread
    })
  }

  gotMessage = (message) => {
    switch (message.type) {
      case "broadcast" :
        this.setState({
          clients : message.clients.filter((n) => n !== this.props.name)
        });
        break;

      case "private-message" :
        this.handlePrivateMessage(message);
        break;

      default :
        alert('chaos :S');
    }
  }

  handlePrivateMessage(message) {
    //add unread
    if (message.from !== this.state.active) {
      let newCount = {};
      newCount[message.from] = this.state.unread[message.from] ? this.state.unread[message.from] : 0;
      newCount[message.from]++;
      this.setState({
        unread : Object.assign({}, this.state.unread, newCount)
      })
    }

    //merge targeted client messages
    const current = this.state.messages[message.from] || [];
    let newMessages = {};
    newMessages[message.from] = [...current, message];
    this.setState({
      messages : Object.assign({}, this.state.messages, newMessages)
    });
  }

  /**
   *  Set up the socket when the component mounts
   */
  componentWillMount() {
    console.log(process.env);
    this.socket = new WebSocket(process.env.REACT_APP_WS_ADDRESS || 'ws://localhost:1337/');

    this.socket.addEventListener('message', (event) => {
      let parsed = {};

      try {
        parsed = JSON.parse(event.data);
      } catch (err) {
        return console.error(err);
      }

      this.gotMessage(parsed);
    });

    //when the socket is open, emit an event
    this.socket.addEventListener('open', () => {

      //greet the backend with a hearty hello
      this.socket.send(JSON.stringify({
        type : 'connect',
        name : this.props.name
      }));

      this.setState({
        connected : true
      })
    });
  }

  render() {
    if (!this.state.connected) {
      return (<div> Connecting... </div>);
    }

    const c = this.state.clients;

    return (
      <div className="chat">
        <div className='chat-header'> {
          !c.length ?
            'only you online' :
            this.state.active ?
              'chatting with ' + this.state.active :
              c.length + ' online!'}
        </div>
        <div className='chat-clients'>
          {c.map((name) => {
            return (<div
              key={'list-' + name}
              onClick={this.clientClick.bind(this, name)}
              className={this.state.active === name ? 'list-client active' : 'list-client'}>
                {name}
                {this.state.unread[name] ? <span> {this.state.unread[name]} </span> : null}
            </div>);
          })}
        </div>
        {this.state.active ?
          <ChatWindow
            key={this.props.name}
            name={this.props.name}
            send={(data)=>{console.log('here', data); this.socket.send(data)}}
            active={this.state.active}
            messages={this.state.messages[this.state.active] || []}
          /> : null}
      </div>
    );
  }
}

export default Chat;
