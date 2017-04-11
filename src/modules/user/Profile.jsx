import React, { Component } from 'react';
import * as firebase from 'firebase';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Profile extends Component {
	constructor(){
		super();
		this.state = {currentUser: ""};
	}
	componentWillMount() {
		this.currentUser = firebase.auth().currentUser;
	}

	render() {
		return (
			<div>
				<li>First name: Kim</li>
			    <li>Last name: Pham</li>
				<li>Email: {this.currentUser.email}</li>
			</div>
		)
	}
}

export default Profile;