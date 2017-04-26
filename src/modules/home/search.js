import React, { Component } from 'react';
//import * as firebase from 'firebase';
import { Navbar, FormGroup, FormControl, Button, MenuItem, DropdownButton } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import ReactDOM from 'react-dom';


const businessTypes = ['amusement_park', 'bakery', 'bar', 'beauty_salon', 'bicycle_store',
                        'book_store', 'cafe', 'car_dealer', 'car_rental', 'department_store', 'electronics_store',
                        'florist', 'gym', 'hardware_store', 'home_goods_store', 'jewelry_store', 'liquor_store', 'locksmith',
                        'lodging', 'meal_delivery', 'movie_theater', 'moving_company', 'night_club', 'pet_store', 'plumber',
                        'restaurant', 'shoe_store', 'shopping_mall', 'store', 'travel_agency'];

class Search extends Component{

    constructor(){
        super();
        this.state = {
            searchString: '',
            locationString: '',
            searchType: 'restaurant',
            businessTypes: businessTypes
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.typeComponents = businessTypes.map((type, index) =>(
            <MenuItem eventKey={index} onSelect={() => this.typeChange(event, type)}>
                {type.split('_').join(' ')}
            </MenuItem>
        ));

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
                locationString: locationVal,
                searchType: this.state.searchType
            }
        });
    }

    typeChange(event, type){
        event.preventDefault();
        event.stopPropagation();
        if( event.type == "react-click" ){
            this.setState({ searchType: type.split('_').join(' ') });
        }
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
                                 placeholder="Search for"/>
                    <DropdownButton id="dropdownMenu"
                                    title={this.state.searchType}
                                    role="menuitem">
                        {this.typeComponents}
                    </DropdownButton>
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