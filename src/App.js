import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NumberConverter from './components/NumberConverter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <NumberConverter
            title="Number Converter"/>
        </header>
      </div>
    );
  }
}

export default App;
