import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';
import "../../App.css";

class Review extends Component{

	constructor(){
		super();
		this.state = {reviews:[]};
		
	}

	componentWillMount(){
		console.log("mounting");
		var reviewListRef = firebase.database().ref('reviews');
		var that = this;

		this.setState({reviews: []});
		reviewListRef.once('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		  	console.log(childSnapshot.val());
		    that.state.reviews.push(childSnapshot.val());
		  });
		});
	}

	render(){
		return(
			<div>
				<h1>Reviews</h1>
				<Link to='/reviews'>Reload</Link><br></br>
				<Link to='/reviews/new'>New</Link>
				<div>
			      {this.state.reviews.map((review, index) =>(
				    <ul key={index}>
					    <li>Author:{ review.author }</li>
					    <li>Rating:{ review.rating }/5</li>
					    <li>Review:{ review.review }</li>
				    </ul>))}
			    </div>
		    </div>
		    );
	}
}

export default Review;