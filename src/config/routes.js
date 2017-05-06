// routing
import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import '../index.css';
import Restaurants from '../modules/restaurant/Restaurants.js';
import SearchResults from '../modules/restaurant/SearchResults.js';
//added by kim for some testing
import NewRestaurant from '../modules/restaurant/NewRestaurant.js';
import NewUser from '../modules/user/NewUser.js';
import Reviews from '../modules/review/Reviews.js';
import NewReview from '../modules/review/NewReview';
import Login from '../modules/user/Login.js';
import GoogleLogin from '../modules/google-user/GoogleLogin.jsx';
import Edit from '../modules/review/Edit.js';
import ReviewFlag from '../modules/review/ReviewFlag.js';
import EditProfile from '../modules/user/EditProfile.js';
//end by Kim

import Layout from '../modules/home/layout.js';
import Homepage from '../modules/home/homepage.js';
import RestaurantDetail from '../modules/restaurant/RestaurantDetail.js';
import * as requireAuth from './requireAuth.js';
import Profile from '../modules/user/Profile.jsx';
import Logout from '../modules/user/Logout.jsx';

let routes = (
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Homepage}/>
            <Route path='/restaurants' component={Restaurants}/>
            <Route path='/restaurants/new' component={NewRestaurant}/>
            <Route path="/restaurants/:id" component={RestaurantDetail}/>
            <Route path='/newUser' component={NewUser}/>
            <Route path='/profile' component={Profile}/>
            <Route path='profile/edit/:id' component={EditProfile} />
            <Route path='/reviews/edit/:id' component={Edit}/>
            <Route path='/reviews/new_review_flag/:id' component={ReviewFlag}/>
            <Route path='/login' component={Login}/>
            <Route path='/google_login' component={GoogleLogin}/>
            <Route path='/logout' component={Logout}/>
            <Route path='/reviews' component={Reviews}/>
            <Route path='/reviews/new/:id' component={NewReview}/>
            <Route path='/results(/:searchString)(/:location)' component={SearchResults} />

        </Route>
    </Router>
);

module.exports = routes;
