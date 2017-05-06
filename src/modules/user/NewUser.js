import React, { Component } from 'react';
import * as firebase from 'firebase';
import "../../App.css";
import { auth } from '../helpers/users-auth';
import {hashHistory} from 'react-router';
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Alert} from 'react-bootstrap';
class NewUser extends Component{
	constructor(props){
		super(props);
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
		if(first!=="" && last!=="" && password1!=="" && password2!=="" && userEmail!=="")
		{
			if(password1===password2){
				auth(userEmail, password1, first, last);
				hashHistory.push('/');
			}
			else
			{
				alert('Error! Your password is not confirmed corrrectly. Please try again');
			}
		}
		else if(first==="" || last==="" || password1 === "" || password2 === "" || userEmail === "")
		{
			alert('Error! Inputs cannot be empty');
		}
		else
		{
			alert('Sorry. Error with input');
		}
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


