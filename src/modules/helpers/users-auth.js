import * as firebase from 'firebase';
import { ref, firebaseAuth } from '../../index';


export function saveUser (user) {
	return ref.child('users/${user.uid}/info')
		.set({
			email: user.email,
			uid: user.uid
		})
		.then(() => user)
}
export function auth (email, password) {
	return firebaseAuth().createUserWithEmailAndPassword(email, password)
		.then(saveUser);
}
export function login (email, password) {
	console.log('i m in login/users-auth');
	console.log('email', email);
	console.log('password', password);

	return firebaseAuth.signInWithEmailAndPassword(email, password).then(function() {
		alert('Successfully signed in')
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		} else {
			alert(errorMessage);
		}
	});
}
export function resetPassword (email) {
	return firebaseAuth.sendPasswordResetEmail(email);
}
export function logout () {
	console.log('i m in logout/users-auth');
	return firebaseAuth.signOut().then(function() {
		alert('Successfully signed out')
	}).catch((error) => {
		var errorMessage = error.message;
		alert(errorMessage);
	});
}