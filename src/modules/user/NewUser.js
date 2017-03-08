import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";

import {hashHistory} from 'react-router';


class NewUser extends Component{
	//contextTypes: {
	//	router: React.PropTypes.object
	//}

	//create the component
	constructor(){
		super();
		this.state = {user:[]}
	}

	submit(e){
		e.preventDefault();
		var userEmail = this.refs.email.value;
		var password = this.refs.password.value;
		var that = this;


		firebase.auth().createUserWithEmailAndPassword(userEmail, password).catch(function(error) {
			var userListRef = firebase.database().ref('users');
			var newUser = userListRef.push();
			
			newUser.set({
				email: userEmail
			});
			
			//that.context.router.push('/');
			hashHistory.push('/');
		});
	}

	render(){
		return (
			<div>
				<form className="col-md-2" onSubmit={this.submit.bind(this) }>
					<FormGroup>
						<ControlLabel>Create A New Account</ControlLabel>
						<FormControl label="E-mail address" type="text" ref="email" placeholder="Your email address" />
						<FormControl label="Password" type="password" ref="password" />
						<FormControl className="btn btn-primary" type="submit" />
					</FormGroup>

				</form>
			</div>
		);
	}

}
export default NewUser;