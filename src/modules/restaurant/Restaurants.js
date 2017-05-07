import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import { buttonsInstance } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Table, Thead, Th, Tr, Td } from 'reactable';

class Restaurants extends Component{


	constructor(){
		super();
		this.state = {restaurants:[]};
	}

	componentWillMount(){
		this.restaurantListRef = firebase.database().ref('business');
		var that = this;

		var list = [];

		//listen for the value of restaurant once when first load
		this.restaurantListRef.once('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		    //that.state.restaurants.push(childSnapshot.val());
		    //that.setState({restaurants: that.state.restaurants})
		    list.push(childSnapshot.val());
		  });
		  that.setState({restaurants: list});
		});

		//listen for removal
		this.restaurantListRef.on('child_removed', function(oldChildSnapshot) {
		   var toRemoved =  list.indexOf(oldChildSnapshot);
		   list.splice(toRemoved, 1);
		   that.setState({restaurants: list});
		})
	}

	componentWillUnmount(){
		this.restaurantListRef.off();
	}

    render(){
		return(
			<div>
				<h1>List of restaurants</h1>
				<Link to='restaurants/new'>New</Link>
				<Table className="rtable" id="table" sortable={true} defaultSort={{column:"rating", direction:"desc"}} itemsPerPage={20} pageButtonLimit={15} previousPageLabel="Previous " nextPageLabel=" Next">
					<Thead>
                        <Th column="avatar">Avatar</Th>
                        <Th column="info">Info</Th>
                        <Th column="rating">Rating</Th>
				    </Thead>
			    	{this.state.restaurants.map((restaurant, index) => (
                        <Tr key={index}>
                            <Td column="avatar" value={restaurant.avatar} width={200}>
                                <img src={restaurant.avatar} alt={'Avatar for '+restaurant.name} height="200" width ="200"></img>
                            </Td>
                            <Td column="info" value={restaurant.name} data={
                                <table><tbody>
                                    <tr><td><Link to={'/restaurants/'+restaurant.id}>{restaurant.name}</Link></td></tr>
                                    <tr><td>{restaurant.location.display_address[0]}</td></tr>
                                    <tr><td>{restaurant.location.display_address[1]}</td></tr>
                                    <tr><td>Phone: {restaurant.phone ? restaurant.phone : "not available"}</td></tr>
                                    <tr><td>Price: {restaurant.price ? restaurant.price : "not available"}</td></tr>
                                    <tr><td>Categories: {restaurant.categories}</td></tr>
                                </tbody></table>
                            }/>
                            <Td column="rating" value={parseFloat(restaurant.rating)} data={
                                <table width={90}><tbody>
                                    <tr><td>
                                        <StarRatingComponent
                                            name="star"
                                            editing={false}
                                            starColor="#ffb400"
                                            emptyStarColor="#ffb400"
                                            value={parseFloat(restaurant.rating)}
                                            renderStarIcon={(index, value) => {
                                                return <span className={index <= value ? 'fa fa-star' : (index === value+0.5 ?'fa fa-star-half-full' : 'fa fa-star-o')} />;
                                                }
                                            }
                                        />
                                    </td></tr>
                                    <tr><td>{restaurant.numReview ? restaurant.numReview : '0'} review{restaurant.numReview && Math.round(parseFloat(restaurant.numReview)) === 1 ? '' : 's'}</td></tr>
                                </tbody></table>
                            }/>
                        </Tr>
                    ))}
				</Table>
		    </div>
	)}
}

export default Restaurants;
