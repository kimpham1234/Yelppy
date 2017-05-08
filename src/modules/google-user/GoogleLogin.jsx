import React, { Component } from 'react';
import * as firebase from 'firebase';
import "../../App.css";
import {hashHistory} from 'react-router';
import { Form, FormGroup, Col, Button } from 'react-bootstrap';
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
			
			var userRef = firebase.database().ref('users');
			var that = this;

			//check if this is first sign in, if yes save new user to db
			userRef.orderByChild('email').equalTo(user.email).once('value', function(snapshot){
				var exist = (snapshot.val() !== null);

				if(!exist){
					var authId = firebase.auth().currentUser.uid;
					var newUser = userRef.child(authId);
					var time = Date();
					var firstAndLast = firebase.auth().currentUser.displayName.split(" ");

					newUser.set({
						timestamp: time,
						email: user.email,
						first: firstAndLast[0],
						last: firstAndLast[firstAndLast.length-1], //add new user attributes here - Kim
						numReviews: '0',
						pictures: [''],
						reviewed: [''],
						AuthId: authId
					});
				}
			});
		});

		hashHistory.push('/');
	}

	render() {
		return (
			<div>
				<Form horizontal onSubmit={this.submit.bind(this)}>
					<FormGroup>
						<Col smOffset={2} sm={10}>
				        	<Button type="submit">Google Login</Button>
				        </Col>
				    </FormGroup>
			    </Form>
			</div>
		);
	}

}

export default GoogleLogin;
