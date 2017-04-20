import React, { Component } from 'react';
import { Link, Router } from 'react-router'
import * as firebase from 'firebase';
import { Navbar, Nav, NavItem, Button, ButtonToolbar, Jumbotron, Table, buttonsInstance } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
class RestaurantDetail extends Component{

	constructor(){
		super();
		//this.state = {name: String, rating: String, numberOfReviews: Number, location: String, id: String, reviews: [], keys: [], images: [], links: [], currentUser: ""};
		this.state = {name: String, rating:String, numReview: String, id: String,  price: String,
					  avatar: String, categories: String, coordinates: [], phone: String, location: String,
					  snapshotKey: String,
					  reviewKeys:[],
					  reviews: [],
					  images: []
					 }
		this.imageUpload = this.imageUpload.bind(this);
	}

	setReview(key){
		var review_temp_list = [];
		var reviewKey_temp_list = [];
		console.log('in setReview snapshotKey_temp'+ key);
		var that = this;
		this.reviewListRef = firebase.database().ref('reviews');
		this.reviewListRef.orderByChild('id').equalTo(key).on('child_added',function(snapshot) {
			review_temp_list.push(snapshot.val());
			reviewKey_temp_list.push(snapshot.key);
			that.setState({reviews: review_temp_list});
			that.setState({reviewKeys: reviewKey_temp_list});
		}.bind(this));
	}

	sample(){
		console.log('yay');
	}

	componentWillMount(){
		console.log("Restaurant details mounting");
		this.restaurantRef = firebase.database().ref('business');
		var that = this;
		var snapshotKey_temp = "";
		this.restaurantRef.orderByChild('id').equalTo(this.props.params.id)
										.on('child_added', function(snapshot) {
              	snapshotKey_temp = snapshot.key;
              	var val = snapshot.val();
       			var address = "";
       			for(var i = 0; i < val.location.display_address.length; i++){
       				address += val.location.display_address[i]+', ';
       			}
       			that.setState({snapshotKey: snapshotKey_temp}, (snapshotKey)=>{
       				console.log('in call back'+ snapshotKey_temp);
       				that.setReview(snapshotKey_temp);
       			});
            	that.setState({name: val.name});
            	that.setState({rating: val.rating});

            	that.setState({numReview: val.numReview});
            	that.setState({id: val.id});
            	that.setState({location: address})
            	that.setState({avatar: val.avatar});
            	that.setState({categories: val.categories});
            	that.setState({coordinates: val.coordinates});
            	that.setState({phone: val.phone});
            	that.setState({price: val.price});
            	that.setState({images: val.images});
		}.bind(this));
		//var review_temp_list = [];
		//var reviewKey_temp_list = [];

		console.log('snapshotKey_temp'+ snapshotKey_temp);
		this.reviewListRef = firebase.database().ref('reviews');
		this.reviewListRef.orderByChild('id').equalTo(snapshotKey_temp).on('child_added',function(snapshot) {
			this.state.reviews.push(snapshot.val());
		    this.state.reviewKeys.push(snapshot.key);
		    this.setState({reviews: this.state.reviews})
		    this.setState({reviewKeys: this.state.keys})
		}.bind(this));


		//this.setState({reviews: review_temp_list});
		//this.setState({reviewKeys: reviewKey_temp_list});
		//console.log(review_temp_list);

	}



	componentWillUnmount(){
		this.restaurantRef.off();
	}


	imageUpload(){
		console.log("in image upload");
		var currentUser = firebase.auth().currentUser;
		console.log(currentUser);
		if(currentUser!=null){
			console.log("upload");
			var firebaseStorage = firebase.storage();

			// File or Blob named mountains.jpg
			var file = document.getElementById('input').files[0];

			// Create the file metadata
			var metadata = {
			  contentType: 'image/jpeg'
			};

			// Upload file and metadata to the object 'images/mountains.jpg'
			var uploadTask = firebaseStorage.ref('images/' + this.state.name + '/' + currentUser.email+'/'+ file.name).put(file, metadata);
			var that = this;
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
			  }, function() {
				  // Upload completed successfully, now we can get the download URL
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  var images_temp_list = that.state.images;
				  if(images_temp_list[0]=="")
				  	images_temp_list[0] = downloadURL;
				  else images_temp_list.push(downloadURL);
				  that.setState({images: images_temp_list});

				  var resRef = firebase.database().ref('/business/'+that.state.snapshotKey);
				  resRef.update({images: images_temp_list});
			}.bind(this));
			//end image upload
		}
}

	render() {
		var showDetail = (
			<div>
				<div>
					<h1>{ this.state.name}</h1>
					<li><img src={ this.state.avatar } width="100" height="100"/></li>
					<li>Rating: {' '+ this.state.rating==0 ? 0 : this.state.rating }/5</li>
					<li>Address: {' '+ this.state.location}</li>
					<li>Reviews: {' '+ this.state.numReview==0 ? 0 : this.state.numReview }</li>
				    <li>Categories: {' '+ this.state.categories }</li>
				    <li>Phone: {' '+ this.state.phone }</li>
				    <li>Price: { ' '+this.state.price }</li><br></br>
				</div>
				<div>
					{ this.state.images.map((image, index) =>(
				    	<a key = {index} target="_blank" href = {image}>
				    		<img src={image} width="220" height="160" />
				    	</a>
				       )
					)}
				</div>

				<div>
			    	<br></br>
			    	<table><tbody>
			    		<tr>
			    			<td>Add a Photo:</td>
			    			<td></td>
			    		</tr>
			    		<tr>
			    			<td><input type="file" id="input"/></td>
			    			<td><button type="button" onClick = {this.imageUpload}>Add</button></td>
			    		</tr>
			    	</tbody></table>
			    	<button type="button"><Link to={'/reviews/new/'+this.state.snapshotKey}>Write a review</Link></button>
		    	</div>
	    	</div>
		)

		var showReview = (
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
				    				<button type="button" ><Link to={'/reviews/edit/'+this.state.reviewKeys[index]}>Edit</Link></button>
				    			</td>
							</tr>
						))}
					</tbody>
				</Table>
		    </div>
		)
		return (
			<div>
				{showDetail}
				<h2> Reviews </h2>
				{showReview}
		    </div>
		)

	}

}

export default RestaurantDetail;
