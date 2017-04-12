/* eslint-disable no-undef*/
import React, { Component } from 'react';
import { withGoogleMap, GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';


const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        id="111"
        defaultZoom={16}
        center={props.centerLocation}
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
                type: 'restaurant',
                keyword: this.props.location.state.searchString
            },
            locationRequest: {
                query: this.props.location.state.locationString,
                type: 'city_hall'
            }
        };

        this.searchService = new google.maps.places.PlacesService(document.getElementById('map'));
        this.searchCallback = this.searchCallback.bind(this);
        this.locationSearchCallback = this.locationSearchCallback.bind(this);
        this.searchService.textSearch(this.state.locationRequest, this.locationSearchCallback);

    }

    componentWillReceiveProps(nextProps){

        this.setState({
            request: {
                location: new google.maps.LatLng(37.336339, -121.881286),
                radius: '500',
                type: 'restaurant',
                keyword: nextProps.location.state.searchString
            },
            locationRequest: {
                query: nextProps.location.state.locationString,
                type: 'city_hall'
            }
        }, function(){
            let emptyArr = [];
            this.setState({
                markers: emptyArr
            }, function() {
                this.searchService.textSearch(this.state.locationRequest, this.locationSearchCallback);
            });
        });
    }

    searchCallback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){

            var tempArr = [];
            for(var i = 0; i < results.length; i++){
                tempArr.push({ position: {
                    lat: results[i].geometry.location.lat(),
                    lng: results[i].geometry.location.lng()
                }});
            }
            this.setState({ markers: tempArr });
        }
    }

    locationSearchCallback(results, status){
        if( status == google.maps.places.PlacesServiceStatus.OK ||
            status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            let tempLat = 37.336339;
            let tempLng = -121.881286;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                tempLat = results[0].geometry.location.lat();
                tempLng = results[0].geometry.location.lng();
            }
            this.setState({
                request: {
                    location: new google.maps.LatLng(tempLat, tempLng),
                    radius: '500',
                    type: 'restaurant',
                    keyword: this.props.location.state.searchString
                }
            }, function () {
                this.setState({
                    center: {lat: tempLat, lng: tempLng}
                }, function () {
                    this.searchService.nearbySearch(this.state.request, this.searchCallback);
                });
            });
        }
    }

    render(){

        return(
            <GettingStartedGoogleMap
                containerElement={
                    <div style={{ height: "100%", width: "100%x" }} />
                }
                mapElement={
                    <div id="map" style={{ height: "700px", width: "700px" }} />
                }
                centerLocation={this.state.center}
                onMapLoad={_.noop}
                onMapClick={_.noop}
                markers={this.state.markers}
                onMarkerRightClick={_.noop}
            />
        );

    }

}