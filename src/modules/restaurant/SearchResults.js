/* eslint-disable no-undef*/
import React, { Component } from 'react';
import { withGoogleMap, GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import Restaurants from './Restaurants.js';


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

        this.businessRef = firebase.database().ref('business');

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
            let markerArr = [];
            let idArr = [];
            //console.log(results);

            let localRef = "";
            let tempBounds = new google.maps.LatLngBounds();
            for(var i = 0; i < results.length; i++){
                //console.log(results[i]);
                let tempID = "";
                let newBusiness = "";
                let restaurantThumbnail = results[i].photos[0].getUrl({maxWidth: 50});

                let that = this;
                tempID = results[i].place_id;
                idArr.push(tempID);
                //console.log("tempID after assignment" + tempID);
                //console.log("tempID in if statement: " + tempID);
                that.businessRef.orderByChild('id').equalTo(tempID).on('value', function (snapshot) {
                    console.log("tempID in query callback: " + tempID);
                    // We don't have this entry in our db, so lets insert it
                    if (snapshot.val() == null) {
                        // First we need to hit google for the details
                        that.searchService.getDetails({placeId: tempID}, function (place, status) {
                            //console.log("tempID inside google callback: " + tempID);
                            // now we can insert it
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                let placeArr = place.formatted_address.split(',');
                                newBusiness = that.businessRef.push();
                                newBusiness.set({
                                    avatar: place.photos[0].getUrl({maxWidth: 700}),
                                    categories: place.types,
                                    id: place.place_id,
                                    coordinates: {
                                        latitutde: place.geometry.location.lat(),
                                        longitude: place.geometry.location.lng()
                                    },
                                    images: ["https://firebasestorage.googleapis.com/v0/b/yelppy-80fb2.appspot.com/o/images%2FDefault%2FnoPictureYet.png?alt=media&token=d07db72a-0963-488e-b228-9ab020bd0d41"],
                                    name: place.name,
                                    location: {
                                        address1: placeArr[0].trim(),
                                        address2: "",
                                        address3: "",
                                        city: placeArr[1].trim(),
                                        state: placeArr[2].trim().split(' ')[0].trim(),
                                        zip_code: placeArr[2].trim().split(' ')[1].trim(),
                                        display_address: [placeArr[0].trim(), (placeArr[1].trim() + ', ' + placeArr[2].trim().split(' ')[0].trim())]
                                    },
                                    numReview: 0,
                                    phone: place.formatted_phone_number,
                                    price: "",
                                    rating: 0
                                });
                            }

                        });
                    }
                    // if we DO have it in the DB, lets set some values for the infowindows
                    else{

                    }
                });

                markerArr.push({
                    position: {
                        lat: results[i].geometry.location.lat(),
                        lng: results[i].geometry.location.lng()
                    },
                    showInfo: true,
                    infoContent: <div>
                        <p><img src={restaurantThumbnail} ></img></p>
                        <p>{results[i].name}</p>
                        <p>{results[i].vicinity.split(',')[0]}</p>
                        <p>{results[i].vicinity.split(',')[1].trim()}</p>
                        <p><Link to={'/restaurants/'+results[i].place_id}>Review this restaurant</Link></p>
                    </div>

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
            this.setState({ markers: markerArr, bounds: tempBounds, idArr: idArr });
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
        });
    }

    onMarkerClick(marker){

    }

    render(){

        return(
            <div>
                <GettingStartedGoogleMap
                    containerElement={
                        <div style={{ height: "100%", width: "100%" }} />
                    }
                    mapElement={
                        <div id="map" className="map-element" style={{ height: "800px", width: "600px" }} />
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
                <Restaurants idArray={this.state.idArr} ></Restaurants>
            </div>
        );

    }

}