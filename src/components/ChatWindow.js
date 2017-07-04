import React, { Component } from 'react';
import '../index.css';

class ChatWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sent : {}
    };
  }

  _keyDown = (e) => {
    if (e.which === 13) {
      if (!e.target.value.length) {
        return alert('Thats not a message');
      }

      const stamp = (new Date()).getTime();
      const current = this.state.sent[this.props.active] || [];
      let newSent = {};
      newSent[this.props.active] = [...current, {message : e.target.value, stamp, sent : true}];

      //update sent state
      this.setState({
        sent : Object.assign({}, this.state.sent, newSent)
      });

      //send the message
      this.props.send(JSON.stringify({
        type : 'private-message',
        to : this.props.active,
        from : this.props.name,
        message: e.target.value,
        stamp
      }));

      e.target.value = '';
    }
  }

  render() {
    const s = this.state.sent[this.props.active] || [];
    const r = this.props.messages;
    const merged = [...s,...r].sort((a,b) => a.stamp - b.stamp);

    return (
      <div className='chat-window'>
        <div className='messages'>
          {merged.map((m) => {
            return <span key={m.stamp} className={m.sent ? 'message-sent' : 'message-recieved'}> {m.message} </span>
          })}
        </div>
        <input
          className='chat-input'
          onKeyDown={this._keyDown.bind(this)}
          type='text'
          placeholder='[message]'
        />
      </div>
    )
  }
}

export default ChatWindow;
