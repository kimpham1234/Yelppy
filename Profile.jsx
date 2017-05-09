import React, { Component } from 'react';
import * as firebase from 'firebase';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
var first = '-1';
var last = '-1';

export function passingToProfile(email, aFirst, aLast) {
	first = aFirst;
	last = aLast;
}

export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {first: String, last: String}
	}
	componentWillMount() {
		this.currentUser = firebase.auth().currentUser;
		this.currentUserRef = firebase.database().ref('users');
		var displayName = this.currentUser.displayName;
		if (displayName == null)
		{
			this.currentUserRef.orderByChild('email').equalTo(this.currentUser.email)
										.on('child_added', function(snapshot) {
              	var val = snapshot.val();
              	this.setState({first: val.first});
              	this.setState({last: val.last});
			}.bind(this));
		}
		else
		{
			var firstAndLast = this.currentUser.displayName.split(" ");
			this.setState({first: firstAndLast[0]});
			this.setState({last: firstAndLast[firstAndLast.length-1]});	
		}
	}

	render() {
		return (
			<div>
			    <li>First name: {this.state.first}</li>
			    <li>Last name: {this.state.last}</li>
				<li>Email: {this.currentUser.email}</li>
			</div>
		)
	}

	
}