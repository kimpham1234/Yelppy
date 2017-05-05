import React, { Component } from 'react';
import { Link, Router } from 'react-router'
import * as firebase from 'firebase';
import { Navbar, Nav, NavItem, Button, ButtonToolbar, Jumbotron, Table, buttonsInstance } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import StarRatingComponent from 'react-star-rating-component';



const picURL = "https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41";

class RestaurantDetail extends Component{
    constructor(props){
        super(props);
        this.state = {name: String, rating:String, numReview: String, id: String,  price: String,
                      avatar: String, categories: String, coordinates: [], phone: String, location: String,
                      snapshotKey: String,
                      reviewKeys:[],
                      reviews: [],
                      images: [],
                      currentUser: {}
                     }
        this.imageUpload = this.imageUpload.bind(this);
    }

    setReview(key){
        var review_temp_list = [];
        var reviewKey_temp_list = [];
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
    }

    componentWillMount(){
        this.restaurantRef = firebase.database().ref('business');
        var that = this;
        var snapshotKey_temp = "";
        this.restaurantRef.orderByChild('id').equalTo(this.props.params.id)
            .on('child_added', function(snapshot) {
                snapshotKey_temp = snapshot.key;
                var val = snapshot.val();
                var address = "";
                for(var i = 0; i < val.location.display_address.length; i++){
                    if(i!=val.location.display_address.length-1)
                        address += val.location.display_address[i]+', ';
                    else
                        address += val.location.display_address[i];
                }
                that.setState({snapshotKey: snapshotKey_temp}, (snapshotKey)=>{
                    that.setReview(snapshotKey_temp);
                });
                that.setState({
                    name: val.name,
                    rating: val.rating,
                    numReview: val.numReview,
                    id: val.id,
                    location: address,
                    avatar: val.avatar,
                    categories: val.categories,
                    coordinates: val.coordinates,
                    phone: val.phone,
                    price: val.price,
                    images: val.images
                });
            }.bind(this));
        //var review_temp_list = [];
        //var reviewKey_temp_list = [];

        // console.log('snapshotKey_temp'+ snapshotKey_temp);
        // this.reviewListRef = firebase.database().ref('reviews');
        // this.reviewListRef.orderByChild('id').equalTo(snapshotKey_temp).on('child_added',function(snapshot) {
        //     this.state.reviews.push(snapshot.val());
        //     this.state.reviewKeys.push(snapshot.key);
        //     this.setState({reviews: this.state.reviews})
        //     this.setState({reviewKeys: this.state.keys})
        // }.bind(this));



        this.setState({currentUser: firebase.auth().currentUser});
    }



    componentWillUnmount(){
        this.restaurantRef.off();
    }


    imageUpload(){
        var currentUser = firebase.auth().currentUser;
        if(currentUser!=null){
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
                    if(images_temp_list[0]==picURL)
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
                    <Table><tbody>
                        <tr>
                            <td width="128"><img src={this.state.avatar} width="128" height="128"/></td>
                            <td>
                            {<StarRatingComponent
                                                name="star"
                                                editing = {false}
                                                starColor="#ffb400"
                                                emptyStarColor="#ffb400"
                                                value={parseFloat(this.state.rating)}
                                                renderStarIcon={(index, value) => {
                                                    return <span className={index <= value ? 'fa fa-star' : (index == value+0.5 ?'fa fa-star-half-full' : 'fa fa-star-o')} />;
                                                    }
                                                }
                            />}
                            <br></br>{this.state.numReview ? this.state.numReview : '0'} reviews
                            <br></br>{this.state.location}
                            <br></br>Categories: {this.state.categories ? this.state.categories : 'none'}
                            <br></br>Phone: {this.state.phone ? this.state.phone : 'unknown'}
                            <br></br>Price: {(this.state.price === '') ? 'unknown' : this.state.price}
                            </td>
                        </tr>
                    </tbody></Table>
                </div>
                <div>
                    { this.state.images.map((image, index) =>(
                            <a key={index} target="_blank" href={image}>
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
                        <td><button type="button" onClick={this.imageUpload}>Add</button></td>
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
                        <th>Flag Button</th>
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
                                    <StarRatingComponent
                                        name="star"
                                        editing={false}
                                        starColor="#ffb400"
                                        emptyStarColor="#ffb400"
                                        value={parseFloat(review.rating)}
                                        renderStarIcon={(index, value) => {
                                            return <span className={index <= value ? 'fa fa-star' : (index === value+0.5 ?'fa fa-star-half-full' : 'fa fa-star-o')} />;
                                            }
                                        }
                                    />
                                </td>

                                <td>
                                    { review.text }
                                </td>

                                <td>
                                    <button type="button" ><Link to={'/reviews/edit/'+this.state.reviewKeys[index]}>Edit</Link></button>
                                </td>

                                <td>
                                    <button type="button" ><Link to={'/reviews/new_review_flag/'+this.state.reviewKeys[index]}>Flag this review</Link></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
        // console.log('name', new Date());
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