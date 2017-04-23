/* eslint-disable no-undef*/
import React, { Component } from 'react';
import { withGoogleMap, GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { Link } from 'react-router';


const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapMounted}
        id="111"
        defaultZoom={17}
        center={props.centerLocation}
        onClick={props.onMapClick}
        onBoundsChanged={props.onBoundsChanged}
    >
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
                onRightClick={() => props.onMarkerRightClick(index)}
                onClick={() => props.onMarkerClick(marker)}
            >
                {/*
                 Show info window only if the 'showInfo' key of the marker is true.
                 That is, when the Marker pin has been clicked and 'onCloseClick' has been
                 Successfully fired.
                 */}
                {marker.showInfo && (
                    <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                        <div>{marker.infoContent}</div>
                    </InfoWindow>
                )}
            </Marker>
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
                radius: '10000',
                type: this.props.location.state.searchType,
                keyword: this.props.location.state.searchString
            },
            locationRequest: {
                query: this.props.location.state.locationString
            }
        };

        this.searchService = new google.maps.places.PlacesService(document.getElementById('map'));
        this.searchCallback = this.searchCallback.bind(this);
        this.locationSearchCallback = this.locationSearchCallback.bind(this);
        this.handleMapLoaded = this.handleMapLoaded.bind(this);
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.searchService.textSearch(this.state.locationRequest, this.locationSearchCallback);

    }

    componentWillReceiveProps(nextProps){
        let emptyArr = [];
        this.setState({
            request: {
                location: new google.maps.LatLng(37.336339, -121.881286),
                radius: '2000',
                type: nextProps.location.state.searchType,
                keyword: nextProps.location.state.searchString
            },
            locationRequest: {
                query: nextProps.location.state.locationString
            },
            markers: emptyArr
        }, function(){
            this.searchService.textSearch(this.state.locationRequest, this.locationSearchCallback);
        });
    }

    searchCallback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            //console.log(results);
            let tempArr = [];
            console.log(results);
            let tempBounds = new google.maps.LatLngBounds();
            for(var i = 0; i < results.length; i++){
                console.log(results[i].vicinity.split(','));
                tempArr.push({
                    position: {
                        lat: results[i].geometry.location.lat(),
                        lng: results[i].geometry.location.lng()
                    },
                    showInfo: true,
                    infoContent: <svg
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="160"
                        height="40"
                        viewBox="0 0 100 50"
                    >
                        <text fill="#000000"
                              fontFamily="Verdana"
                              fontSize="10"
                              x="50"
                              y="10"
                              textAnchor="middle">
                            <tspan x="50%" y="15%">{results[i].name}</tspan>
                            <tspan x="50%" y="40%">{results[i].vicinity.split(',')[0]}</tspan>
                            <tspan x="50%" y="60%">{results[i].vicinity.split(',')[1].trim()}</tspan>
                            <tspan x="50%" y="88%">
                                <Link to={'/businessDetail/'+results[i].geometry.location.lat() + '/' + results[i].geometry.location.lng()}>Review this restaurant</Link>
                            </tspan>
                        </text>
                    </svg>

                });
                tempBounds.extend({
                    lat: results[i].geometry.location.lat(),
                    lng: results[i].geometry.location.lng()
                });
            }
            //console.log({lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()});
            if(this.googleMap){
                this.googleMap.fitBounds(tempBounds);
            }
            this.setState({ markers: tempArr, bounds: tempBounds });
        }
    }

    locationSearchCallback(results, status){
        let tempLat = 0;
        let tempLng = 0;
        switch(status){
            case google.maps.places.PlacesServiceStatus.OK:
                tempLat = results[0].geometry.location.lat();
                tempLng = results[0].geometry.location.lng();
                break;
            default:
                tempLat = 37.336339;
                tempLng = -121.881286;
                break;
        }
        this.setState({
            center: {lat: tempLat , lng: tempLng },
            request: {
                location: new google.maps.LatLng(tempLat, tempLng),
                radius: '10000',
                type: this.props.location.state.searchType,
                keyword: this.props.location.state.searchString
            }
        }, function () {
                this.searchService.nearbySearch(this.state.request, this.searchCallback);
        });

    }

    handleMapLoaded(map){
        console.log('map mounted');
        this.googleMap = map;
    }

    handleBoundsChanged(){
        this.setState({
            bounds: this.googleMap.getBounds()
        }, function(){
            console.log(this.state.bounds);
        });
    }

    onMarkerClick(marker){

    }

    render(){

        return(
            <GettingStartedGoogleMap
                containerElement={
                    <div style={{ height: "100%", width: "100%" }} />
                }
                mapElement={
                    <div id="map" style={{ height: "700px", width: "700px" }} />
                }
                centerLocation={this.state.center}
                onMapMounted={this.handleMapLoaded}
                onBoundsChanged={this.handleBoundsChanged}
                onMapLoad={_.noop}
                onMapClick={_.noop}
                bounds={this.state.bounds}
                markers={this.state.markers}
                onMarkerRightClick={_.noop}
                onMarkerClick={this.onMarkerClick}
            />
        );

    }

}