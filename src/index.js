import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from './modules/App';
import NewUser from './modules/user/NewUser'
import './index.css';
import * as firebase from 'firebase';


var config = {
    apiKey: "AIzaSyAOKXV0Wnc-cmBhsMb2U3zZM2q9Z1FRqfE",
    authDomain: "yelppy-80fb2.firebaseapp.com",
    databaseURL: "https://yelppy-80fb2.firebaseio.com",
    storageBucket: "yelppy-80fb2.appspot.com",
    messagingSenderId: "235665157636"
};
firebase.initializeApp(config);


ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App}/>
			<Route path='/newUser' component={NewUser}/>
	</Router>
  	),
  document.getElementById('root')
);
