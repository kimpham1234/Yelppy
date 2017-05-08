import React, { Component } from 'react';
// import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { login, resetPassword } from '../helpers/users-auth';
import {hashHistory} from 'react-router';
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Checkbox} from 'react-bootstrap';
import GoogleLogin from '../google-user/GoogleLogin.jsx';
class Login extends Component{
	submit(e){
		var email = this.email.value;
		var password = this.password.value;
		e.preventDefault();
        login(email, password);
        document.getElementById('loginForm').reset();
    }
	render(){
		return (
			<div>
				<Form id='loginForm' horizontal onSubmit={this.submit.bind(this)}>
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
			</div>
		);
	}
}
export default Login;
