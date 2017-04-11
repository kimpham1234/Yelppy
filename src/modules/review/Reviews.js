import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';
import "../../App.css";
import { Table, buttonsInstance } from 'react-bootstrap';

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
				<h1>List of reviews</h1>
				<Table striped condensed hover responsive>
					<thead>
					    <tr>
					        <th>Author</th>
					        <th>Rating</th>
					        <th>Review</th>
					    </tr>
					</thead>
					<tbody>
						{
							this.state.reviews.map((review, index) =>(
							<tr key={index}>
								<td>
				    				{ review.author }
				    			</td>

				    			<td>
				    				{ review.rating }
				    			</td>

				    			<td>
				    				{ review.text }
				    			</td>
							</tr>
						))}
					</tbody>
				</Table>
		    </div>
		    );
	}
}

export default Review;