import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import { buttonsInstance, Button } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { Table, Thead, Th, Tr, Td } from 'reactable';

class Restaurants extends Component{


	constructor(props){
		super(props);
		this.state = {restaurants:[]};
	}

    componentWillReceiveProps(nextProps){
        this.restaurantListRef = firebase.database().ref('business');
		let that = this;
		let list = [];
		if( this.props != nextProps ) {
			setTimeout(function() {
                that.setState({restaurants: []}, function () {
                    //listen for the value of restaurant once when first load
                    this.restaurantListRef.once('value', function (snapshot) {
                        snapshot.forEach(function (childSnapshot) {
                            //console.log(that.props);
                            //that.state.restaurants.push(childSnapshot.val());
                            //that.setState({restaurants: that.state.restaurants})
                            if (nextProps.idArray) {
                                if (nextProps.idArray.indexOf(childSnapshot.val().id) !== -1) {
                                    list.push(childSnapshot.val())
                                }
                            } else {
                                list.push(childSnapshot.val());
                            }

                        });
                        that.setState({restaurants: list});
                    });
                });
            }, 2000);
        }

    }

	componentWillMount(){
		this.restaurantListRef = firebase.database().ref('business');
		var that = this;
		//console.log(this);

		var list = [];

		//listen for the value of restaurant once when first load
		this.restaurantListRef.once('value', function(snapshot) {
		  snapshot.forEach(function(childSnapshot) {
		  	//console.log(that.props);
		    //that.state.restaurants.push(childSnapshot.val());
		    //that.setState({restaurants: that.state.restaurants})
			if( that.props.idArray ){
				if( that.props.idArray.indexOf(childSnapshot.val().id) !== -1 ){
					list.push(childSnapshot.val())
				}
			}else{
                list.push(childSnapshot.val());
			}

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
				<Link to='restaurants/new'><Button>Create a new restaurant</Button></Link>
				<p className="App-intro"><strong>List of restaurants</strong></p>
				<Table className="rtable" id="table" sortable={true} defaultSort={{column:"rating", direction:"desc"}} itemsPerPage={this.props.idArray ? 3 : 20} pageButtonLimit={15} previousPageLabel="Previous " nextPageLabel=" Next" filterable={['info']} filterPlaceholder="Filter by name or category">
					<Thead>
                        <Th column="avatar">Avatar</Th>
                        <Th column="info">Info</Th>
                        <Th column="rating">Rating</Th>
				    </Thead>
			    	{this.state.restaurants.map((restaurant, index) => (
                        <Tr key={index}>
                            <Td column="avatar" value={restaurant.avatar} width='205px' height='205px'>
                                <img src={restaurant.avatar} alt={'Avatar for '+restaurant.name} height="200" width="200"></img>
                            </Td>
                            <Td column="info" value={restaurant.name+' '+renderList(restaurant.categories, ' ')} width='100%' data={
                                <table height='100%'><tbody>
                                    <tr><td><Link to={'/restaurants/'+restaurant.id}>{restaurant.name}</Link></td></tr>
                                    {restaurant.location.display_address.map((line, index) => (<tr><td>{line}</td></tr>))}
                                    <tr><td>Phone: {restaurant.phone ? restaurant.phone : "not available"}</td></tr>
                                    <tr><td>Price: {restaurant.price ? restaurant.price : "not available"}</td></tr>
                                    <tr><td>
                                        Categories: {renderList(restaurant.categories, ', ')}
                                    </td></tr>
                                    <tr height='100%'/>
                                </tbody></table>
                            }/>
                            <Td column="rating" value={parseFloat(restaurant.rating)} data={
                                <table height='100%' width='90px'><tbody>
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
                                    <tr height='100%'/>
                                </tbody></table>
                            }/>
                        </Tr>
                    ))}
				    </Table>
		    </div>
	)}
}

export function renderList(input, spacing) {
    if (!input) {
        return 'none';
    } else if (typeof(input) === 'string') {
        return input.split('_').join(' ');
    } else {
        var text = '';
        for (var index = 0; index < input.length; index ++)
            text += (index ? spacing : '')+renderList(input[index], spacing);
        return text;
    }
}

export default Restaurants;
