import React, { Component } from 'react';
import firebase from 'firebase';

class Profile extends Component {

	logOut() {
    firebase.auth().signOut().then(function() {
      this.setState({user: null});
    }.bind(this));
	}

	render() {
		return (
			<div>
				 <button onClick={this.logOut.bind(this)}>Log Out</button>
			</div>
		)
	}
}

export default Profile;