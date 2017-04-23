import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import { Table, buttonsInstance } from 'react-bootstrap';

class Restaurants extends Component{

    constructor(){
        super();
        this.state = {restaurants:[]};
    }

    componentWillMount(){
        console.log("Restaurants mounting");
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
        var counter = 1;
        return(
			<div>
				<h1>List of restaurants</h1>
				<Link to='restaurants/new'>New</Link>
				<Table striped condensed hover responsive>
					<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Rating</th>
						<th>Address</th>
					</tr>
					</thead>
					<tbody>
                    {this.state.restaurants.map((restaurant, index) => (
						<tr key={index}>
							<td>
								<img src={restaurant.avatar} alt={'Avatar for '+restaurant.name} height="32"></img>
							</td>
							<td>
								<Link to={'/restaurants/'+restaurant.id}>{restaurant.name}</Link>
							</td>
							<td>
                                { (restaurant.rating == "") ? 0 : restaurant.rating }/5
							</td>
							<td>
                                { restaurant.location.display_address[0] + ', '+restaurant.location.display_address[1] }
							</td>
						</tr>

                    ))}
					</tbody>
				</Table>
			</div>
        )}
}

export default Restaurants;
