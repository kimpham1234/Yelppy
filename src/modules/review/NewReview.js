import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
import StarRatingComponent from 'react-star-rating-component';
class NewReview extends Component{

	constructor(){
		super();
		this.state = {restaurantName: String, restaurantId: String, restaurantKey: String, rating: 3, uid: String, userNumReview: String, reviewed: []};
	}


	componentWillMount(){
		this.restaurantRef = firebase.database().ref('business');
		var that = this;
		this.restaurantRef.orderByKey().equalTo(this.props.params.id).once('child_added',  function(snapshot) {
			that.setState({restaurantName: snapshot.val().name});
			that.setState({restaurantId: snapshot.val().id});
			that.setState({restaurantKey: snapshot.key});
			this.updateReview(snapshot.key);
		}.bind(this));

		console.log('New review component wil mount');

		//get user data to update later
		var userEmail = firebase.auth().currentUser.email;
		this.userRef = firebase.database().ref('users');
		this.userRef.orderByChild('email').equalTo(userEmail).once('child_added', function(snapshot){
			that.setState({
				uid: snapshot.key,
				userNumReview: snapshot.val().numReviews,
				reviewed: snapshot.val().reviewed
			});
		}.bind(this));
	}

	submit(e){
		var currentUser = firebase.auth().currentUser;

		if(currentUser!==null && this.refs.rating!=="" && this.refs.review.value!==""){
			e.preventDefault();
			var reviewListRef = firebase.database().ref('reviews');
			var newReviewRef = reviewListRef.push();
			var time = Date();
			newReviewRef.set({
			  timestamp: time,
			  author: currentUser.email,
			  images: [""],
			  rating: this.state.rating,
			  text: this.refs.review.value,
			  id: this.refs.id.value,
			  restaurant_author: this.refs.id.value +'/' + currentUser.email
			});

			var path = '/restaurants/'+this.state.restaurantId;

			this.updateUserProfile(this.state.uid);
			hashHistory.push(path);
			this.updateReview(this.state.restaurantKey);

		}
		else if (currentUser===null)
		{
			alert('Sorry. You are not logged in');
		}
		else if (this.refs.rating!==null || this.refs.review.value!==null)
		{
			alert('Sorry. Inputs cannot be empty');
		}
	}

	//update number of review and reviewed restaurant in user profile
	updateUserProfile(reviewKey){
		var userUpdateRef = firebase.database().ref('users/'+this.state.uid);
		if(this.state.reviewed[0]=="")
			this.state.reviewed[0] = this.state.restaurantName+"/"+this.state.restaurantId+"/"+this.state.rating+"/"+this.refs.review.value;
		else this.state.reviewed.push(this.state.restaurantName+"/"+this.state.restaurantId+"/"+this.state.rating+"/"+this.refs.review.value);
		
		userUpdateRef.update({
			numReviews: Number(this.state.userNumReview) + 1,
			reviewed: this.state.reviewed
		});
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
		return(
			<div>
				<div>
			      <form className="col-md-2" onSubmit={this.submit.bind(this) }>
			      <h4> Write a review for {this.state.restaurant} </h4>
			      <table><tbody>
			      	<tr>
			      		<td> Rating </td>
			      		<td>{starRating}</td>
			      	</tr>

			      	<tr>
			      		<td> Review </td>
			      		<td>  <textArea cols="50" type="text" ref="review" placeholder="Share your thoughts..."/></td>
			      	</tr>
			      	
			      </tbody></table>
			      <button type="submit">Submit</button>
				</form>
				<input type="hidden" ref="id" value={this.props.params.id}/>
			    </div>
			</div>
		)
	}
}

export default NewReview;
