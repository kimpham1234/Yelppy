import React, { Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router';


class NewUser extends Component{
	//contextTypes: {
	//	router: React.PropTypes.object
	//}

	//create the component
	constructor(){
		super();
		this.state = {user:[]}
	}

	submit(e){
		e.preventDefault();
		var userEmail = this.refs.email.value;
		var password = this.refs.password.value;
		var that = this;


		firebase.auth().createUserWithEmailAndPassword(userEmail, password).catch(function(error) {
			var userListRef = firebase.database().ref('users');
			var newUser = userListRef.push();
			
			newUser.set({
				email: userEmail
			});
			
			//that.context.router.push('/');
			hashHistory.push('/');
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
						</tbody>
					</table>

					<button type="submit">Submit</button>
				</form>
			</div>
		);
	}

}
export default NewUser;