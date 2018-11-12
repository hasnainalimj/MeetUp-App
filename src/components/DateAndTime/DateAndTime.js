import React from "react";
// import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import "./DateAndTime.css";
import firebase from "../../config/firebase";
import '../../assets/bootstrap/bootstrap.min.css';
import swal from 'sweetalert';
import AddToCalendar from "react-add-to-calendar";
import 'react-add-to-calendar/dist/react-add-to-calendar.css'

var username = null;
var meetingUsername = null;

const meetingUser = JSON.parse(localStorage.getItem('MeetingUser'));
const userName = localStorage.getItem('fullName');



export default class DateAndTime extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {
		// 	event: {
		// 	  title: userName + " And " + meetingUser.fullName,
		// 	  description: userName + " Want To Meet With " + meetingUser.fullName,
		// 	  location: "Pakistan"
		// 	}
		//   }

		const user_id = localStorage.getItem('user_id');
		firebase.firestore().collection('users').doc(user_id).get().then(res => {
			username = res.data().fullName;
		})

		const parseMeetingUserId = JSON.parse(localStorage.getItem('MeetingUser'));
		const meetingUserId = parseMeetingUserId.uid;
		firebase.firestore().collection('users').doc(meetingUserId).get().then(res => {
			meetingUsername = res.data().fullName;
		})

		this.doneMeeting = this.doneMeeting.bind(this);
	}

	doneMeeting() {
		const name = localStorage.getItem('fullName');
		const user_id = localStorage.getItem('user_id');
		const parseMeetingUserId = JSON.parse(localStorage.getItem('MeetingUser'));
		const meetingUserId = parseMeetingUserId.uid;
		const parseLocations = JSON.parse(localStorage.getItem('MeetingLocation'));
		const meetingLocationName = parseLocations.meetingLocationName;
		const meetingLocationCoords = parseLocations.meetingLocationCoords;
		const meetingDate = document.getElementById('txtDate').value;
		const meetingTime = document.getElementById('txtTime').value;
		const status = "Pending";

		swal({
			title: "Are you sure?",
			text: name + " Did You Really Want To Meet Him/Her.",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					firebase.firestore().collection('meetings').add({
						user_id,
						username,
						meetingUserId,
						meetingUsername,
						meetingLocationName,
						meetingLocationCoords,
						meetingDate,
						meetingTime,
						status
					}).then(() => {
						swal("Meeting Request Sent Successfully", {
							title: "Congratulations " + name,
							icon: "success",
						});
						this.props.history.push("/dashboard");
					})
				} else {
				}
			});
	}

	render() {
		// let icon = { 'calendar-plus-o': 'left' };
		return (
			<div className="text-dark DateAndTime">
				<img src={Logo} alt='logo' />
				<input type="date" className="form-control col-md-12 mt-5" id="txtDate" required/>
				<input type="time" className="form-control col-md-12 mt-2" id="txtTime" required/>
				{/* <div className="float-left mt-3">
				<AddToCalendar
					event={this.state.event}
					buttonTemplate={icon} />
				</div> */}
				<button className="btn btn-primary float-right mt-3 px-5" onClick={this.doneMeeting}>Done</button>
			</div>
		)
	}
}