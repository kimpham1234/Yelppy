import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';
import { Navbar, Nav, NavItem, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, location: String, id: String, reviews: [], keys: []};
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


		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByChild('id').equalTo(this.id).on('child_added',function(snapshot) {
			this.state.reviews.push(snapshot.val());
		    this.state.keys.push(snapshot.key);
		    this.setState({reviews: this.state.reviews})
		    this.setState({keys: this.state.keys})
		}.bind(this));
	}

	render() {
		var showDetail = 	<div>
						<ul>
						    <li>Name:{ this.name }</li>
						    <li>Rating:{ this.rating }/5</li>
						    <li>Address:{ this.location }</li>
						    <li>id: {this.id}</li>
				    	</ul>
				    	<button type="button"><Link to={'/reviews/new/'+this.id}>Write a review</Link></button>
					</div>;

		var showReview =(
				<div>
			      {this.state.reviews.map((review, index) =>(
				    <ul key={index}>
				    	<li>Author: {review.author} </li>
					    <li>Rating: {review.rating }/5</li>
					    <li>Review:{review.text }</li>
					    <li><button type="button"><Link to={'/reviews/edit/'+this.state.keys[index]}>Edit</Link></button></li>
				    </ul>))}
			    </div>
			)

		return (
			<div>
				<h1>Restaurant</h1>
				<Link to={'/restaurants/'+this.props.params.name}>Reload</Link><br></br>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}

				
		    </div>
	)}
}
export default RestaurantDetail;