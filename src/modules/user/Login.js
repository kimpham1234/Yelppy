import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import {hashHistory} from 'react-router';


class Login extends Component{

	submit(e){
		//**var email = this.refs.email.value;
		//**var password = this.refs.password.value;

		//sth wrong with input "first argument must be valid string"
		//hard code for testing 
		var email = "pghkim94@gmail.com"
		var password = "123456"
		var provider = new firebase.auth.FacebookAuthProvider();

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

		firebase.auth().signInWithPopup(provider).then(function(result) {
		 // This gives you a Facebook Access Token.
		 	var token = result.credential.accessToken;
		 // The signed-in user info.
		 	var user = result.user;
		});

		hashHistory.push('/');
	}

	render(){
		return (
			<div>
				<form className="col-md-2" onSubmit={this.submit.bind(this) }>
					<FormGroup>
						<ControlLabel>Log In</ControlLabel>
						<FormControl label="E-mail address" type="text" ref="email" placeholder="Your email address" />
						<FormControl label="Password" type="password" ref="password" />
						<FormControl className="btn btn-primary" type="submit" />
						Or Log In with 
						<button type="submit">Facebook Login</button>
					</FormGroup>
				</form>
			</div>
			
		);
	}

}

export default Login;


