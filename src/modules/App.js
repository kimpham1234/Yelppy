import React, { Component } from 'react';
import { Link } from 'react-router'
import logo from '../logo.svg';
import '../App.css';
import * as firebase from 'firebase';

class App extends Component {

  //create the component
  constructor(){
    super();

    this.state = {restaurants:[]}

  }

  //make changes to component
  componentWillMount(){
    const that = this;
    console.log("mounting");
    firebase.database().ref("restaurants").on("child_added", function(snap){
      console.log(snap.ref.key);
      that.setState({restaurants: that.state.restaurants.concat(snap.val())});
    });
  }

  submit(e){
    e.preventDefault();
    var restaurantListRef = firebase.database().ref('restaurants');
    var newRestaurant = restaurantListRef.push();
    newRestaurant.set({
      name: this.refs.name.value,
      rating: this.refs.rating.value,
      loc: this.refs.loc.value
    });
  }

  componentWillUnmount(){
    firebase.database().ref("restaurant").off();
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Yelppy</h2>
        </div>
        <p className="App-intro">
          Come here to find and review yummy places!
           <Link to='/newUser'>New User</Link>
        </p>

        <div>
          {this.state.restaurants.map((restaurant, index) =>(
            <ul key={index}>
              <li>Name:{ restaurant.name }</li>
              <li>Rating:{ restaurant.rating }/5</li>
              <li>Address:{ restaurant.loc }</li>
            </ul>
            ))}
        </div>
        
        <div>
          <h4>Add more restaurant</h4>
          <form onSubmit={this.submit.bind(this)}>
            <input type="text" ref="name" placeholder="Restaurant's className"/>
            <input type="number" ref="rating" placeholder="Rating"/>
            <input type="text" ref="loc" placeholder="Location"/>
            <button type="submit">Submit</button>
          </form> 
        </div>
      </div>
    );
  }
}

export default App;
