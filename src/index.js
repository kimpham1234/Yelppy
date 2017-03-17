import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as firebase from 'firebase';

var routes = require('./config/routes.js');

var config = {
    apiKey: "AIzaSyAOKXV0Wnc-cmBhsMb2U3zZM2q9Z1FRqfE",
    authDomain: "yelppy-80fb2.firebaseapp.com",
    databaseURL: "https://yelppy-80fb2.firebaseio.com",
    storageBucket: "yelppy-80fb2.appspot.com",
    messagingSenderId: "235665157636"
};
firebase.initializeApp(config);


ReactDOM.render(routes, document.getElementById('root'));

