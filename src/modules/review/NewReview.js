import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
class NewReview extends Component{

	constructor(){
		super();
		this.state = {restaurant: String};
	}

	componentWillMount(){
		console.log("mounting");
		this.restaurantRef = firebase.database().ref('restaurants');
		var that = this;
		this.restaurantRef.orderByKey().equalTo(this.props.params.id).on('child_added',  function(snapshot) {
			var res = snapshot.val();
			var name = res.name;
			that.setState({restaurant: name});
		}.bind(this));
	}

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
			  id: this.refs.id.value
			});

			var path = '/restaurants/'+this.state.restaurant;

			hashHistory.push(path);
		}
	}

	render(){
		return(
			<div>
				<div>
			      <form className="col-md-2" onSubmit={this.submit.bind(this) }>
			      <h4> Write a review for {this.state.restaurant} </h4>
			      <table>
			      	<tr>
			      		<td> Rating </td>
			      		<td>  <input type="text" ref="rating" placeholder="Rating on scale of 5"/> </td>
			      	</tr>

			      	<tr>
			      		<td> Review </td>
			      		<td>  <textArea cols="50" type="text" ref="review" placeholder="Share your thoughts..."/></td>
			      	</tr>
			      	
			      	<input type="hidden" ref="id" value={this.props.params.id}/>
			  
			      	<button type="submit">Submit</button>
			      </table>
				</form>
			    </div>
			</div>
		)
	}
}

export default NewReview;