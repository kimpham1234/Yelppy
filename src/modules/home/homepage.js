import React, { Component } from 'react';
import "../../App.css";

class HomePage extends Component {
	render() {
		return (
			<div>
				<img className="yelppy-photo" src={require('../pictures/yelppy.jpg')} /> 
				<br></br>
				<br></br>
				
			</div>
		)
	}
}

export default HomePage;