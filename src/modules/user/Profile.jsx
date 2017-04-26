import React, { Component } from 'react';
import * as firebase from 'firebase';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
var first = '-1';
var last = '-1';

export function passingToProfile(email, aFirst, aLast) {
	console.log('hello testing');
	console.log('first', aFirst);
	console.log('last', aLast);
	first = aFirst;
	last = aLast;
	console.log('last', last);
	console.log('first', first);
}

export default class Profile extends Component {
	constructor(){
		super();
		this.state = {first: String, last: String}
	}
	componentWillMount() {
		this.currentUser = firebase.auth().currentUser;
		this.currentUserRef = firebase.database().ref('users');
		console.log('currentUser', this.currentUser);
		var displayName = this.currentUser.displayName;
		if (displayName == null)
		{
			//console.log("testing");
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
		//console.log('currentUser', this.currentUser);
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