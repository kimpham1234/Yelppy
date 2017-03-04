import React, { Component } from 'react';
import { Link } from 'react-router'
import logo from '../logo.svg';
import '../App.css';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Yelppy</h2>
        </div>
        <p className="App-intro">
          Come here to find and review yummy places!
          <Link to='/restaurants'>View Restaurants</Link>
          <Link to='/newUser'>New User</Link>
        </p>
        { this.props.children }
      </div>
    );
  }
}

export default App;
