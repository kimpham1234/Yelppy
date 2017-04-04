import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';

class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, location: String, id: String, reviews: []};
	}

	componentWillMount(){
		console.log("mounting");
		var restaurantRef = firebase.database().ref('restaurants');
		var tempId = '';
		restaurantRef.orderByChild('name').equalTo(this.props.params.name.split('_').join(' ')).on('child_added',  function(snapshot) {
			var value = snapshot.val();
			this.name = value.name;
			this.rating = value.rating;
			this.location = value.loc;
			this.id = snapshot.key;
			tempId = snapshot.key;
			console.log("temp id " + tempId);
		}.bind(this));

		console.log("the id is " + tempId);
/*

		var that = this; 

		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByChild('id').equalTo(this.id).on('child_added',  function(snapshot) {
			that.state.reviews.push(snapshot.val());
		    console.log(snapshot.val())
		    that.setState({reviews: that.state.reviews})
		}.bind(this));*/
	}
	
	getReview(){
		console.log("reviews for " + this.name);
	}

	render() {
		var show = 	<div>
						<ul>
						    <li>Name:{ this.name }</li>
						    <li>Rating:{ this.rating }/5</li>
						    <li>Address:{ this.location }</li>
						    <li>id: {this.id}</li>
				    	</ul>
				    	<button type="button"><Link to={'/reviews/new/'+this.id}>Write a review</Link></button>
					</div>;


		return (
			<div>
				<h1>Restaurant</h1>
				<Link to={'/restaurants/'+this.props.params.name}>Reload</Link><br></br>
				{show}
		    </div>
	)}

}

export default RestaurantDetail;