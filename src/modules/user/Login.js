import React, { Component } from 'react';
// import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { login, resetPassword } from '../helpers/users-auth';
import {passingToProfile} from './Profile'
import {hashHistory} from 'react-router';
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Checkbox} from 'react-bootstrap';
import GoogleLogin from '../google-user/GoogleLogin.jsx'
class Login extends Component{
	// state = { loginMessage: null }
	
	submit(e){
		// var users = firebase.database().ref('users');
		var email = this.email.value;
		var password = this.password.value;
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
		hashHistory.push('/');
		*/
		
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
				<Form horizontal onSubmit={this.submit.bind(this)}>
				    <FormGroup controlId="formHorizontalEmail">
				      <Col componentClass={ControlLabel} sm={2}>
				        Email
				      </Col>
				      <Col sm={10}>
				        <FormControl type="email" placeholder="Email" inputRef={ref => { this.email = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup controlId="formHorizontalPassword">
				      <Col componentClass={ControlLabel} sm={2}>
				        Password
				      </Col>
				      <Col sm={10}>
				        <FormControl type="password" placeholder="Password" inputRef={ref => { this.password = ref; }}/>
				      </Col>
				    </FormGroup>
				    <FormGroup>
				      <Col smOffset={2} sm={10}>
				        <Checkbox>Remember me</Checkbox>
				      </Col>
				    </FormGroup>
				    <FormGroup>
				      <Col smOffset={2} sm={10}>
				        <Button type="submit">
				          Sign in
				        </Button>
				      </Col>
				    </FormGroup>
				</Form>
				<GoogleLogin />
			{/*
				<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Your email address"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
			        <button type="submit">Submit</button>
			    </form>
			*/}
			</div>
		);
	}

}

export default Login;


