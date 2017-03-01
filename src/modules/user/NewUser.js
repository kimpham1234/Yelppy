import React, { Component } from 'react';
import * as firebase from 'firebase';

class NewUser extends Component{

	submit(e){
		e.preventDefault();
		var email = this.refs.email.value();
		var password = this.refs.password.value();

		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
 			 var errorCode = error.code;
 			 var errorMessage = error.message;
		});
	}

	render(){
		return (
			<div>
				<h3>Create A New Account</h3>
				<form onSubmit={this.submit.bind(this) }>
				<table>
					<tbody>
					<tr>
						<td>Email</td>
						<td><input type="text" ref="email" placeholder="Your email address"/></td>
					</tr>
					<tr>
						<td>Password</td>
						<td><input type="password" ref="password"/></td>
					</tr>
					<tr><button type="submit">Submit</button></tr>
					</tbody>
				</table>
				</form>
			</div>
		);
	}
	
}

export default NewUser;