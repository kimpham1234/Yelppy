import React, { Component } from 'react';
import { Link } from 'react-router'
import * as firebase from 'firebase';
import { Badge, ListGroup, ListGroupItem, Table, Grid, Col, Thumbnail, Row, Image } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import './DishRating.css';
import "../../App.css";
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
                      currentUser: {},
                      hasReviewed: false,
                      userReview: "",
                      userReviewKey: String,
                      userImages: [],
                      topDishes: []
                     }
        this.imageUpload = this.imageUpload.bind(this);
    }
    componentWillUnmount(){
        // this.restaurantRef.off();
    }
    setNormalReviews(key, review_temp_list, reviewKey_temp_list){
        var that = this;
        this.reviewListRef = firebase.database().ref('reviews');
        this.reviewListRef.orderByChild('id').equalTo(key).on('child_added',function(snapshot) {
            if(firebase.auth().currentUser==null || snapshot.val().author != firebase.auth().currentUser.email){
                review_temp_list.push(snapshot.val());
                reviewKey_temp_list.push(snapshot.key);
            }
            that.setState({reviews: review_temp_list,reviewKeys: reviewKey_temp_list});
        }.bind(this));
    }
    setUserReview(key, review_temp_list, reviewKey_temp_list){
        var userReview_temp = "";
        var userReviewKey_temp = "";
        var that = this;
        this.reviewListRef = firebase.database().ref('reviews');
        var res_au = key+"/" +firebase.auth().currentUser.email;
        this.reviewListRef.orderByChild('restaurant_author').equalTo(res_au).once('child_added',  function(snapshot) {
                    userReview_temp = snapshot.val();
                    userReviewKey_temp = snapshot.key;
                    review_temp_list.push(snapshot.val());
                    reviewKey_temp_list.push(snapshot.key);
                that.setState({userReview: userReview_temp, userReviewKey: userReviewKey_temp, userImages: userReview_temp.images},
                    ()=>{
            that.setNormalReviews(key, review_temp_list, reviewKey_temp_list, userReview_temp, userReviewKey_temp)
            })
        }.bind(this));
    }
    checkReview(key, id){
        var review_temp_list = [];
        var reviewKey_temp_list = [];
        var that = this;
        if(firebase.auth().currentUser!=null){
            this.userRef = firebase.database().ref('users');
            this.userRef.orderByChild('email').equalTo(firebase.auth().currentUser.email).once('child_added',  function(snapshot) {
                var reviewed = snapshot.val().reviewed;
                var bool = false;
                for (var i in reviewed) {
                    if(reviewed[i].split("/")[1] == id){
                           bool = true; 
                    }
                }
                that.setState({hasReviewed : bool}, ()=>{this.state.hasReviewed ?
                that.setUserReview(key, review_temp_list, reviewKey_temp_list)
                : that.setNormalReviews(key, review_temp_list, reviewKey_temp_list)
            })
            }.bind(this));
        }
        else that.setNormalReviews(key, review_temp_list, reviewKey_temp_list);
    }
    getTopDish(resId){
        var dishRatingRef = firebase.database().ref('dishRating');
        var tempdish = [];
        var that = this;
        dishRatingRef.orderByKey().equalTo(resId).on('child_added', function(snapshot){
            snapshot.forEach(function(childSnapShot){
                var value = childSnapShot.val();
                tempdish.push(childSnapShot.val());
            });
            tempdish.sort(that.compare);
            tempdish = tempdish.slice(0,5);
            that.setState({topDishes: tempdish});
        });
    }
    compare(a, b){
        return -(a.vote - b.vote);
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
                    that.checkReview(snapshotKey_temp, val.id);
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
        this.setState({currentUser: firebase.auth().currentUser});
        this.getTopDish(this.props.params.id);
    }
    imageUpload(){
        var currentUser = firebase.auth().currentUser;
        console.log(currentUser);
        if(currentUser!==null){
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
                    var user_images_list = that.state.userImages;
                    if(images_temp_list[0]===picURL)
                        images_temp_list[0] = downloadURL;
                    else images_temp_list.push(downloadURL);
                    that.setState({images: images_temp_list});
                    if(user_images_list[0]==="")
                        user_images_list[0] = downloadURL;
                    else user_images_list.push(downloadURL);
                    that.setState({userImages: user_images_list});
                    var resRef = firebase.database().ref('/business/'+that.state.snapshotKey);
                    resRef.update({images: images_temp_list});
                    var reviewRef = firebase.database().ref('/reviews/'+that.state.userReviewKey);
                    reviewRef.update({images: user_images_list});
                }.bind(this));
            //end image upload
        }
    }
    showWriteReview(){
        if(firebase.auth().currentUser!=null&&!this.state.hasReviewed){
            return <button type="button"><Link to={'/reviews/new/'+this.state.snapshotKey}>Write a review</Link></button>
        }
    }
    showEditButton(review, index){
        if(firebase.auth().currentUser!=null&&(this.state.hasReviewed && review.author == this.state.userReview.author)){
            return <button type="button" ><Link to={'/reviews/edit/'+this.state.reviewKeys[index]}>Edit</Link></button>
        }
    }
    showFlagButton(review, index){
        if(firebase.auth().currentUser!=null&&(!this.state.hasReviewed||review.author != this.state.userReview.author)){
            return <button type="button" ><Link to={'/reviews/new_review_flag/'+this.state.reviewKeys[index]}>Flag this review</Link></button>
        }
    }
    showImageUploading(){
        if(firebase.auth().currentUser!=null){
            return      <table>
                            <tbody>
                                <tr>
                                    <td>Add a Photo:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><input type="file" id="input"/></td>
                                    <td><button type="button" onClick={this.imageUpload}>Add</button></td>
                                </tr>
                            </tbody>
                        </table>
        }
    }
    showReviewImages(review, index){
        var imageList = ""
        if(this.state.hasReviewed && review.author == this.state.userReview.author){
            imageList = this.state.userImages;
        }
        else{
            imageList = review.images   
        }
        return  <div>
                        { 
                            imageList.map((image, index) =>(
                                image != "" ?
                                    <a key={index} target="_blank" href={image} >
                                        <Col xs={6} md={5}>
                                            <Image className="review-photo" src={image} thumbnail/>
                                        </Col>
                                    </a>
                                
                                : ""
                            ))
                        }
                    </div>  
    }
    render() {
        var showDishRating = (
            <div className="dishRating">
            <h3><strong>Top Dishes</strong></h3>
                    {this.state.topDishes.map((dish, index)=>
                    <ListGroup key={index}>
                        <ListGroupItem>{dish.name}<Badge>{dish.vote}</Badge></ListGroupItem>
                    </ListGroup>
                )}
            </div>
        )
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
                                <Image className="review-photo" src={image} thumbnail/>
                            </a>
                        )
                    )}
                </div>
                <div>
                    <br></br>
                    {this.showImageUploading()}
                    {this.showWriteReview()}
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
                                    {this.showReviewImages(review, index)}
                                </td>

                                <td>
                                    {this.showEditButton(review, index)}
                                </td>

                                <td>
                                    {this.showFlagButton(review, index)}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </div>
        )
        return (
            <div>
                {showDetail}
                {showDishRating}
                <h2> Reviews </h2>
                {showReview}
            </div>
        )
    }
}
export default RestaurantDetail;