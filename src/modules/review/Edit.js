import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router';
import { Link } from 'react-router';
import StarRatingComponent from 'react-star-rating-component';
import "../../App.css";
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Form } from 'react-bootstrap';
class Edit extends Component{
	constructor(props){
		super(props);
		this.state = {userNumReview: String, reviewedList:[], resPathId: String, review: String, rating: String, review_id: String, author: String, resId: String};
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
		var authid = firebase.auth().currentUser.uid;
		this.userRef = firebase.database()
		this.userRef.ref('users').orderByKey().equalTo(authid).on('child_added',function(snapshot){
			that.setState({reviewedList: snapshot.val().reviewed});
			console.log('snapshot.val().reviewed', snapshot.val().reviewed);
			that.setState({userNumReview: snapshot.val().numReviews});
		}.bind(this));
	}
	submit(e){
		e.preventDefault();
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email===this.state.author){
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.update({
				rating: this.state.rating,
				text: this.input.value
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
	componentWillUnmount(){
    }
	delete(){
		console.log('testing');
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null && currentUser.email===this.state.author){
			var resPath = "";
			var reviewRef = firebase.database().ref('reviews/' + this.props.params.id);
			reviewRef.remove();
			this.state.reviewedList;
			for(var i = 0; i < this.state.reviewedList.length; i++){
				if(this.state.reviewedList[i].split("/")[1]===this.state.resPathId){
					this.state.reviewedList.splice(i, 1);
				}
			}
			if(this.state.reviewedList.length == 0){
				this.state.reviewedList.push("");
			}
			var reviewNum = Number(this.state.userNumReview) - 1;
			var userRef = firebase.database().ref('users');
			console.log(currentUser.uid);
			userRef.child(currentUser.uid).update({
				reviewed: this.state.reviewedList,
				numReviews: reviewNum
			});
			hashHistory.push('/restaurants/'+this.state.resPathId);
			this.updateReview(this.state.resId);
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
				rating: total == 0 ? 0 :this.round(Number(total / numberOfReviews)),
				numReview: numberOfReviews
		});
	}
	round(number) {
	    var value = (number * 2).toFixed() / 2;
    	return value;
	}
	onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }
	render(){
		var starRating = (
			<div>
		
        		<StarRatingComponent 
                    name="rate1" 
                    starColor="#ffb400"
					emptyStarColor="#ffb400"
                    value={parseFloat(this.state.rating)}
                    renderStarIcon={(index, value) => {
		            	return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'} />;
		            }}
                    onStarClick={this.onStarClick.bind(this)}
                />

			</div>
		)
		function FieldGroup({ id, label, help, ...props }) {
		  return (
		    <FormGroup controlId={id}>
		      <ControlLabel>{label}</ControlLabel>
		      <FormControl {...props} />
		      {help && <HelpBlock>{help}</HelpBlock>}
		    </FormGroup>
		  );
		}
		return(
			<div>
				{/*
				<div>
			      <form onSubmit={this.submit.bind(this) }>
			      <h4><strong> Edit your review</strong></h4>
			      <table><tbody>
			      	<tr>
			      		<td> Rating </td>
			      		<td>{starRating}</td>
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
			  	 */}
			    
			    <div>
				    <Form onSubmit={this.submit.bind(this)}>
				    	<h4><strong> Edit your review </strong></h4>
				    	<strong> Rating {starRating}</strong>
						<FormGroup controlId="formControlsTextarea" label="Review" placeholder="Edit your review">
					      <ControlLabel>Review</ControlLabel>
					      <FormControl componentClass="textarea" ref="review" defaultValue={this.state.review} inputRef={ref => { this.input = ref; }} />
					    </FormGroup>
					    <Button id="submit" type="submit"> Submit</Button><br></br>
				    </Form>
				{
					// delete function is not working properly
				    <button type="delete" onClick={this.delete.bind(this)}>Delete</button>
				    }
			    </div>
			</div>
		)
	}
}

export default Edit;
