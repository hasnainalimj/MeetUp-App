import React from "react";
// import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import "./Direction.css";
import firebase from "../../config/firebase";
import '../../assets/bootstrap/bootstrap.min.css';
import swal from 'sweetalert';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer, withScriptjs } from "react-google-maps";
/*global google*/

export default class Direction extends React.Component {
	constructor(props) {
		super(props);

		this.state = ({
			directions: null,
			coords : null
		})

		const user_id = localStorage.getItem('user_id');

		firebase.firestore().collection('users').doc(user_id).get().then(doc => {
			// console.log(doc.data().coords);
			this.setState({
				coords : doc.data().coords
			})
		})

		this.getDirections = this.getDirections.bind(this);
		this.back = this.back.bind(this);
	}

	componentDidMount() {
		swal("Click On Get Direction Button To See Directions.", {	
		});	
	}

	getDirections() {
		const {coords} = this.state;
		const DirectionsService = new google.maps.DirectionsService();
		const designation = JSON.parse(localStorage.getItem('MeetingLocation'))

		DirectionsService.route({
			origin: new google.maps.LatLng(coords.latitude, coords.longitude),
			destination: new google.maps.LatLng(designation.meetingLocationCoords.latitude, designation.meetingLocationCoords.longitude),
			travelMode: google.maps.TravelMode.DRIVING,
		}, (result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				this.setState({
					directions: result,
				});
			} else {
				alert("Sorry! Can't calculate directions!")
			}
		});
	}

	back(){
		this.props.history.push("/meetingpoint");
	}

	render() {
		const { directions } = this.state;
		return (
			<div className="text-light Directions">
				{/* <img src={Logo} alt='logo' /> */}
				<MyMapComponent
					isMarkerShown
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: `600px` }} />}
					mapElement={<div style={{ height: `100%` }} />}
					directions={directions}
				/>
				<button className="btn btn-success px-5 mt-2" onClick={this.getDirections}>Get Directions</button>
				<br/>
				<button className="btn btn-danger px-4 mt-1" onClick={this.back}>Back</button>
			</div>
		)
	}
}

const center = JSON.parse(localStorage.getItem('coords'));
const MyMapComponent = withScriptjs(withGoogleMap((props) =>
	<GoogleMap
		defaultZoom={14}
		center={{
			lat: center.latitude,
			lng: center.longitude
		  }}
	>
		{<Marker position={{ lat: center.latitude, lng: center.longitude }} />}

		{props.directions && <DirectionsRenderer directions={props.directions} />}
	</GoogleMap>
))