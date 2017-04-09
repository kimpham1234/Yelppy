import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';

class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, location: String, id: String, reviews: []};
	}

	componentWillMount(){
        this.id = this.props.params.name;
		console.log("mounting, key="+this.id);
		var restaurantRef = firebase.database().ref('restaurants');

		restaurantRef.orderByKey().equalTo(this.id).on('child_added', function(snapshot) {
            var value = snapshot.val();
			this.name = value.name;
            this.storenum = value.storenum;
			this.rating = value.rating;
			this.location = value.loc;
			console.log("id=" + this.id);
		}.bind(this));


		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByChild('id').equalTo(this.id).on('child_added',function(snapshot) {
			this.state.reviews.push(snapshot.val());
		    console.log(snapshot.val())
		    this.setState({reviews: this.state.reviews})
		}.bind(this));
	}



	render() {
		var showDetail = 	<div>
						<table><tbody>
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
				    	</tbody></table>
				    	<button type="button"><Link to={'/reviews/new/'+this.id.valueOf()}>Write a review</Link></button>
					</div>;
		var showReview =(
				<div>
			      {this.state.reviews.map((review, index) =>(
				    <ul key={index}>
				    	<li>Author: {review.author} </li>
					    <li>Rating: {review.rating }/5</li>
					    <li>Review: {review.text }</li>
				    </ul>))}
			    </div>
			)

		return (
			<div>
				<h1>Restaurant</h1>
				<Link to={'/restaurants/'+this.id}>Reload</Link><br></br>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}
		    </div>
	)}

}

export default RestaurantDetail;
