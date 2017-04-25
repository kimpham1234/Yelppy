import React, { Component } from 'react';
import * as firebase from 'firebase';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
var first = '';
var last = '';

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
		this.state = {currentUser: String, first: String, last: String};
	}
	componentWillMount() {
		this.currentUser = firebase.auth().currentUser;
		console.log('first', first);
		console.log('last', last);
		this.first=first;
		this.last=last;
	}

	render() {
		return (
			<div>
				{/*
				<li>First name: {this.currentUser.first}</li>
			    <li>Last name: {this.currentUser.last}</li>
			    */}
			    <li>First name: {this.first}</li>
			    <li>Last name: {this.last}</li>
				<li>Email: {this.currentUser.email}</li>
			</div>
		)
	}

	
}