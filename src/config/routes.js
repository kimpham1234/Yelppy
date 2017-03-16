import React from 'react';
//import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from '../modules/App';
import Restaurants from '../modules/restaurant/Restaurants';
import NewRestaurant from '../modules/restaurant/NewRestaurant';
import NewUser from '../modules/user/NewUser';
import '../index.css';

import * as requireAuth from './requireAuth.js';

var routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path='/restaurants' component={Restaurants}/>
            <Route path='/restaurants/new' component={NewRestaurant}/>
            <Route path='/newUser' component={NewUser}/>
        </Route>
    </Router>
);

module.exports = routes;