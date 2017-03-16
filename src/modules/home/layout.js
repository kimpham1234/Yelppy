import React from 'react';
import * as firebase from 'firebase';
import { Link, hashHistory } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';
import Search from './search.js';

export default class NewRestaurant extends Component{

    getInitialState(){
        return {
            isLoggedIn: (firebase.auth().currentUser != null),
            requests: []
        }
    };

    componentWillMount(){

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
                    if(snap.val().status == 'accepted'){
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

    };

    render(){

        if(this.state.isLoggedIn){
            //logged in navbar setup
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
                          <LinkContainer to="/" >
                              Yelppy
                          </LinkContainer>
                      </Navbar.Brand>
                  </Navbar.Header>
                    {restauraunts}
                    {newUser}
                </Navbar>

                <div className="container">
                    {this.props.children}
                </div>

            </div>
        )
    }
}
