import React, { Component } from 'react';
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
//import logo from '../logo.svg';
import '../App.css';
import '../bootstrap/css/bootstrap.css';

class App extends Component {


  render() {

      console.log(this.props);
      return (
          <div className="App">
              <div className="App-header">
                  <h2>Welcome to Yelppy</h2>
              </div>
              <div>
                  <p className="App-intro">
                      Come here to find and review yummy places!
                      <Link to='/restaurants'>View Restaurants</Link>
                  </p>
              </div>
              { this.props.children }
          </div>
    );
  }




}

export default App;
