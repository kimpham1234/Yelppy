import React, { Component } from 'react';
import {hashHistory} from 'react-router';
// import * as firebase from 'firebase';
import { resetpassword } from '../helpers/users-auth';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
class ResetPassword extends Component {

submit(e)
{
		var email = this.refs.email.value;
		var newpassword = this.refs.newpassword.value; 
		e.preventDefault();
		resetpassword(email, newpassword);
		hashHistory.push('/');


}

	render(){
		return (

			<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Enter Email Address"/><br></br>
			         <input type="password" ref="newpassword" placeholder="Enter New Password"/><br></br>
			     	 <li><Link to="/login">Reset Password</Link></li>
			  </form>
		
		);
	}

}

export default ResetPassword;


