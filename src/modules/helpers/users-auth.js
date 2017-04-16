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
	return firebaseAuth().signInWithEmailAndPassword(email, password);
}
export function resetPassword (email) {
	return firebaseAuth().sendPasswordResetEmail(email);
}
export function logout () {
	return firebase.Auth().signOut();
}