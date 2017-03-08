import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class NavigationBar extends Component {

    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Yelppy</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <LinkContainer to="/restaurants">
                        <NavItem eventKey={1}>
                            Restaurants
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to='/newUser'>
                        <NavItem eventKey={2}>
                            Create an account
                        </NavItem>
                    </LinkContainer>
                    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Action</MenuItem>
                        <MenuItem eventKey={3.2}>Another action</MenuItem>
                        <MenuItem eventKey={3.3}>Something else here</MenuItem>
                        <MenuItem divider/>
                        <MenuItem eventKey={3.3}>Separated link</MenuItem>
                    </NavDropdown>
                </Nav>
                <Navbar.Form pullRight className="pull-right">
                    <FormGroup>
                        <FormControl type="text" placeholder="Search"/>
                    </FormGroup>
                    {' '}
                    <Button type="submit">Submit</Button>
                </Navbar.Form>
            </Navbar>
        );
    }


}

