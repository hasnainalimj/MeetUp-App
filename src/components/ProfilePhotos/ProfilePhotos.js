import React from "react";
import { NavLink } from "react-router-dom";
import ImageUploader from 'react-images-upload';
import Logo from '../../assets/logo.png'
import "./ProfilePhotos.css";
import firebase from "../../config/firebase";
import '../../assets/bootstrap/bootstrap.min.css';
import swal from 'sweetalert';

const Storage = firebase.storage();

class ProfilePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: []
    };
    this.onDrop = this.onDrop.bind(this);
  }

  uploadImages = () => {

    document.getElementById('btnUploadImages').innerHTML = "";
    const button = document.getElementById('btnUploadImages');
    const loader = document.createElement('i');
    loader.setAttribute('id', 'loading');
    loader.setAttribute('class', 'fas fa-spinner fa-spin')
    button.appendChild(loader);

    const {pictures} = this.state;
    // console.log(pictures.length)

    if(pictures.length != 3){
      swal("Please Select At Least 3 Photos", {
        icon: "warning",
        dangerMode : true
      });
      return
    }

    const userImages = [];

    Storage.ref(
      localStorage.getItem('user_id'),
    ).constructor.prototype.putFiles = pictures =>
      Promise.all(
        pictures.map((file, index) =>
          Storage.ref(localStorage.getItem('user_id'))
            .child(`${index + 1}`)
            .put(file)
            .then(res => {
              return res.ref.getDownloadURL();
            })
            .then(url => userImages.push(url)),
        ),
      );

    // use it!
    Storage.ref(localStorage.getItem('user_id'))
      .putFiles(pictures)
      .then(() => {
        firebase.firestore().collection('users').doc(localStorage.getItem('user_id'))
          .update({userImages})
          .then(() => {         
            swal({
              title: "Images Uploaded Successfully",
              icon: "success",
              button: "Ok", 
            });
            this.props.history.push("/profile");
          })
          .catch(err => {
            // console.log('ERROR => ', err);
            swal({
              title: "Errow While Uploading",
              text: "Check Your Internet Connection & Try Again",
              icon: "warning",
              button: "Ok",
              dangerMode: true
            });
            document.getElementById('loading').style.display = "none";
            document.getElementById('btnUploadImages').innerHTML = "Upload Images";
          });
      })
      .catch(error => {
        // console.log('ERROR =>', error);
      });
  }

  onDrop(pictureFiles, pictureDataURLs) {
    // console.log(pictureFiles)
    this.setState({
      pictures: pictureFiles
    });
  }


  RenderImageSelector = () => {
    const { pictures } = this.state;
    return (
      <div className="ProfilePhotos">
        <img src={Logo} alt="Logo" />
        {/* image uploader Component */}
        <div className="images-box mx-auto">
          <ImageUploader
            withIcon={true}
            buttonText='Choose Photos'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png']}
          />

          {/* getting name of images */}
          {pictures.map(value => {
            return (
              <div key={value.name}>
                <small style={{ fontSize: '10px' }} className='text-dark'>{value.name}</small>
              </div>)
          })}
        </div>
        <br />
       
        <button id="btnUploadImages" className="btn btn-success px-5" onClick={this.uploadImages}>Upload Images</button>
      </div>
    );
  }

  render() {
    return this.RenderImageSelector();
  }

}

export default ProfilePhotos;