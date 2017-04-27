import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router';
import { Link } from 'react-router';


import "../../App.css";
class Edit extends Component{

	constructor(){
		super();
		this.state = {resPathId: String, review: String, rating: String, review_id: String, author: String, resId: String};


	}

	componentWillMount(){
		var that = this;
		this.reviewListRef = firebase.database();
		this.reviewListRef.ref('reviews/'+this.props.params.id).once('value',function(snapshot) {
			var value = snapshot.val();
			that.setState({review: value.text});
			that.setState({rating: value.rating});
			that.setState({author: value.author});
			that.setState({resId: value.id}, ()=>{
				var resRef = firebase.database().ref('business/'+value.id+'/id').once('value',function(snapshot){
					that.setState({resPathId: snapshot.val()});
				}.bind(this));
			});
			that.setState({review_id: this.props.params.id});
		}.bind(this));
		
	}

	submit(e){
		e.preventDefault();
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email===this.state.author){
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.update({
				rating: this.refs.rating.value,
				text: this.refs.review.value
			});
			hashHistory.push('/restaurants/'+this.state.resPathId);
			this.updateReview(this.state.resId);
		}
		else
		{
			alert('Sorry. You cannot edit this review.' 
				+' Only its own user can edit this review');
			hashHistory.push('/restaurants/'+this.state.resPathId);
		}
	}

	delete(){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email===this.state.author){
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.remove();
			hashHistory.push('/restaurants/'+this.state.resPathId);
		}
		else
		{
			alert('Sorry. You cannot delete this review.' 
				+' Only its own user can delete this review');
			hashHistory.push('/restaurants/'+this.state.resPathId);
		}
	}

	updateReview(e){
		var reviewListRef = firebase.database().ref('reviews');
		var total = 0;
		var numberOfReviews = 0;

		reviewListRef.orderByChild('id').equalTo(e).on('child_added',function(snapshot) {
			total+=Number(snapshot.val().rating);
			numberOfReviews ++;
		}.bind(this));

		var resRef = firebase.database().ref('business/'+e).update({
				rating: this.round(Number(total / numberOfReviews)),
				numReview: numberOfReviews
			});

	}
	round(number) {
    var value = (number * 2).toFixed() / 2;
    return value;
}

	render(){
		return(
			<div>
				<div>
			      <form onSubmit={this.submit.bind(this) }>
			      <h4> Edit your review </h4>
			      <table><tbody>
			      	<tr>
			      		<td> Rating </td>
			      		<td>  <input type="text" ref="rating" defaultValue={this.state.rating}/> </td>
			      	</tr>

			      	<tr>
			      		<td> Review </td>
			      		<td>  <textArea cols="50" type="text" ref="review" defaultValue={this.state.review} /></td>
			      	</tr>
			      </tbody></table>
			      <button id="submit" type="submit">Submit</button><br></br>
				</form>
				<button type="delete" onClick={this.delete.bind(this)}>Delete</button>
			    </div>


			</div>
		)
	}
}

export default Edit;
