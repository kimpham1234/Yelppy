import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import * as firebase from 'firebase';
import { resetPassword } from '../helpers/users-auth';
import { Link } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Form, Col, Button} from 'react-bootstrap';
class ResetPassword extends Component {
submit(e)
{
	e.preventDefault();
	resetPassword(firebase.auth().currentUser.email);
	hashHistory.push('/');
}
	render(){
		return (
			<div>
				<Form horizontal onSubmit={this.submit.bind(this)}>
					<p className="App-intro"><strong>Are you sure you want to reset your password?</strong></p>
					    <FormGroup>
					    	<Col smOffset={0} sm={10}>
					        	<Button type="submit">
					        		Reset
					        	</Button>
					    	</Col>
					    </FormGroup>
				</Form>
			</div>
		);
	}
}
export default ResetPassword;


