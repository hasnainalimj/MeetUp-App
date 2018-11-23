import React from "react";
import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import "./ProfileBeverages.css";
import '../../assets/bootstrap/bootstrap.min.css'
import firebase from "../../config/firebase";
import swal from 'sweetalert';

export default class ProfileBeverages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beverages: [],
      meetingTimings: []
    };

    this.updateBeverages = this.updateBeverages.bind(this);
  }

  beverageSelectors = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    if (value) {
      this.setState({
        beverages: this.state.beverages.concat(name)
      })
    }
    if (!value) {
      this.setState({
        beverages: this.state.beverages.filter(option => name !== option)
      })
    }
  }

  updateBeverages(){
    const {beverages} = this.state;
    const user_id = localStorage.getItem('user_id');

    document.getElementById('btnAddBeverages').innerHTML = "";
    const button = document.getElementById('btnAddBeverages');
    const loader = document.createElement('i');
    loader.setAttribute('id', 'loading');
    loader.setAttribute('class', 'fas fa-spinner fa-spin')
    button.appendChild(loader);

    firebase.firestore().collection('users').doc(user_id).update({
      beverages
    }).then(resp => {
      swal({
        title: "Successfully Updated",
        icon: "success"
      });
      localStorage.setItem('beverages',beverages);
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
      document.getElementById('btnAddBeverages').innerHTML = "Update";
    });
  }

  render() {
    const { beverages } = this.state;
    return (
      <div className="ProfileBeverages">
        <img src={Logo} alt="Logo" />
        <div className='row w-75 mx-auto mt-3'>
          <div className='col-md-5 border border-dark rounded mx-auto'>
            <p className="text-dark"><u>Select Beverages</u></p>
            <label className="text-dark container">Juice
              <input type="checkbox" name="juice" onChange={this.beverageSelectors} value="juice" />
              <span className="checkmark"></span>
            </label>
            <label className="text-dark container">Coffee
              <input type="checkbox" name="coffee" onChange={this.beverageSelectors} value="coffee" />
              <span className="checkmark"></span>
            </label>
            <label className="text-dark container">Cocktail
              <input type="checkbox" name="cocktail" onChange={this.beverageSelectors} value="cocktail" />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <br />
        {/* <NavLink to={{ pathname: "/location" }}><button className='btn btn-primary px-5'>Next</button></NavLink> */}
        <button id="btnAddBeverages" className='btn btn-primary px-5' onClick={this.updateBeverages}>Update</button>
      </div>
    );
  }
}
