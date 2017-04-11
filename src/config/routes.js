// routing
import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import '../index.css';
import Restaurants from '../modules/restaurant/Restaurants.js';
//added by Kim
import NewRestaurant from '../modules/restaurant/NewRestaurant.js';
import NewUser from '../modules/user/NewUser.js';
import Reviews from '../modules/review/Reviews.js';
import NewReview from '../modules/review/NewReview';
import Login from '../modules/user/Login.js';
import Edit from '../modules/review/Edit.js';
//end by Kim

import Layout from '../modules/home/layout.js';
import RestaurantDetail from '../modules/restaurant/RestaurantDetail.js';
import * as requireAuth from './requireAuth.js';

let routes = (
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <Route path='/restaurants' component={Restaurants}/>
            <Route path='/restaurants/new' component={NewRestaurant}/>
            <Route path="/restaurants/:name" component={RestaurantDetail}/>
            <Route path='/restaurants/:name/:storenum' component={RestaurantDetail}/>
            <Route path='/newUser' component={NewUser}/>
            <Route path='/reviews/edit/:id' component={Edit}/>
            <Route path='/login' component={Login}/>
            <Route path='/reviews' component={Reviews}/>
            <Route path='/reviews/new/:id' component={NewReview}/>
        </Route>
    </Router>
);

module.exports = routes;
