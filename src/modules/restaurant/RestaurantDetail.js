import React, { Component } from 'react';
import { Link, Router } from 'react-router'
import * as firebase from 'firebase';
import { Navbar, Nav, NavItem, Button, ButtonToolbar, Jumbotron, Table, buttonsInstance } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: Number, num: Number, location: String, id: String, reviews: [], keys: [], images: [], links: [], currentUser: ""};
		this.imageUpload = this.imageUpload.bind(this);
	}

	componentWillMount(){
		console.log("mounting");
		this.currentUser = firebase.auth().currentUser;
		var restaurantRef = firebase.database().ref('restaurants');
		var tempId = '';
		this.state.num = 0;
		this.state.rating = 0;
		restaurantRef.orderByChild('name')
                     .equalTo(this.props.params.name.split('_').join(' '))
                     .on('child_added', function(snapshot) {
                var value = snapshot.val();
    			this.name = value.name;   //this.setState({this.state.name: kfnkf})
                this.storenum = value.storenum;
    			this.rating = value.rating;
    			this.location = value.loc;
    			this.id = snapshot.key;
    			this.images = value.images;
    			tempId = snapshot.key;
		}.bind(this));

		var reviewListRef = firebase.database().ref('reviews');
		reviewListRef.orderByChild('id').equalTo(this.id).on('child_added',function(snapshot) {
			this.state.reviews.push(snapshot.val());
		    this.state.keys.push(snapshot.key);
		    this.setState({reviews: this.state.reviews})
		    this.setState({keys: this.state.keys})
		}.bind(this));


		
		firebase.database().ref('restaurants/'+this.id+'/images').on("child_added", function(snapshot) {
  		var url = snapshot.val();
  			if(url!="") {
  			this.state.links.push(url);
			}
		}.bind(this));
	}
	imageUpload(){
		if(this.currentUser!=null)
		{
		console.log("upload");
		var firebaseStorage = firebase.storage();
				// File or Blob named mountains.jpg
		var file = document.getElementById('input').files[0];

		// Create the file metadata
		var metadata = {
		  contentType: 'image/jpeg'
		};

		// Upload file and metadata to the object 'images/mountains.jpg'
		var uploadTask = firebaseStorage.ref('images/' + this.name + '/' + this.currentUser.email+'/'+ file.name).put(file, metadata);
		
		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
		  function(snapshot) {
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
					// User doesn't have permission to access the object
					break;
				case 'storage/canceled':
					// User canceled the upload
					break;
				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					break;
			}
			}

		  , function() {
		  // Upload completed successfully, now we can get the download URL
		  var downloadURL = uploadTask.snapshot.downloadURL;
		  this.images.push(downloadURL)
		  
		  var resRef = firebase.database().ref('restaurants/' + this.id);

		  resRef.set({
		  		name: this.name,
          		storenum: this.storenum,
		  		rating: this.rating,
		  		loc: this.location,
		  		images: this.images
			});
		  this.forceUpdate();
		}.bind(this));
	}



}
	
	render() {
		
		var showDetail = 	<div>

						<h1>{this.name}</h1>
						<li>Rating: { this.rating }</li>
					    <li>Store Number: { this.storenum }/5</li>
					    <li>Address: { this.location }</li><br></br>

				    	{this.state.links.map((link, index) =>(
				    	<a key = {index} target="_blank" href = {link}>
				    	<img src={link} width="220" height="160" />
				    	</a>
				    ))}
				    <div>
				    	
				    	
				    	
				    	<br></br>
				    	<table>
				    		<tr>
				    			<td>Add a Photo:</td>
				    			<td></td>
				    		</tr>
				    		<tr>
				    			<td><input type="file" id="input"/></td>
				    			<td><button type="button" onClick = {this.imageUpload}>Add</button></td>
				    		</tr>
				    	</table>
				    	<button type="button"><Link to={'/reviews/new/'+this.id}>Write a review</Link></button>

				    </div>
					</div>;

		var showReview =(
				<div>
				<Table striped condensed hover responsive>
					<thead>
					    <tr>
					        <th>Author</th>
					        <th>Rating</th>
					        <th>Review</th>
					        <th>Edit Button</th>
					    </tr>
					</thead>
					<tbody>
						{
							this.state.reviews.map((review, index) =>(
							<tr key={index}>
								<td>
				    				{ review.author }
				    			</td>

				    			<td>
				    				{ review.rating }
				    			</td>

				    			<td>
				    				{ review.text }
				    			</td>

				    			<td>
				    				<button type="button" ><Link to={'/reviews/edit/'+this.state.keys[index]}>Edit</Link></button>
				    			</td>
							</tr>
						))}
					</tbody>
				</Table>
		    </div>
			)
		return (
			<div>
				<Link to='restaurants'>Back to Restaurant List</Link><br></br>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}
		    </div>
	)}
}

export default RestaurantDetail;

