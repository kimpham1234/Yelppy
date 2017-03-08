import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory} from 'react-router'
import App from './modules/App';
import Restaurants from './modules/restaurant/Restaurants';
import NewRestaurant from './modules/restaurant/NewRestaurant';
import NewUser from './modules/user/NewUser';
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
        <Route path="/" component={App}>
            <Route path='/restaurants' component={Restaurants}/>
            <Route path='/restaurants/new' component={NewRestaurant}/><Route path='/newUser' component={NewUser}/>
        </Route>
    </Router>),
  document.getElementById('root')
);

