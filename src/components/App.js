import React, { Component } from 'react';
import '../index.css';
import Chat from './Chat';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name : null,
      premium: false,
      gender: null,
      age: null,
      city: null,
      single: false
    };
  }

  _keyDown = (e) => {
    if (e.which === 13) {
      if (!e.target.value.length) {
        return alert('Thats not a name');
      }

      if (!this.state.gender || !this.state.age || !this.state.city) {
        return alert("Need more data");
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
          <Chat user={this.state} /> :
          <div className='name-form'>
            <span> Please fill in your details and press enter </span>
            <br/>
            <input
              onKeyDown={(e) => {this.setState({age: e.target.value})}}
              type='number'
              placeholder='[age]'
            />
            <br/>
            <label>
              <input
                type="radio"
                value="option1"
                name="isPremium"
                onClick={() => {this.setState({premium:false})}}
                checked={!this.state.premium}/>
              normal
            </label>
            <label>
              <input
                type="radio"
                value="option2"
                name="isPremium"
                onClick={() => {this.setState({premium:true})}}
                checked={this.state.premium}/>
              premium
            </label>
            <br/>
            <label>
              <input
                type="radio"
                value="option1"
                name="gender"
                onClick={() => {this.setState({gender:"female"})}}
                checked={this.state.gender === "female"}/>
              female
            </label>
            <br/>
            <label>
              <input
                type="radio"
                value="option2"
                name="gender"
                onClick={() => {this.setState({gender:"male"})}}
                checked={this.state.gender === "male"}/>
              male
            </label>
            <br/>
            <input
              onKeyUp={(e) => {this.setState({city: e.target.value.toLowerCase()})}}
              type='text'
              placeholder='[city]'
            />
            <br/>
            <input
              onKeyUp={this._keyDown.bind(this)}
              type='text'
              placeholder='[name and enter]'
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
