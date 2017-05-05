import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Form } from 'react-bootstrap';
class ReviewFlag extends Component{

	constructor(props){
		super(props);
		this.state = {restaurant_id: String, review_id: String};
	}

	componentWillMount() {
		var reviewRef = firebase.database().ref('reviews/'+this.props.params.id).once('value',function(snapshot){
				var restaurantKey = snapshot.val().id;
				var reviewId = this.props.params.id;
				this.setState({review_id: this.props.params.id});
				var restaurantRef = firebase.database().ref('business/'+restaurantKey+'/id').once('value',function(snapshot){
					var restaurantKeyId = snapshot.val();
					this.setState({restaurant_id: restaurantKeyId});
				}.bind(this));
			}.bind(this));
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
				restaurant_id: this.state.restaurant_id,
				review_id: this.state.review_id,
				flag_content: this.flag_content.value
			});
			var restaurantId = this.state.restaurant_id;
			var path = '/restaurants/'+ restaurantId;
			hashHistory.push(path);
		}
	}

	render(){
		return(
			<div>
				<Form onSubmit={this.submit.bind(this) }>
					<h4><strong> Write a review flag for this comment </strong></h4>
						<FormGroup controlId="formControlsText" label="ReviewFlag" placeholder="Edit your review">
							<ControlLabel>Reason for this flag</ControlLabel>
						    <FormControl type="text" ref="flag_content" placeholder="Please tell us why ..." inputRef={ref => { this.flag_content = ref; }} />
						</FormGroup>
			    	<Button id="submit" type="submit"> Submit</Button><br></br><br></br>
			    </Form>
			</div>
		)
	}
}

export default ReviewFlag;
