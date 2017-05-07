import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import { logout } from '../helpers/users-auth';
class Logout extends Component {
	componentWillMount() {
		this.handleLogout();
	}
	handleLogout() {
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