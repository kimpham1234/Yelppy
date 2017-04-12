import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import { Table, buttonsInstance } from 'react-bootstrap';

class Restaurants extends Component{

	constructor(){
		super();
		this.state = {restaurants:[]};
		
	}

	componentWillMount(){
		console.log("mounting");
		this.restaurantListRef = firebase.database().ref('restaurants');
		var that = this;

		this.restaurantListRef.on('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		    that.state.restaurants.push(childSnapshot.val());
		    console.log(childSnapshot.val())
		    that.setState({restaurants: that.state.restaurants})
		  });
		});
	}


	render(){
		var counter = 1;
		return(

			<div>
				<h1>List of restaurant</h1>
				<Link to='restaurants/new'>New</Link>
				
				<Table striped condensed hover responsive>
					<thead>
				      <tr>
				        <th>#</th>
				        <th>Name</th>
				        <th>Rating</th>
				        <th>Address</th>
				      </tr>
				    </thead>
				    <tbody>
				    	{this.state.restaurants.map((restaurant, index) => (
				    		<tr key={index}>
				    			<td>
				    				{counter++}
				    			</td>
				    			<td>
				    				<Link to={'/restaurants/'+restaurant.name.split(' ').join('_')}>{restaurant.name}</Link>
				    			</td>
				    			<td>
				    				{ restaurant.rating }/5
				    			</td>
				    			<td>
				    				{ restaurant.loc }
				    			</td>
				    		</tr>

				    	))}
				    </tbody>
				</Table>
		    </div>
	)}

}

export default Restaurants;
