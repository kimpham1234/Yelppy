import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
import { FormGroup, ControlLabel, FormControl, Form, Col, Button, Alert} from 'react-bootstrap';
class EditProfile extends Component{
	constructor(props) {
		super(props);
	}
	submit(e) {
		e.preventDefault();
		console.log('not implemented yet');
		hashHistory.push('/profile');
	}
	render() {
		return(
			<div>
				<p className="App-intro"><strong>Edit your profile</strong></p>
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
				    <FormGroup>
				      <Col smOffset={2} sm={10}>
				        <Button type="submit">
				          Save
				        </Button>
				      </Col>
				    </FormGroup>
				</Form>
			</div>
		)
	}
}
export default EditProfile;