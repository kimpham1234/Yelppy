import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Link, Router } from 'react-router'

const picUrl = "https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41";
export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {first: String, uid: String, last: String, numReviews: String, pictures: [], reviewed: [], timestamp: String};
	}

	componentWillMount() {
		var userEmail=firebase.auth().currentUser.email;
		this.userRef=firebase.database().ref('users');
		var that=this;
		this.userRef.orderByChild('email').equalTo(userEmail).once('child_added', function(snapshot){
			console.log('email '+userEmail);
			console.log('snapshot '+ snapshot.val().first);
			var value = snapshot.val();
			
			if(value.pictures[0]==="")
				that.setState({pictures: [picUrl]});
			else that.setState({picutres: value.pictures});
			
			that.setState({
				first: value.first,
				last: value.last,
				numReviews: value.numReviews,
				uid: value.UID		
			})
		}.bind(this));
	}

	render() {
		var showPictures = (
			<div>
			Pictures:<br></br>
                { this.state.pictures.map((picture, index) =>(
						<a key = {index} target="_blank" href = {picture}>
							<img src={picture} width="220" height="160" />
						</a>
                    )
                )}
			</div>
		)

		return (
			<div>
			    <li>First name: {this.state.first}</li>
			    <li>Last name: {this.state.last}</li>
				<li>Email: {firebase.auth().currentUser.email}</li>
				<li>Reviews: {this.state.numReviews}</li>
				<li><button type="button" ><Link to={'/profile/edit/'+this.state.uid}>Edit Profile</Link></button></li>
				{showPictures}
			</div>
			
		)
	}
}
