import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Alert} from 'react-bootstrap';

class NewRestaurant extends Component{
	contextTypes: {
		router: React.PropTypes.object
	}

	submit(e){
		e.preventDefault();
		var restaurantListRef = firebase.database().ref('restaurants');
		var newRestaurant = restaurantListRef.push();
		var time = Date();
		newRestaurant.set({
			timestamp: time,
		 	name: this.name.value,
         	storenum: this.storenum.value,
		  	rating: this.rating.value,
		  	loc: this.loc.value,
		  	images: [""]
		});

		//this.context.router.push('/restaurants');
		hashHistory.push('/');
	}

	render(){
		return(
			<div>
				<Form horizontal onSubmit={this.submit.bind(this)}>
			      	<p className="App-intro"><strong>Add a new restaurant</strong></p>
			      	<FormGroup controlId="formControlsText">
			      		<Col componentClass={ControlLabel} sm={2}>
				        	Restaurant name
				      	</Col>
				      	<Col sm={10}>
				        	<FormControl type="text" placeholder="Restaurant name" inputRef={ref => { this.name = ref; }}/>
				      	</Col>
				    </FormGroup>
				    <FormGroup controlId="formControlsText">
			      		<Col componentClass={ControlLabel} sm={2}>
				        	Store number
				      	</Col>
				      	<Col sm={10}>
				        	<FormControl type="number" placeholder="Store number" inputRef={ref => { this.storenum = ref; }}/>
				      	</Col>
				    </FormGroup>
				    <FormGroup controlId="formControlsText">
			      		<Col componentClass={ControlLabel} sm={2}>
				        	Rating
				      	</Col>
				      	<Col sm={10}>
				        	<FormControl type="number" placeholder="Rating" inputRef={ref => { this.rating = ref; }}/>
				      	</Col>
				    </FormGroup>
				    <FormGroup controlId="formControlsText">
			      		<Col componentClass={ControlLabel} sm={2}>
				        	Location
				      	</Col>
				      	<Col sm={10}>
				        	<FormControl type="text" placeholder="Location" inputRef={ref => { this.loc = ref; }}/>
				      	</Col>
				    </FormGroup>
				    <FormGroup>
				      	<Col smOffset={2} sm={10}>
				        	<Button type="submit">
				          		Submit
				        	</Button>
				      	</Col>
				    </FormGroup>
		      </Form>
			</div>
		)
	}

}

export default NewRestaurant;
