import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';

class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, num: Number, location: String, id: String, reviews: [], keys: []};
	}

	componentWillMount(){
		console.log("mounting");
		var restaurantRef = firebase.database().ref('restaurants');

		var tempId = '';

		restaurantRef.orderByChild('name')
                     .equalTo(this.props.params.name.split('_').join(' '))
                     .on('child_added', function(snapshot) {
                var value = snapshot.val();
    			this.name = value.name;
                this.storenum = value.storenum;
    			this.rating = value.rating;
    			this.location = value.loc;
    			this.id = snapshot.key;
    			tempId = snapshot.key;
    			console.log("temp id " + tempId);
            
		}.bind(this));


		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByChild('id').equalTo(this.id).on('child_added',function(snapshot) {
			this.state.reviews.push(snapshot.val());
		    this.state.keys.push(snapshot.key);
		    this.setState({reviews: this.state.reviews})
		    this.setState({keys: this.state.keys})
		}.bind(this));
	}

	render() {
		var showDetail = 	<div>
						<table>
						    <tr>
                                <td>Name</td>
                                <td>{ this.name }</td>
                            </tr>
						    <tr>
                                <td>Store Number</td>
                                <td>{ this.storenum }</td>
                            </tr>
						    <tr>
                                <td>Rating</td>
                                <td>{ this.rating }/5</td>
                            </tr>
						    <tr>
                                <td>Address</td>
                                <td>{ this.location }</td>
                            </tr>
						    <tr>
                                <td>ID</td>
                                <td>{ this.id }</td>
                            </tr>
				    	</table>
				    	<button type="button"><Link to={'/reviews/new/'+this.id}>Write a review</Link></button>
					</div>;

		var showReview =(
				<div>
			      {this.state.reviews.map((review, index) =>(
				    <ul key={index}>
				    	<li>Author: {review.author} </li>
				    	<li>Rating: {review.rating} </li>
					    <li>Review:{review.text }</li>
					    <li><button type="button"><Link to={'/reviews/edit/'+this.state.keys[index]}>Edit</Link></button></li>

					   
				    </ul>))}
			    </div>
			)

		return (
			<div>
				<h1>Restaurant</h1>
				<Link to={'/restaurants/'+this.props.params.name+((typeof this.props.params.storenum == 'undefined') ? '' : '/'+this.props.params.storenum)}>Reload</Link><br></br>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}
		    </div>
	)}
}

export default RestaurantDetail;

