import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';
import { Navbar, Nav, NavItem, Button, ButtonToolbar, Jumbotron, Table, buttonsInstance } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
class RestaurantDetail extends Component{

	constructor(){
		super();
		this.state = {name: String, rating: String, num: Number, location: String, id: String, reviews: [], keys: [], images: [], links: [], currentUser: ""};
		this.imageUpload = this.imageUpload.bind(this);
	}

	componentWillMount(){
		console.log("mounting");
		this.currentUser = firebase.auth().currentUser;
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
						<table>
						    <tr>
                                <td> <h1>{this.name}</h1> </td>
                            </tr>
                            <tr>
                                <td>Rating</td>
                                <td>{ this.rating }/5</td>
                            </tr>
						    <tr>
                                <td>Store Number</td>
                                <td>{ this.storenum }</td>
                            </tr>
						    <tr>
                                <td>Address</td>
                                <td>{ this.location }</td>
                            </tr>
				    	</table>

				    	{this.state.links.map((link, index) =>(
				    	<a key = {index}>
				    	<img src={link} width="220" height="160"/>
				    	</a>
				    ))}
				    <div>
				    	
				    	
				    	
				    	
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
					<table>
			      {this.state.reviews.map((review, index) =>(
				    <tr id = "imageList" key={index}>
				    	<td>{review.author} </td>
				    	<td>
				    	<p>Rating: {review.rating} </p>
					    <p>Review:{review.text }</p>
					    </td>
					    <td><button type="button" ><Link to={'/reviews/edit/'+this.state.keys[index]}>Edit</Link></button>
					   </td>
				    </tr>))}
				    </table>

			    </div>
			)

		return (
			<div>
				<Link to={'/restaurants/'+this.props.params.name+((typeof this.props.params.storenum == 'undefined') ? '' : '/'+this.props.params.storenum)}>Reload</Link><br></br>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}
		    </div>
	)}
}

export default RestaurantDetail;

