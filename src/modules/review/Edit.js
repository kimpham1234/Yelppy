import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router';
import { Link } from 'react-router';


import "../../App.css";
class Edit extends Component{

	constructor(){
		super();
		this.state = {review: String, rating: String, review_id: String, author: String, resId: String};
		

	}

	componentWillMount(){
		console.log("in edit");
		console.log(this.props.params.id);
		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByKey().equalTo(this.props.params.id).on('child_added',function(snapshot) {
			var value = snapshot.val();
			console.log("snapshot" + snapshot.val().text);
		//	setState({this.state.review: value.text})


			this.review = value.text;
			this.rating = value.rating;
			this.author = value.author;
			this.resId = value.id;
			this.review_id = this.props.params.id;
		}.bind(this));
	}

	

	submit(e){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email == this.author){
			e.preventDefault();
			
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			console.log("the ref is " +reviewRef);
			reviewRef.set({
				author: this.author,
				rating: this.refs.rating.value,
				text: this.refs.review.value,
				id: this.resId,
			});
			var path = '/restaurants';
			hashHistory.push(path);
		}
	}

	
	render(){
		return(
			<div>
				<div>
			      <form className="col-md-2" onSubmit={this.submit.bind(this) }>
			      <h4> Edit your review </h4>
			      <table>
			      	<tr>
			      		<td> Rating </td>
			      		<td>  <input type="text" ref="rating" placeholder={this.rating}/> </td>
			      	</tr>

			      	<tr>
			      		<td> Review </td>
			      		<td>  <textArea cols="50" type="text" ref="review" placeholder={this.review} /></td>
			      	</tr>
			      	
			      	<button type="submit">Submit</button>
			      </table>
				</form>
			    </div>
			</div>
		)
	}
}

export default Edit;