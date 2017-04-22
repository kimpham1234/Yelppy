import React, { Component } from 'react';
//import * as firebase from 'firebase';
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import ReactDOM from 'react-dom';


class Search extends Component{

    constructor(){
        super();
        this.state = {
            searchString: ''
        };
        this.handleSearch = this.handleSearch.bind(this);
        //this.updateSearchString = this.updateSearchString.bind(this);
    }

    handleSearch(event){
        let that = this;
        event.preventDefault();
        event.stopPropagation();
        let path = '/results';
        let searchVal = ReactDOM.findDOMNode(this.refs.searchString).value;
        let locationVal = ReactDOM.findDOMNode(this.refs.locationString).value;
        //console.log(ReactDOM.findDOMNode(this.refs.searchString).value);

        hashHistory.push({
            pathname: path,
            state: {
                searchString: searchVal,
                locationString: locationVal
            }
        });
    }

    /*updateSearchString(){
        this.setState({searchString: this.refs.searchString.valueOf()});
    }*/

    componentWillMount(){

        //this.setState({searchString: ""});
    }

    render(){

        return(
            <Navbar.Form className="pull-right" pullRight>
                <FormGroup>
                    <FormControl componentClass="input"
                                 type="text"
                                 ref="searchString"
                                 placeholder="Search for restaurants"/>
                    <span> near </span>
                    <FormControl componentClass="input"
                                 type="text"
                                 ref="locationString"
                                 placeholder="location" />
                </FormGroup>
                {' '}
                <Button onClick={this.handleSearch} type="button">Submit</Button>
            </Navbar.Form>
        )
    }

}

export default Search;