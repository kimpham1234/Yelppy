import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'


class NewRestaurant extends Component{
	contextTypes: {
		router: React.PropTypes.object
	}

	submit(e){
		e.preventDefault();
		var restaurantListRef = firebase.database().ref('restaurants');
		var newRestaurant = restaurantListRef.push();
		newRestaurant.set({
		  name: this.refs.name.value,
          storenum: this.refs.storenum.value,
		  rating: this.refs.rating.value,
		  loc: this.refs.loc.value
		});

		//this.context.router.push('/restaurants');
		hashHistory.push('/');
	}

	render(){
		return(
			<div>
				<div>
			      <h4>Add more restaurant</h4>
			      <form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="name" placeholder="Restaurant Name"/>
                    <input type="number" ref="storenum" placeholder="Store number"/>
			        <input type="number" ref="rating" placeholder="Rating"/>
			        <input type="text" ref="loc" placeholder="Location"/>
			        <button type="submit">Submit</button>
			      </form>
			    </div>
			</div>
		)
	}

}

export default NewRestaurant;
