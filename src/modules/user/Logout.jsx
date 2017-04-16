import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import * as firebase from 'firebase';
class Profile extends Component {
	submit(e) {
		firebase.auth().signOut().then(function() {
			alert('Successfully signed out');
		}).catch(function(error) {
			var errorMessage = error.message;
			alert(errorMessage);
			console.log(error);
		});
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

export default Profile;