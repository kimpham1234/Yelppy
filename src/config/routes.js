import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import '../index.css';
import Restaurants from '../modules/restaurant/Restaurants.js';
import NewRestaurant from '../modules/restaurant/NewRestaurant.js';
import NewUser from '../modules/user/NewUser.js';
import Layout from '../modules/home/layout.js';

import * as requireAuth from './requireAuth.js';

let routes = (
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <Route path='/restaurants' component={Restaurants}/>
            <Route path='/newUser' component={NewUser}/>
        </Route>
    </Router>
);

module.exports = routes;