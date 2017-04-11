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
		this.reviewListRef = firebase.database().ref('reviews');
		var that = this;

		this.reviewListRef.once('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		  	console.log(childSnapshot.val());
		    that.state.reviews.push(childSnapshot.val());
		    console.log(childSnapshot.val());
		    that.setState({reviews: that.state.reviews});
		  });
		});
	}

	render(){
		return(
			<div>
				<h1>Reviews</h1>
				<div>
			      {this.state.reviews.map((review, index) =>(
				    <ul key={index}>
					    <li>Author:{ review.author }</li>
					    <li>Rating:{ review.rating }/5</li>
					    <li>Review:{ review.text }</li>
				    </ul>))}
			    </div>
		    </div>
		    );
	}
}

export default Review;