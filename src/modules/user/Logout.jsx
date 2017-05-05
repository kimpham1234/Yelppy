import React, { Component } from 'react';
import {hashHistory} from 'react-router';
// import * as firebase from 'firebase';
import { logout } from '../helpers/users-auth';
import { Button, Navbar, Nav, LinkContainer, NavItem } from 'react-bootstrap';
class Logout extends Component {
	constructor(props){
		super(props);
	}
	componentWillMount() {
		this.handleLogout();
	}
	handleLogout() {
		console.log("testing");
		logout();
		hashHistory.push('/');
	}
	render() {
		return (
			<div>
				Log out
			</div>
		)
	}
}

export default Logout;