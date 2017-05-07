import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { auth } from '../helpers/users-auth';
import {hashHistory} from 'react-router';
import {passingToProfile} from './Profile'

class NewUser extends Component{
	//contextTypes: {
	//	router: React.PropTypes.object
	//}
	constructor(){
		super();
		this.state = {user:[]};
	}

	submit(e){
		e.preventDefault();
		
		var userEmail = this.refs.email.value;
		var password = this.refs.password.value;
		var first = this.refs.first.value;
		var last = this.refs.last.value;
		var that = this;
		/*
		// working code
		firebase.auth().createUserWithEmailAndPassword(userEmail, password).catch(function(error) {
			var userListRef = firebase.database().ref('users');
			var newUser = userListRef.push();
			
			newUser.set({
				email: userEmail
			});
			//that.context.router.push('/');
		});
		hashHistory.push('/');
		*/
		auth(userEmail, password, first, last);
		hashHistory.push('/');
		passingToProfile(userEmail, first, last);
	}

	render(){
		return (
			<div>
				{/* 
				<form className="col-md-2" onSubmit={this.submit.bind(this) }>
					<FormGroup>
						<ControlLabel>Create A New Account</ControlLabel>
						<FormControl label="E-mail address" type="text" ref="email" placeholder="Your email address" />
						<FormControl label="Password" type="password" ref="password" />
						<FormControl className="btn btn-primary" type="submit" />
					</FormGroup>

				</form>
				*/}

				<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Your email address"/><br></br>
			        <input type="text" ref="first" placeholder="Your first name"/><br></br>
			        <input type="text" ref="last" placeholder="Your last name"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
			        <button type="submit">Submit</button>
			    </form>
			</div>
		);
	}

}
export default NewUser;

