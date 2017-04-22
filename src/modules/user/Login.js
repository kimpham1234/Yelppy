import React, { Component } from 'react';
// import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { login, resetPassword } from '../helpers/users-auth';

import {hashHistory} from 'react-router';

class Login extends Component{
	// state = { loginMessage: null }
	
	submit(e){
		// var users = firebase.database().ref('users');
		var email = this.refs.email.value;
		var password = this.refs.password.value;
		// console.log('email', email);
		// console.log('password', password);


		//sth wrong with input "first argument must be valid string"
		//hard code for testing 
		// var email = "pghkim94@gmail.com"
		// var password = "123456"

		// working code
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
		});
		hashHistory.push('/');
		

		// e.preventDefault();
		// login(this.refs.email.value, this.refs.password.value);
		// hashHistory.push('/');
		// console.log('email', this.refs.email.value);
		// console.log('password', this.refs.password.value);
	}

	render(){
		return (
			<div>
				{/* 
				<form className="col-md-2" onSubmit={this.submit.bind(this) }>
					<FormGroup>
						<ControlLabel>Log In</ControlLabel>
						<FormControl label="E-mail address" type="text" ref="email" placeholder="Your email address" />
						<FormControl label="Password" type="password" ref="password" />
						<FormControl className="btn btn-primary" type="submit" />
					</FormGroup>
				</form>
				*/}

				<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Your email address"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
			        <button type="submit">Submit</button>
			    </form>
			</div>
			

				
		
		);
	}

}

export default Login;


