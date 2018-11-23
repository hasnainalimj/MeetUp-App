import React from "react";
import { NavLink } from "react-router-dom";
import firebase from "../../config/firebase";
import Logo from '../../assets/logo.png'
import "./Profile.css";
import swal from 'sweetalert';
import '../../assets/bootstrap/bootstrap.min.css';
import { updateUser, removeUser } from "../../Redux/Actions/authActions";
import { connect } from "react-redux";
import A from '../../assets/2.jpg'

const user_id = localStorage.getItem('user_id');
var sum = null;
var length = null

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      flag: false,
      profile: null
    })


    firebase.firestore().collection('users').doc(user_id).get().then(doc => {
      this.setState({
        flag: true,
        profile: doc.data()
      })
    })
  }

  render() {
    const { flag, profile } = this.state;
    return (
      <div className="Profile">
        {<NavLink to={{ pathname: "/dashboard" }} >
          <button className="btn btn-success float-left">Back To Dashboard</button>
        </NavLink>}
        <br />
        <h3 className="float-left mt-3">My Profile</h3>
        <br />
        <hr />

        {flag && <div>
          <h5 className="float-left mt-3">Basic Information</h5>
          <table class="table table-bordered table-sm text-sm-left">
            <tr>
              <td scope="col"><h6>User Id</h6></td>
              <td><h6>{profile.uid}</h6></td>
            </tr>
            <tr>
              <td scope="col"><h6>Average Ratings</h6></td>
              {profile.ratings.map(value => {
                sum += value
                length = profile.ratings.length
              })}
              <td><h6>{sum / length} Stars</h6></td>
            </tr>
          </table>

          <h5 className="float-left mt-5">Personal Information</h5>
          <table class="table table-bordered table-sm text-sm-left">
            <tr>
              <td scope="col"><h6>Full Name</h6></td>
              <td><h6>{profile.fullName}</h6></td>
            </tr>
            <tr>
              <td scope="col"><h6>Nick Name</h6></td>
              <td><h6>{profile.nickname}</h6></td>
            </tr>
            <tr>
              <td scope="col"><h6>Phone</h6></td>
              <td><h6>{profile.phone}</h6></td>
            </tr>
            <tr>
              <td></td>
              <td>
                {<NavLink to={{ pathname: "/personalinfo" }} >
                  <button className="btn btn-primary px-5 float-right">Edit</button>
                </NavLink>}
              </td>
            </tr>
          </table>

          <h5 className="float-left mt-5">Beverages</h5>
          <table class="table table-bordered table-sm text-sm-left">
            {profile.beverages.map((value, index) => {
              return <tr>
                <td><h6>{index + 1} - {value}</h6></td>
                <td></td>
              </tr>
            })}

            <tr>
              <td></td>
              <td>
                {<NavLink to={{ pathname: "/profilebeverages" }} >
                  <button className="btn btn-primary px-5 float-right">Edit</button>
                </NavLink>}
              </td>
            </tr>
          </table>

          <h5 className="float-left mt-5">Meeting Timings</h5>
          <table class="table table-bordered table-sm text-sm-left">
            {profile.meetingTimings.map((value, index) => {
              return <tr>
                <td><h6>{index + 1} - {value}</h6></td>
                <td></td>
              </tr>
            })}

            <tr>
              <td></td>
              <td>
                {<NavLink to={{ pathname: "/profilemeetingtimings" }} >
                  <button className="btn btn-primary px-5 float-right">Edit</button>
                </NavLink>}
              </td>
            </tr>
          </table>

          <h5 className="mt-5 text-left">Images</h5>
          <hr />
          {profile.userImages.map(value => {
            return <img src={value} className="col-md-2 col-md-offset-1 profileImages" />
          })}

          {<NavLink to={{ pathname: "/profilephotos" }} >
            <button className="btn btn-primary px-5 float-right">Change</button>
          </NavLink>}

        </div>}
      </div>
    );
  }
}

export default Profile