import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
class ReviewFlag extends Component{

	constructor(props){
		super(props);
		this.state = {};
		// console.log('this.props.params', this.props.params);
		console.log(new Date());
	}


	submit(e){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null){
			e.preventDefault();
			var reviewFlagListRef = firebase.database().ref('review_flag');
			var newReviewFlagRef = reviewFlagListRef.push();

			var time = Date();
			newReviewFlagRef.set({
				timestamp: time,
				author: currentUser.email,
				restaurant_id: this.props.params.type,
				review_id: this.props.params.id,
				flag_content: this.refs.reviewFlag.value
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
