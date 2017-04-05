import React, { Component } from 'react';
import "../../App.css";

class HomePage extends Component {
	render() {
		return (
			<div>
				<img className="yelppy-photo" src={require('../pictures/yelppy.jpg')} /> 
				<br></br>
				<br></br>
				<footer className = "footer">
				  <p>Teamname: Mean</p>
				  <p>Course: CMPE/SE 133 Spring 2017</p>
				  <p>Copyright by: Team Mean</p>
				  <p>Contact information: <a href="mailto:team.react-js@gmail.com">
				  team.react-js@gmail.com</a>.</p>
				</footer>
			</div>
		)
	}
}

export default HomePage;