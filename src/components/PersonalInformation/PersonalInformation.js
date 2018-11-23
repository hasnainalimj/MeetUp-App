import React from "react";
import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import "./PersonalInformation.css";
import '../../assets/bootstrap/bootstrap.min.css';
import firebase from "../../config/firebase";
import swal from 'sweetalert';


export default class PersonalInformation extends React.Component {
  constructor() {
    super();
    this.state = {
      fullName: "",
      nickname: "",
      phone: ""
    }
    this.updateUserDetails = this.updateUserDetails.bind(this);
  }

  updateUserDetails(){
   
    const {fullName , nickname , phone} = this.state;
    const user_id = localStorage.getItem('user_id');
    
    document.getElementById('btnAddDetails').innerHTML = "";
    const button = document.getElementById('btnAddDetails');
    const loader = document.createElement('i');
    loader.setAttribute('id', 'loading');
    loader.setAttribute('class', 'fas fa-spinner fa-spin')
    button.appendChild(loader);

    firebase.firestore().collection('users').doc(user_id).update({
      fullName,
      nickname,
      phone
    }).then(res => {
      swal({
        title: "Successfully Updated",
        icon: "success"
      });
      localStorage.setItem('fullName',fullName);
      localStorage.setItem('nickname',nickname);
      localStorage.setItem('phone',phone);
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
      document.getElementById('btnAddDetails').innerHTML = "Update";
    });
  }

  render() {
    const { fullName , nickname, phone } = this.state;
    return (
      <div className="PersonalInformation">
        <img src={Logo} alt="Logo" />
        <br />
        <form className="form-group mx-auto">
        <input required className="form-control mb-3" type="text" placeholder="Enter Full Name" onChange={(e) => this.setState({ fullName: e.target.value })} />
          <input required className="form-control mb-3" type="text" placeholder="Enter Nickname" onChange={(e) => this.setState({ nickname: e.target.value })} />
          <input required className="form-control mb-3" type="tel" placeholder="Enter Phone" onChange={(e) => this.setState({ phone: e.target.value })} />
            <span id="btnAddDetails" className="btn btn-primary px-5" onClick={this.updateUserDetails}>Update</span>       
        </form>
      </div>
    );
  }
}
