import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
class NewReview extends Component{

	submit(e){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null){
			e.preventDefault();
			var reviewListRef = firebase.database().ref('reviews');
			var newReviewRef = reviewListRef.push();
			newReviewRef.set({
			  author: currentUser.email,
			  rating: this.refs.rating.value,
			  text: this.refs.review.value,
			  //restaurant: need to link with current restaurant be viewed later
			});

			
			hashHistory.push('/reviews');
		}
	}

	render(){
		return(
			<div>
				<div>
			      <h4>Write a review</h4>
			      <form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="rating" placeholder="Rating on scale of 5"/>
			        <textArea rols="10" cols="10" type="text" ref="review" placeholder="Share your thoughts..."/>
			        <button type="submit">Submit</button>
			      </form> 
			    </div>
			</div>
		)
	}
}

export default NewReview;