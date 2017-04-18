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
		console.log("Edit will mount");
		var that = this;
		this.reviewListRef = firebase.database();
		this.reviewListRef.ref('reviews/'+this.props.params.id).once('value',function(snapshot) {
			var value = snapshot.val();
			console.log("snapshot" + snapshot.val().text);
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
			console.log('in submit');
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.update({
				rating: this.refs.rating.value,
				text: this.refs.review.value
			});
			hashHistory.push('/restaurants/'+this.state.resPathId);
		}
		
	}

	delete(){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email===this.state.author){
			console.log('in submit');
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.remove();
			hashHistory.push('/restaurants/'+this.state.resPathId);
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
			      		<td>  <input type="text" ref="rating" defaultValue={this.state.rating}/> </td>
			      	</tr>

			      	<tr>
			      		<td> Review </td>
			      		<td>  <textArea cols="50" type="text" ref="review" defaultValue={this.state.review} /></td>
			      	</tr>
			      	
			      	<button id="submit" type="submit">Submit</button>
			      </table>
				</form>

			    <div>
			   		 <button type="delete" onClick={this.delete.bind(this)}>Delete this review</button>
			    </div>
			    </div>


			</div>
		)
	}
}

export default Edit;