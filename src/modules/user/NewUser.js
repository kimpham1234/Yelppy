import React, { Component } from 'react';
import * as firebase from 'firebase';
import "../../App.css";
import { auth } from '../helpers/users-auth';
import {hashHistory} from 'react-router';
import {passingToProfile} from './Profile';
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Alert} from 'react-bootstrap';
class NewUser extends Component{
	
	constructor(){
		super();
		this.state = {user:[]};
	}

	submit(e){
		e.preventDefault();
		var userEmail = this.email.value;
		var password1 = this.password1.value;
		var password2 = this.password2.value;
		var first = this.first.value;
		var last = this.last.value;
		var that = this;
		if(password1===password2)
		{
			console.log('password1', password1);
			console.log('password2', password2);
			auth(userEmail, password1, first, last);
			hashHistory.push('/');
		}
		else
		{
			alert('Error! Your password is not confirmed corrrectly. Please try again');
		}
		
	}

	render(){
		return (
			<div>
				{/*
				<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Your email address"/><br></br>
			        <input type="text" ref="first" placeholder="Your first name"/><br></br>
			        <input type="text" ref="last" placeholder="Your last name"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
			        <button type="submit">Submit</button>
			    </form>
			    */}
			    <Form horizontal onSubmit={this.submit.bind(this)}>
				    <FormGroup controlId="formHorizontalEmail">
				      <Col componentClass={ControlLabel} sm={2}>
				        Email
				      </Col>
				      <Col sm={10}>
				        <FormControl type="email" placeholder="Email" inputRef={ref => { this.email = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup controlId="formControlsText">
				      <Col componentClass={ControlLabel} sm={2}>
				        First name
				      </Col>
				      <Col sm={10}>
				        <FormControl type="text" placeholder="First name" inputRef={ref => { this.first = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup controlId="formControlsText">
				      <Col componentClass={ControlLabel} sm={2}>
				        Last Name
				      </Col>
				      <Col sm={10}>
				        <FormControl type="text" placeholder="Last name" inputRef={ref => { this.last = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup controlId="formHorizontalPassword">
				      <Col componentClass={ControlLabel} sm={2}>
				        Create a password
				      </Col>
				      <Col sm={10}>
				        <FormControl type="password" placeholder="Password" inputRef={ref => { this.password1 = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup controlId="formHorizontalPassword">
				      <Col componentClass={ControlLabel} sm={2}>
				        Confirm your password
				      </Col>
				      <Col sm={10}>
				        <FormControl type="password" placeholder="Password" inputRef={ref => { this.password2 = ref; }}/>
				      </Col>
				    </FormGroup>

				    <FormGroup>
				      <Col smOffset={2} sm={10}>
				        <Button type="submit">
				          Sign up
				        </Button>
				      </Col>
				    </FormGroup>
				</Form>
			</div>
		);
	}

}
export default NewUser;


