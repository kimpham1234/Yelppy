import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
import { Table, buttonsInstance } from 'react-bootstrap';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Form } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
class NewReview extends Component{

	constructor(){
		super();
		this.state = {restaurantName: String, restaurantId: String, restaurantKey: String,
					  rating: 3, uid: String, userNumReview: String, reviewed: [],
					  dishRated:[], dishRatedKey:[], hasDishRating: false};
	}

	componentWillMount(){
		this.restaurantRef = firebase.database().ref('business');
		var that = this;
		var tempResId="";
		this.restaurantRef.orderByKey().equalTo(this.props.params.id).once('child_added',  function(snapshot) {
			tempResId = snapshot.val().id;
			that.setState({restaurantName: snapshot.val().name});
			that.setState({restaurantId: tempResId}, ()=>{
				that.getDishRating(tempResId);
			});
			that.setState({restaurantKey: snapshot.key});
			this.updateReview(snapshot.key);
		}.bind(this));
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
	getDishRating(restaurantId){
		var dishRatingRef = firebase.database().ref('dishRating');
		var tempdish = [];
		var tempkey = [];
		var that = this;
		dishRatingRef.orderByKey().equalTo(restaurantId).on('child_added', function(snapshot){
			snapshot.forEach(function(childSnapShot){
				var value = childSnapShot.val();
				tempdish.push(childSnapShot.val());
				tempkey.push(childSnapShot.key);
				that.setState({dishRated: tempdish});
				that.setState({dishRatedKey: tempkey});
			});
		});
		dishRatingRef.orderByKey().equalTo(restaurantId).on('child_changed', function(snapshot){
			tempdish = [];
			tempkey = [];
			snapshot.forEach(function(childSnapShot){
				var value = childSnapShot.val();
				tempdish.push(childSnapShot.val());
				tempkey.push(childSnapShot.key);
				that.setState({dishRated: tempdish});
				that.setState({dishRatedKey: tempkey});
				that.setState({hasDishRating: true});
			});
		});
	}
	submit(e){
		var currentUser = firebase.auth().currentUser;
		if(currentUser!==null && this.state.rating!=="" && this.review.value!==""){
			e.preventDefault();
			var reviewListRef = firebase.database().ref('reviews');
			var newReviewRef = reviewListRef.push();
			var time = Date();
			newReviewRef.set({
			  timestamp: time,
			  author: currentUser.email,
			  images: [""],
			  rating: this.state.rating,
			  text: this.review.value,
			  id: this.refs.id.value,
			  restaurant_author: this.refs.id.value +'/' + currentUser.email
			});
			var path = '/restaurants/'+this.state.restaurantId;
			hashHistory.push(path);
			this.updateUserProfile(this.state.uid);
			this.updateReview(this.state.restaurantKey);
		}
		else if (currentUser===null)
		{
			alert('Sorry. You are not logged in');
			var path = '/restaurants/'+this.state.restaurantId;
			hashHistory.push(path);
		}
		else if (this.state.rating===null || this.review.value==="")
		{
			alert('Sorry. Inputs cannot be empty');
			var path = '/restaurants/'+this.state.restaurantId;
			hashHistory.push(path);
		}
		else
		{
			alert('Sorry. Error with input');
			var path = '/restaurants/'+this.state.restaurantId;
			hashHistory.push(path);
		}
	}
	//update number of review and reviewed restaurant in user profile
	updateUserProfile(reviewKey){
		var userUpdateRef = firebase.database().ref('users/'+this.state.uid);
		if(this.state.reviewed[0]=="")
			this.state.reviewed[0] = this.state.restaurantName+"/"+this.state.restaurantId+"/"+this.state.rating+"/"+this.review.value;
		else this.state.reviewed.push(this.state.restaurantName+"/"+this.state.restaurantId+"/"+this.state.rating+"/"+this.review.value);
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

    upvote(index){
    	var votedUser = this.state.dishRated[index].users;
    	var oldVote = Number(this.state.dishRated[index].vote);
    	var i = votedUser.indexOf(firebase.auth().currentUser.uid);
    	if(i===-1){
    		oldVote++;
    		votedUser.push(firebase.auth().currentUser.uid);
    		var votedDishRef = firebase.database().ref('dishRating').child(this.state.restaurantId).child(this.state.dishRatedKey[index]);
    		votedDishRef.update({
    			vote: oldVote,
    			users: votedUser
    		});
    	}else{
    		alert("You already voted for this dish");
    	}
    }

    addDish(e){
    	e.preventDefault();
    	var newDishRef = firebase.database().ref('dishRating').child(this.state.restaurantId).push();
    	newDishRef.set({
    		name: this.dishName.value,
    		vote: 1,
    		users: [firebase.auth().currentUser.uid]
    	})

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
				    <Form onSubmit={this.submit.bind(this)}>
					    <h4><strong> Write a review for {this.state.restaurantName} </strong></h4>
					    <strong> Rating {starRating}</strong>
						<FormGroup controlId="formControlsTextarea" label="Review" placeholder="Edit your review">
							<ControlLabel>Review</ControlLabel>
						    <FormControl componentClass="textarea" ref="review" placeholder="Share your thoughts ..." inputRef={ref => { this.review = ref; }} />
						</FormGroup>
						<Button id="submit" type="submit"> Submit</Button><br></br>
				    </Form>
				    <input type="hidden" ref="id" value={this.props.params.id}/>
				</div>

				<br></br>
				<br></br>
				<br></br>

				<Form onSubmit={this.addDish.bind(this)}>
					<FormGroup controlId="formValidationSuccess2" validationState="success">
				        <ControlLabel>Add your own dish</ControlLabel>
				        <FormControl type="text" ref="dishName" placeholder="Your dish" inputRef={ref => { this.dishName = ref; }}/>
				        <FormControl.Feedback />
				        <HelpBlock>Rate your dish, upvote for the ones here or add your own dish</HelpBlock>
				    </FormGroup>
				    <Button id="submit" type="submit">Add</Button><br></br>
			    </Form>
			    <Table striped condensed hover responsive>
					<thead>
				      <tr>
				        <th>Dishes</th>
				        <th>Votes</th>
				        <th></th>
				      </tr>
				    </thead>
				    <tbody>
				    	{this.state.dishRated.map((dish, index) => (
				    		<tr key={index}>
				    			<td>
				    				{dish.name}
				    			</td>
				    			<td>
				    				{dish.vote}
				    			</td>
				    			<td>
									<Button type="button" onClick={()=>this.upvote(index)}>Upvote</Button>
				    			</td>
				    		</tr>
				    	))}
				    </tbody>
				</Table>
			</div>
		)
	}
}
export default NewReview;
