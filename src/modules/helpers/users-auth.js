import * as firebase from 'firebase';
import { ref, firebaseAuth } from '../../index';
import {hashHistory} from 'react-router';

export function auth (email, password, first, last) {
	return firebaseAuth.createUserWithEmailAndPassword(email, password)
		.then(function(user) {
			var authId = firebase.auth().currentUser.uid;
			var newUser = ref.child('users').child(authId);
			var time = Date();
			newUser.set({
				timestamp: time,
				email: email,
				first: first,
				last: last, //add new user attributes here - Kim
				numReviews: '0',
				pictures: [''],
				reviewed: [''],
				AuthID: authId
			});
			alert('Your account is ready.');
		}, function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/weak-password') {
				alert('The password is too weak.');
			} else {
				alert(errorMessage);
			}
		});
}
export function login (email, password) {
	return firebaseAuth.signInWithEmailAndPassword(email, password).then(function() {
        hashHistory.push('/');
		alert('Successfully signed in');
	}).catch(function(error) {
		// Handle Errors here.
		if (error.code === 'auth/wrong-password') {
			alert('Wrong password.');
		} else {
			alert(error.message);
		}
	});
}
export function resetPassword (email) {
	return firebaseAuth.sendPasswordResetEmail(email).then(function() {
		// Email sent
		alert('Password reset email sent');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode === 'auth/user-not-found') {
          alert(errorMessage);
        }
        else
        {
        	alert('Email address not found');
        }
      });
}
export function logout () {
	return firebaseAuth.signOut().then(function() {
		alert('Successfully signed out')
	}).catch((error) => {
		var errorMessage = error.message;
		alert(errorMessage);
	});
}
