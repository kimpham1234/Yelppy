import React, { Component } from 'react';
import * as firebase from 'firebase';
import "../../App.css";
import {hashHistory} from 'react-router';

class GoogleLogin extends Component{
	submit(e){
		// Using a popup.
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');

		firebase.auth().signInWithPopup(provider).then(function(result) {
		 // This gives you a Google Access Token.
		 	var token = result.credential.accessToken;
		 // The signed-in user info.
		 	var user = result.user;
		});
		hashHistory.push('/');
		// `googleUser` from the onsuccess Google Sign In callback.
		// var credential = firebase.auth.GoogleAuthProvider.credential(
		//               googleUser.getAuthResponse().id_token);
		// firebase.auth().signInWithCredential(credential);
	}

	render() {
		return (
			<div>
				<form onSubmit={this.submit.bind(this)}>
				{/*
			        <input type="text" ref="email" placeholder="Your google email"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
                */}
			        <button type="submit">Google Login</button>
			    </form>
			</div>
		);
	}

}

export default GoogleLogin;


