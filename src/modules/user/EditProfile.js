import React,{ Component } from 'react';
import * as firebase from 'firebase';
import {hashHistory} from 'react-router'
import "../../App.css";
class EditProfile extends Component{
	constructor(){
		super();
	}
	render(){
		return(
			<div>
				Edit profile
			</div>
		)
	}
}
export default EditProfile;