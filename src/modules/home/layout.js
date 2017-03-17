import React from 'react';
import * as firebase from 'firebase';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import Search from './search.js';


let Layout = React.createClass({

    getInitialState(){
        return {
            isLoggedIn: (null != firebase.auth().currentUser),
            requests: []
        }
    },

    componentWillMount: function(){

        var that = this;

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isLoggedIn: (user != null)});
            this.setState({name: this.state.isLoggedIn ? user.displayName : null});
            this.setState({user_id: this.state.isLoggedIn ? user.uid : null});

            if(this.state.isLoggedIn){
                this.userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
                this.userRef.on("value", snap => {
                    var user = snap.val();
                });


                this.connectionRef = firebase.database().ref().child('connections/' + user.uid).orderByChild('status').equalTo('awaiting-acceptance');
                this.connectionRef.on("child_added", snap=>{
                    if(snap.val()){
                        var requesterID = snap.ref.key;
                        var requesterRef = firebase.database().ref().child('users/' + requesterID);
                        requesterRef.once("value", snap=>{
                            var userData = snap.val();
                            if(userData){
                                this.state.requests.push(requesterID);
                                this.setState({requests: this.state.requests});
                            }
                        });
                    }
                });

                this.connectionRefUpdate = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefUpdate.on("child_changed", snap=>{
                    if(snap.val().status === 'accepted'){
                        var index = this.state.requests.indexOf(snap.ref.key);
                        if(index >= 0){
                            this.state.requests.splice(index, 1);
                            this.setState({requests: this.state.requests});
                        }
                    }
                });

                this.connectionRefRemoved = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefRemoved.on("child_removed", snap=>{
                    var index = this.state.requests.indexOf(snap.ref.key);
                    if(index >= 0){
                        this.state.requests.splice(index, 1);
                        this.setState({requests: this.state.requests});
                    }
                });
            }

        });

    },

    componentWillReceiveProps: function(nextProps){
        var that = this;
        this.unsubscribe();
        //this.state.requests.splice(0, this.state.requests.length);

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isLoggedIn: (null != user)});
            this.setState({recruiter: this.state.isLoggedIn === false ? false : null});
            this.setState({name: this.state.isLoggedIn ? user.displayName : null});
            this.setState({user_id: this.state.isLoggedIn ? user.uid : null});

            if(this.state.isLoggedIn){
                this.userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
                this.userRef.on("value", snap => {
                    var user = snap.val();
                    this.setState({imgURL: user.imageURL});
                    this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
                });

                this.connectionRef = firebase.database().ref().child('connections/' + user.uid).orderByChild('status').equalTo('awaiting-acceptance');
                this.connectionRef.on("child_added", snap=>{
                    if(snap.val()){
                        var requesterID = snap.ref.key;
                        var requesterRef = firebase.database().ref().child('users/' + requesterID);
                        requesterRef.once("value", snap=>{
                            var userData = snap.val();
                            if(userData){
                                if(this.state.requests.indexOf(snap.ref.key) < 0){
                                    this.state.requests.push(snap.ref.key);
                                    this.setState({requests: this.state.requests});
                                }
                            }
                        });

                    }
                });

                this.connectionRefUpdate = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefUpdate.on("child_changed", snap=>{
                    if(snap.val().status === 'accepted'){
                        var index = this.state.requests.indexOf(snap.ref.key);
                        if(index >= 0){
                            this.state.requests.splice(index, 1);
                            this.setState({requests: this.state.requests});
                        }
                    }
                });

                this.connectionRefRemoved = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefRemoved.on("child_removed", snap=>{
                    var index = this.state.requests.indexOf(snap.ref.key);
                    if(index >= 0){
                        this.state.requests.splice(index, 1);
                        this.setState({requests: this.state.requests});
                    }
                });
            }
        });
    },

    render: function(){

        let restaurants;
        let newUser;

        if(this.state.isLoggedIn){
            //logged in navbar setup
            restaurants = <LinkContainer to="/restaurants"><NavItem eventKey={1}>Restaurants</NavItem></LinkContainer>;
            newUser = <LinkContainer to='/newUser'><NavItem eventKey={2}>Create an account</NavItem></LinkContainer>;
        }
        else{
            //not logged in version of navbar
            restaurants = <LinkContainer to="/restaurants"><NavItem eventKey={1}>Restaurants</NavItem></LinkContainer>;
            newUser = <LinkContainer to='/newUser'><NavItem eventKey={2}>Create an account</NavItem></LinkContainer>;
            // in progress... search =

        }

        return(
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Yelppy</a>
                        </Navbar.Brand>
                    </Navbar.Header>

                    <Nav>
                        {restaurants}
                        {newUser}
                    </Nav>
                </Navbar>

                <div className="App">
                    <div className="App-header">
                        <h2>Welcome to Yelppy</h2>
                    </div>
                    <div>
                        <p className="App-intro">
                            Come here to find and review yummy places!
                            <Link to='/restaurants'>View Restaurants</Link>
                        </p>
                    </div>
                </div>

                <div className="container">
                    {this.props.children}
                </div>

            </div>
        )
    }
});

module.exports = Layout;
