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
      unread : {},
      search : {}
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
          clients : message.clients.filter((user) => {
            return user.name !== this.props.user.name;
          })
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
        user : this.props.user
      }));

      this.setState({
        connected : true
      })
    });
  }

  _notifyAvailable() {
    this.socket.send(JSON.stringify({
      type:'notify',
      stamp : (new Date()).getTime(),
      duration : 6,
      user : this.props.user,
      notify_message: this.state.notify_message
    }));
  }

  render() {
    if (!this.state.connected) {
      return (<div> Connecting... </div>);
    }

    const c = this.state.clients;

    return (
      <div className="chat">
        {this.props.user.premium ? <div className='notify'>
          <input
            type="text"
            placeholder='[notify-message]'
            onKeyUp={(e) => {this.setState({notify_message:e.target.value})}}
          />
          <input
            type="button"
            value="notify message"
            onClick={(e) => {this._notifyAvailable()}}/>
        </div> : null}
        <div className="filters">
          <input
            type="text"
            placeholder='[city-search]'
            onKeyUp={(e) => {this.setState({search:{'city' : e.target.value}})}}
          />
          <br/>
          <input
            type="text"
            placeholder='[freetext-search]'
            onKeyUp={(e) => {this.setState({search:{'freetext' : e.target.value}})}}
          />
          <br/>
          <div className='chat-header'> {
            !c.length ?
              'only you online' :
              this.state.active ?
                'chatting with ' + this.state.active :
                c.length + ' online!'}
          </div>
        </div>
        <br/>
        <div className='chat-clients'>
          {c.filter((user) => {
            return this.state.search.freetext ?
              JSON.stringify(user).toLowerCase().indexOf(this.state.search.freetext) > -1 :
              this.state.search.city ? this.state.search.city === user.city : true;
          }).map((user) => {
            return (<div
              key={'list-' + user.name}
              onClick={this.clientClick.bind(this, user.name)}
              className={this.state.active === user.name ? 'list-client active' : 'list-client'}>
                {user.notify && this.props.user.premium ? user.name + ' : ' + user.notify_message : user.name}
                {this.state.unread[user.name] ? <span> {this.state.unread[user.name]} </span> : null}
            </div>);
          })}
        </div>
        {this.state.active ?
          <ChatWindow
            key={this.props.name}
            user={this.props.user}
            send={(data)=>{this.socket.send(data)}}
            active={this.state.active}
            messages={this.state.messages[this.state.active] || []}
          /> : null}
      </div>
    );
  }

  _generateDummy = () => {
    const dummy = [{
      "name" : "jenna",
      "gender" : "female",
      "city"  : "berlin",
      "age" : 234,
      "single" : false
    },{
      "name" : "steve",
      "gender" : "female",
      "city"  : "hamburg",
      "age" : 34,
      "single" : true
    },{
      "name" : "bert",
      "gender" : "male",
      "city"  : "berlin",
      "age" : 24,
      "single" : false
    }];

    return [...dummy, ...this.state.clients];
  }
}

export default Chat;
