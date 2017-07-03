import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { expect } from 'chai';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders the header', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.querySelector('.app')).to.not.equal(null);
});

it('does not render chat without name', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.querySelector('.chat')).to.equal(null);
});
