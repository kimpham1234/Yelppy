/* eslint-disable no-undef*/
import React, { Component } from 'react';
import { withGoogleMap, GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';


const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={16}
        defaultCenter={{ lat: 37.336339, lng: -121.881286 }}
        onClick={props.onMapClick}
    >
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
                onRightClick={() => props.onMarkerRightClick(index)}
            />
        ))}
    </GoogleMap>
));

export default class SearchResults extends Component{

    constructor(props){

        super(props);
        this.state = {
            markers: [],
            request: {
                location: new google.maps.LatLng(37.336339, -121.881286),
                radius: '500',
                type: 'restaurant'
            }
        };
        this.searchService = new google.maps.places.PlacesService(document.getElementById('map'));
        this.searchCallback = this.searchCallback.bind(this);
        this.state.request.keyword = this.props.location.state.searchString;
        this.searchService.nearbySearch(this.state.request, this.searchCallback);
        //console.log(this.state);

    }

    componentWillReceiveProps(nextProps){

        this.setState({
            request: {
                location: new google.maps.LatLng(37.336339, -121.881286),
                radius: '500',
                type: 'restaurant',
                keyword: nextProps.location.state.searchString
            }
        }, function(){
            var emptyArr = [];
            this.setState({
                markers: emptyArr
            }, function() {
                this.searchService.nearbySearch(this.state.request, this.searchCallback);
            });
        });
    }

    componentWillUpdate(){

    }

    searchCallback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){

            var tempArr;
            for(var i = 0; i < results.length; i++){
                tempArr = this.state.markers.slice();
                tempArr.push({ position: {
                    lat: results[i].geometry.location.lat(),
                    lng: results[i].geometry.location.lng()
                }});
                this.setState({ markers: tempArr });
            }
        }
    }

    render(){

        return(
            <GettingStartedGoogleMap
                containerElement={
                    <div style={{ height: "700px", width: "700px" }} />
                }
                mapElement={
                    <div id="map" style={{ height: "600px", width: "600px" }} />
                }
                onMapLoad={_.noop}
                onMapClick={_.noop}
                markers={this.state.markers}
                onMarkerRightClick={_.noop}
            />
        );

    }

}