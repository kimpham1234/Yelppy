import React, { Component } from 'react';
import {hashHistory} from 'react-router';
// import * as firebase from 'firebase';
import { logout } from '../helpers/users-auth';
class Logout extends Component {
	submit(e) {
		/* working code
		firebase.auth().signOut().then(function() {
			alert('Successfully signed out');
		}).catch(function(error) {
			var errorMessage = error.message;
			alert(errorMessage);
			console.log(error);
		});
		hashHistory.push('/');
		*/
		e.preventDefault();
		logout();
		hashHistory.push('/');

	}
	render() {
		return (
			<div>
				<form onSubmit={this.submit.bind(this)}>
			        <button type="submit">Sign out</button>
			    </form>
			</div>
		)
	}
}

export default Logout;