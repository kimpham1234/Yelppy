import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Link, Router } from 'react-router'

const picUrl = "https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41";
export default class Profile extends Component {
	constructor(props){
		super(props);
		//this.state = {first: String, uid: String, last: String, numReviews: String, pictures: [], reviewed: [], timestamp: String, reviewedRestaurant:[], reviewedContent: []};
		this.state = {profile: {}, reviewed: [], resName: []};
	}

	componentWillMount() {
		var userEmail=firebase.auth().currentUser.email;
		this.userRef=firebase.database().ref('users');
		var that=this;
		var tempReviewed = "";
		var that = this;
		this.userRef.orderByChild('email').equalTo(userEmail).on('child_added', function(snapshot){
			that.setState({
				profile: snapshot.val(),
				reviewed: snapshot.val().reviewed
			});
		}.bind(this));
	}

	render() {
		var showReviewed = (
				<div>
					<h3>Your reviews:</h3>
					{this.state.reviewed.map((item, index) =>(
							<table>
								<tr>
									<td>
										<tr><Link to={'business/'+item.split("/")[1]}>{item.split("/")[0]}</Link></tr>
									</td>
									<td>
										<tr>Your rating: {item.split("/")[2]}/5 </tr>
										<tr>Your comment: {item.split("/")[3]} </tr>
									</td>
								</tr>
							</table>
					))}
				</div>
			)

		return (
			<div>
			    <li>First name: {this.state.profile.first}</li>
			    <li>Last name: {this.state.profile.last}</li>
				<li>Email: {firebase.auth().currentUser.email}</li>
				<li>Reviews: {this.state.profile.numReviews}</li>
				<li><button type="button" ><Link to={'/profile/edit/'+this.state.uid}>Edit Profile</Link></button></li>
				<br></br>
				<br></br>
				{showReviewed}
			</div>

			
		)
	}
	

}
