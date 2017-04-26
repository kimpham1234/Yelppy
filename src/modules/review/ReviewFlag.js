import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
class ReviewFlag extends Component{

	constructor(){
		super();
		this.state = {};
	}


	submit(e){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null){
			e.preventDefault();
			var reviewFlagListRef = firebase.database().ref('review_flag');
			var newReviewFlagRef = reviewFlagListRef.push();
			newReviewFlagRef.set({
				author: currentUser.email,
				restaurant_id: "testing",
				review_id: "testing",
				flag_content: "testing"
			});
			var restaurantId = '';
			var path = '/restaurants/'+ restaurantId;
			hashHistory.push(path);
		}
	}

	render(){
		return(
			<div>
				<h1> Write a review flag for this comment </h1>
				<form onSubmit={this.submit.bind(this)}>
			    	<table>
				      	<tbody>
					      	<tr>
					      		<td> Reason for this flag</td>
					      		<td>  <input type="text" ref="reviewFlag" placeholder="Please tell us why"/> </td>
					      	</tr>
				      	</tbody>
			    	</table>
			    	<button type="submit">Submit</button>
			    </form>
			</div>
		)
	}
}

export default ReviewFlag;
