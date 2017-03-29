import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';

class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, location: String};
	}

	componentWillMount(){
		console.log("mounting");
		var restaurantRef = firebase.database().ref('restaurants');
		restaurantRef.orderByChild('name').equalTo(this.props.params.name).on('child_added',  function(snapshot) {
			var value = snapshot.val();
			this.name = value.name;
			this.rating = value.rating;
			this.location = value.loc;
		}.bind(this));

}
	

	render() {
		var show = 	<div>
						<ul>
						    <li>Name:{ this.name }</li>
						    <li>Rating:{ this.rating }/5</li>
						    <li>Address:{ this.location }</li>
				    	</ul>
					</div>;
		return (
			<div>
				<h1>Restaurant</h1>
				{show}
		    </div>
	)}

}

export default RestaurantDetail;