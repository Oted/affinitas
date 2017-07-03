import React, { Component } from 'react';
import '../index.css';
import Chat from './Chat';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name : null
    };
  }

  _keyDown = (e) => {
    if (e.which === 13) {
      if (!e.target.value.length) {
        return alert('Thats not a name');
      }

      this.setState({
        name : e.target.value.toLowerCase()
      });
    }
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2> {this.state.name ? 'Hello ' + this.state.name + '!' : 'Welcome to the Chat!'} </h2>
        </div>
        {this.state.name ?
          <Chat name={this.state.name}/> :
          <div className='name-form'>
            <span> Please fill in your name and press enter </span>
            <input
              onKeyDown={this._keyDown.bind(this)}
              type='text'
              placeholder='[name]'
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
