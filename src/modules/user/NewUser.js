import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as firebase from 'firebase';
import "../../App.css";
import { auth } from '../helpers/users-auth';
import {hashHistory} from 'react-router';
import {passingToProfile} from './Profile'

class NewUser extends Component{
	
	constructor(){
		super();
		this.state = {user:[]};
	}

	submit(e){
		e.preventDefault();
		
		var userEmail = this.refs.email.value;
		var password = this.refs.password.value;
		var first = this.refs.first.value;
		var last = this.refs.last.value;
		var that = this;
	
		auth(userEmail, password, first, last);
		hashHistory.push('/');
	}

	render(){
		return (
			<div>
				<form onSubmit={this.submit.bind(this)}>
			        <input type="text" ref="email" placeholder="Your email address"/><br></br>
			        <input type="text" ref="first" placeholder="Your first name"/><br></br>
			        <input type="text" ref="last" placeholder="Your last name"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
			        <button type="submit">Submit</button>
			    </form>
			</div>
		);
	}

}
export default NewUser;


