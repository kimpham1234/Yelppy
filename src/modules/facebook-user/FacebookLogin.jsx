import React, { Component } from 'react';
import * as firebase from 'firebase';
import "../../App.css";
import {hashHistory} from 'react-router';

class FacebookLogin extends Component{
    submit(e){

        var provider = new firebase.auth.FacebookAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
		 // This gives you a Facebook Access Token.
		 	var token = result.credential.accessToken;
		 // The signed-in user info.
		 	var user = result.user;
		});
		hashHistory.push('/');
    }

    render(){
        return(
            <div>
				<form onSubmit={this.submit.bind(this)}>
				{/*
			        <input type="text" ref="email" placeholder="Your Facebook email"/><br></br>
                    <input type="password" ref="password" placeholder="Your password"/><br></br>
                */}
			        <button type="submit">Facebook Login</button>
			    </form>
			</div>
        );
    }
}

export default FacebookLogin;