import React, { Component } from 'react';
// import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { login, resetPassword } from '../helpers/users-auth';
import {passingToProfile} from './Profile'
import {hashHistory} from 'react-router';

class Login extends Component{
	// state = { loginMessage: null }
	
	submit(e){
		// var users = firebase.database().ref('users');
		var email = this.refs.email.value;
		var password = this.refs.password.value;
		var provider = new firebase.auth.FacebookAuthProvider();
		// console.log('email', email);
		// console.log('password', password);


		//sth wrong with input "first argument must be valid string"
		//hard code for testing 
		// var email = "pghkim94@gmail.com"
		// var password = "123456"

		// working code
		/*
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
*/
		firebase.auth().signInWithPopup(provider).then(function(result) {
		 // This gives you a Facebook Access Token.
		 	var token = result.credential.accessToken;
		 // The signed-in user info.
		 	var user = result.user;
			var userRef = firebase.database().ref('users');
			var that = this;

			//check if this is first sign in, if yes save new user to db
			userRef.orderByChild('email').equalTo(user.email).once('value', function(snapshot){
				var exist = (snapshot.val() !== null);

				if(!exist){
					var newUser = userRef.push();
					var time = Date();
					var firstAndLast = firebase.auth().currentUser.displayName.split(" ");

					newUser.set({
						timestamp: time,
						email: user.email,
						first: firstAndLast[0],
						last: firstAndLast[firstAndLast.length-1], //add new user attributes here - Kim
						numReviews: '0',
						pictures: [''],
						reviewed: [''],
						UID: newUser.key
					});
				}
			});
		});

		hashHistory.push('/');
		
		
		e.preventDefault();
		login(email, password);
		hashHistory.push('/');
		//passingToProfile(email, "", "");
		// console.log('email', email);
		// console.log('password', password);
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
					<button class="loginBtn loginBtn--facebook">Login with Facebook</button>
			    </form>
			</div>
			

				
		
		);
	}

}

export default Login;


