import React from "react";
import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import "./ProfileMeetingTimings.css";
import '../../assets/bootstrap/bootstrap.min.css'
import firebase from "../../config/firebase";
import swal from 'sweetalert';

export default class ProfileMeetingTimings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingTimings: []
    };

    this.updateMeetingTimings = this.updateMeetingTimings.bind(this);
  }

  meetingTimeHandle = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    if (value) {
      this.setState({
        meetingTimings: this.state.meetingTimings.concat(name)
      })
    }
    if (!value) {
      this.setState({
        meetingTimings: this.state.meetingTimings.filter(option => name !== option)
      })
    }
  }

  updateMeetingTimings(){
    const {meetingTimings} = this.state;
    const user_id = localStorage.getItem('user_id');

    document.getElementById('btnAddBeverages').innerHTML = "";
    const button = document.getElementById('btnAddBeverages');
    const loader = document.createElement('i');
    loader.setAttribute('id', 'loading');
    loader.setAttribute('class', 'fas fa-spinner fa-spin')
    button.appendChild(loader);

    firebase.firestore().collection('users').doc(user_id).update({
      meetingTimings
    }).then(resp => {
      swal({
        title: "Successfully Updated",
        icon: "success"
      });
      localStorage.setItem('meetingTimings',meetingTimings);
      this.props.history.push("/profile");
    }).catch(err => {
      swal({
        title: "Errow While Updation",
        text: "Check Your Internet Connection & Try Again",
        icon: "warning",
        button: "Ok",
        dangerMode: true
      });
      document.getElementById('loading').style.display = "none";
      document.getElementById('btnAddBeverages').innerHTML = "Next";
    });
  }

  render() {
    const {meetingTimings } = this.state;
    return (
      <div className="ProfileMeetingTimings">
        <img src={Logo} alt="Logo" />
        <div className='row w-75 mx-auto mt-3'>
          <div className='col-md-5 border border-dark rounded mx-auto'>
            <p className="text-dark"><u>Select Durations</u></p>
            <label className="text-dark container">20 Min
              <input type="checkbox" name="20 Min" onChange={this.meetingTimeHandle} value='20 Min' />
              <span className="checkmark"></span>
            </label>
            <label className="text-dark container">60 Min
              <input type="checkbox" name="60 Min" onChange={this.meetingTimeHandle} value='60 Min' />
              <span className="checkmark"></span>
            </label>
            <label className="text-dark container">120 Min
              <input type="checkbox" name="120 Min" onChange={this.meetingTimeHandle} value='120 Min' />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <br />
        {/* <NavLink to={{ pathname: "/location" }}><button className='btn btn-primary px-5'>Next</button></NavLink> */}
        <button id="btnAddBeverages" className='btn btn-primary px-5' onClick={this.updateMeetingTimings}>Update</button>
      </div>
    );
  }
}
