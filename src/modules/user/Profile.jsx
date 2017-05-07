import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Link, Router } from 'react-router'
import { ListGroupItem, ListGroup, Table, Well } from 'react-bootstrap';
import ResetPassword from './ResetPassword.js';
const picURL = "https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41";
export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {profile: {}, reviewed: [], resName: [], images: [], key: ''};
		this.imageUpload = this.imageUpload.bind(this);
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
				reviewed: snapshot.val().reviewed,
				images: snapshot.val().pictures,
				key: snapshot.key
			});
		}.bind(this));
	}
	imageUpload() {
		var currentUser = firebase.auth().currentUser;
		if(currentUser!=null) {
			var firebaseStorage = firebase.storage();
			var file = document.getElementById('input').files[0];
			var metadata = {
                contentType: 'image/jpeg'
            };
            var uploadTask = firebaseStorage.ref('images/profile/'+ currentUser.email+'/'+ file.name).put(file, metadata);
            var that = this;
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            	function(snapshot) {
            		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            		console.log('Upload is ' + progress + '% done');
            		switch (snapshot.state) {
            			case firebase.storage.TaskState.PAUSED: // or 'paused'
            				console.log('Upload is paused');
            				break;
            			case firebase.storage.TaskState.RUNNING: // or 'running'
            				console.log('Upload is running');
                            break;
            		}
            	}, function(error) {
            		switch (error.code) {
                        case 'storage/unauthorized':
                        	console.log('User does not have permission to access the object');
                            break;
                        case 'storage/canceled':
                        	console.log('User canceled the upload');
                            break;
                        case 'storage/unknown':
                        	console.log('Unknown error occurred, inspect error.serverResponse');
                            break;
                    }
            	}, function() {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    var images_temp_list = that.state.images;
                    if(images_temp_list[0]==picURL)
                        images_temp_list[0] = downloadURL;
                    else images_temp_list.push(downloadURL);
                    that.setState({images: images_temp_list});

                    var userRef = firebase.database().ref('users/' + this.state.key);
                    console.log('this.state.images', this.state.images);
					userRef.update({
						pictures: this.state.images,
					});
                }.bind(this));
		}
	}
	componentWillUnmount() {
	}
	render() {
		var showReviewed = (
	  		<div>
	  			{ this.state.reviewed[0]!=="" &&
					<p className="App-intro"><strong>Your reviews</strong></p> }
				{ this.state.reviewed[0]!=="" &&
						this.state.reviewed.map((review, index) =>(
							<ListGroup key={index}>
								<ListGroupItem><Link to={'/restaurants/'+review.split("/")[1]}>{review.split("/")[0]}</Link></ListGroupItem><br></br>
								<p className="text-right">Rating: {review.split("/")[2]}/5</p>
								<p className="text-right">Review: {review.split("/")[3]}</p>
					  		</ListGroup>
		  			))
		  		}
	  		</div>
			);
		var profileInfo = (
			<div>
				<ListGroup>
					<ListGroupItem header="Profile Picture">
					<img className="profile-photo" src={ this.state.images.length-1===0 ? require('../pictures/profile.png') : this.state.images[this.state.images.length-1]}/><br></br>
						<input type="file" id="input"/>
						<button type="button" onClick={this.imageUpload}>Add Profile Picture</button>
					</ListGroupItem>
					<ListGroupItem header="First name">{this.state.profile.first}</ListGroupItem>
				    <ListGroupItem header="Last name">{this.state.profile.last}</ListGroupItem>
				    <ListGroupItem header="Number of your reviews">{this.state.profile.numReviews}</ListGroupItem>
				    <ListGroupItem header="Your Email" bsStyle="info">{firebase.auth().currentUser.email}</ListGroupItem>
				    <ListGroupItem header="Edit your profile" bsStyle="danger"><Link to={'/profile/edit/'+this.state.uid}>Edit profile</Link></ListGroupItem>
				    <ListGroupItem header="Reset your password" bsStyle="danger"><Link to={'/resetPassword/'}>Reset password</Link></ListGroupItem>
				</ListGroup>
        	</div>
		);
		return (
			<div>
			    {profileInfo}
				<br></br>
				<br></br>
				{showReviewed}
			</div>
		)
	}
}
