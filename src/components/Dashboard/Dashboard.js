import React from "react";
import { NavLink } from "react-router-dom";
import SignOut from "../SignOut/SignOut";
import firebase from "../../config/firebase";
import Logo from '../../assets/logo.png'
import "./Dashboard.css";
import swal from 'sweetalert';
import '../../assets/bootstrap/bootstrap.min.css';
import StarRatingComponent from 'react-star-rating-component';
import { updateUser, removeUser } from "../../Redux/Actions/authActions";
import { connect } from "react-redux";

const sendedRequests = {
  pending: [],
  pendingIds: [],
  cancelled: [],
  cancelledIds: [],
  accepted: [],
  acceptedIds: [],
  done: [],
  doneIds: [],
  complicated: [],
  complicatedIds: []
}

const recievedRequests = {
  pending: [],
  pendingIds: [],
  cancelled: [],
  cancelledIds: [],
  accepted: [],
  acceptedIds: [],
  done: [],
  doneIds: [],
  complicated: [],
  complicatedIds: [],
  recievedRatings: []
}

const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// console.log("current", currentDate);
// var year = 2018;
// var month = 11;
// var date = 1;
// var current = new Date();

// if(date.toString().length == 1){
// date = 0+""+date
// }else{
// date
// }

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sendedRequestsFlag: false,
      recievedRequestsFlag: false,
      title: true,
      rating: 0,
      recievedRateId: null,
      sendedRateId: null
    }

    if (localStorage.getItem('user_id')) {
      firebase.firestore().collection('users').doc(localStorage.getItem('user_id')).get().then(doc => {
        const { registerd } = doc.data();
        if (!registerd) {
          this.props.history.push("/details");
        }
        else {
          const coords = JSON.parse(localStorage.getItem('coords'));

          //Getting Nearest 3 Locations
          fetch('https://api.foursquare.com/v2/venues/search?client_id=MGPF54DCITXMHDEET2CSRSR01GSCFTGV24AKNC5TL4ZEV1K1&client_secret=UU4SDRIRFIB1M3GEJTLWLKBLJUACSFHGT3Q0QCS1NZDAJ20T&v=20180323&limit=3&ll=' + coords.latitude + ',' + coords.longitude)
            .then(res => res.json())
            .then(data => {
              // console.log("Nearest->", data.response.venues);
              localStorage.setItem('nearestLocations', JSON.stringify(data.response.venues));
            });
        }
      })
    }



    this.getUserData = this.getUserData.bind(this);
    this.rateRecieved = this.rateRecieved.bind(this);
    this.rateSended = this.rateSended.bind(this);

    const user_id = localStorage.getItem("user_id");

    //Pendings
    firebase.firestore().collection('meetings').where('user_id', "==", user_id).where('status', '==', 'Pending').get().then(res => {
      res.forEach(doc => {
        sendedRequests.pending.push(doc.data());
        sendedRequests.pendingIds.push(doc.id);
      })
      this.setState({
        sendedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        sendedRequestsFlag: false,
        title: true
      })
    })

    //Cancelled
    firebase.firestore().collection('meetings').where('user_id', "==", user_id).where('status', '==', 'Cancelled').get().then(res => {
      res.forEach(doc => {
        sendedRequests.cancelled.push(doc.data());
        sendedRequests.cancelledIds.push(doc.id);
      })
      this.setState({
        sendedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        sendedRequestsFlag: false,
        title: true
      })
    })

    //Accepted
    firebase.firestore().collection('meetings').where('user_id', "==", user_id).where('status', '==', 'Accepted').get().then(res => {
      res.forEach(doc => {
        sendedRequests.accepted.push(doc.data());
        sendedRequests.acceptedIds.push(doc.id);
      })
      this.setState({
        sendedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        sendedRequestsFlag: false,
        title: true
      })
    })

    //Done
    firebase.firestore().collection('meetings').where('user_id', "==", user_id).where('status', '==', 'Done').get().then(res => {
      res.forEach(doc => {
        sendedRequests.done.push(doc.data());
        sendedRequests.doneIds.push(doc.id);
      })
      this.setState({
        sendedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        sendedRequestsFlag: false,
        title: true
      })
    })

    //Complicated
    firebase.firestore().collection('meetings').where('user_id', "==", user_id).where('status', '==', 'Complicated').get().then(res => {
      res.forEach(doc => {
        sendedRequests.complicated.push(doc.data());
        sendedRequests.complicatedIds.push(doc.id);
      })
      this.setState({
        sendedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        sendedRequestsFlag: false,
        title: true
      })
    })
    // <End Sendings>

    // <Start Recieveds>
    //Pendings
    firebase.firestore().collection('meetings').where('meetingUserId', "==", user_id).where('status', '==', 'Pending').get().then(res => {
      res.forEach(doc => {
        recievedRequests.pending.push(doc.data());
        recievedRequests.pendingIds.push(doc.id);
      })
      this.setState({
        recievedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        recievedRequestsFlag: false,
        title: true
      })
    })

    //Cancelled
    firebase.firestore().collection('meetings').where('meetingUserId', "==", user_id).where('status', '==', 'Cancelled').get().then(res => {
      res.forEach(doc => {
        recievedRequests.cancelled.push(doc.data());
        recievedRequests.cancelledIds.push(doc.id);
      })
      this.setState({
        recievedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        recievedRequestsFlag: false,
        title: true
      })
    })

    //Accepted
    firebase.firestore().collection('meetings').where('meetingUserId', "==", user_id).where('status', '==', 'Accepted').get().then(res => {
      res.forEach(doc => {
        recievedRequests.accepted.push(doc.data());
        recievedRequests.acceptedIds.push(doc.id);
      })
      this.setState({
        recievedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        recievedRequestsFlag: false,
        title: true
      })
    })

    //Done
    firebase.firestore().collection('meetings').where('meetingUserId', "==", user_id).where('status', '==', 'Done').get().then(res => {
      res.forEach(doc => {
        recievedRequests.done.push(doc.data());
        recievedRequests.doneIds.push(doc.id);
      })
      this.setState({
        recievedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        recievedRequestsFlag: false,
        title: true
      })
    })

    //Complicated
    firebase.firestore().collection('meetings').where('meetingUserId', "==", user_id).where('status', '==', 'Complicated').get().then(res => {
      res.forEach(doc => {
        recievedRequests.complicated.push(doc.data());
        recievedRequests.complicatedIds.push(doc.id);
      })
      this.setState({
        recievedRequestsFlag: true,
        title: false
      })
    }).catch(error => {
      this.setState({
        recievedRequestsFlag: false,
        title: true
      })
    })
    // <End Recieveds>
  }

  componentDidMount() {
    this.getUserData();
    const id = localStorage.getItem('user_id');
    firebase.firestore().collection('users').doc(id).get().then(doc => {
      this.props.updateUser(doc.data());
      // console.log(this.props);
    })
  }

  getUserData() {
    const user_id = localStorage.getItem('user_id');
    firebase.firestore().collection('users').doc(user_id).get().then(res => {
      localStorage.setItem('fullName', res.data().fullName);
      this.setState({ name: res.data().fullName })
    })
  }

  //Started Sended Request Functions
  sendPendingToCancel(index) {
    const id = sendedRequests.pendingIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancel This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Cancelled"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  sendAcceptSayYes(index) {
    const id = sendedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Accept This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            userSay: "Yes"
          }).then(res => {
            firebase.firestore().collection('meetings').doc(id).get().then(doc => {
              if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Done"
                }).then(res => {
                  swal("Both Users Accepted Meeting", {
                    title: "Meeting Done",
                    icon: "success",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Cancelled"
                }).then(res => {
                  swal("Both Users Cancelled Meeting", {
                    title: "Meeting Cancelled ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Accepted"
                }).then(res => {
                  swal("Waiting For Other User Response", {
                    title: "Pending",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
            })
          })
        } else {
        }
      });
  }

  sendAcceptSayNo(index) {
    const id = sendedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancel This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            userSay: "No"
          }).then(res => {
            firebase.firestore().collection('meetings').doc(id).get().then(doc => {
              if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Done"
                }).then(res => {
                  swal("Both Users Accepted Meeting", {
                    title: "Meeting Done",
                    icon: "success",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Cancelled"
                }).then(res => {
                  swal("Both Users Cancelled Meeting", {
                    title: "Meeting Cancelled ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Accepted"
                }).then(res => {
                  swal("Waiting For Other User Response", {
                    title: "Pending",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
            })
          })
        } else {
        }
      });
  }

  sendAcceptToCancel(index) {
    const id = sendedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancel This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Cancelled"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  sendRequestAgain(index) {
    const id = sendedRequests.cancelledIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Send Request Again?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Pending"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  sendDeleteCancelled(index) {
    const id = sendedRequests.cancelledIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).delete().then(function () {
            swal("Meeting Request Delete Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Deleting!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  sendRateDone(index) {
    const id = sendedRequests.doneIds[index];
    this.setState({
      sendedRateId: id
    })
  }

  rateSended() {
    const { sendedRateId, rating } = this.state;
    firebase.firestore().collection('meetings').doc(sendedRateId).get().then(doc => {
      // console.log(doc.data().meetingUserId);
      firebase.firestore().collection('users').doc(doc.data().meetingUserId).get().then(res => {
        // myRatings.push(res.data().ratings);
        firebase.firestore().collection('users').doc(doc.data().meetingUserId).update({
          ratings: [...res.data().ratings, rating]
        }).then(result => {
          swal("You Rate " + rating + " Stars To " + res.data().fullName, {
            title: "Rating Done",
            icon: "success",
          });
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        })
      })
    })
  }

  //End Sended Request Functions

  //Start Recieved Request Functions
  pendingToAccept(index) {
    const id = recievedRequests.pendingIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Accept This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Accepted"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {

        }
      });
  }

  pendingToCancel(index) {
    const id = recievedRequests.pendingIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancelled This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Cancelled"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {

        }
      });
  }

  acceptToCancel(index) {
    const id = recievedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancelled This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Cancelled"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  acceptSayYes(index) {
    const id = recievedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Accept This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            meetingUserSay: "Yes"
          }).then(res => {
            firebase.firestore().collection('meetings').doc(id).get().then(doc => {
              if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Done"
                }).then(res => {
                  swal("Both Users Accepted Meeting", {
                    title: "Meeting Done",
                    icon: "success",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Cancelled"
                }).then(res => {
                  swal("Both Users Cancelled Meeting", {
                    title: "Meeting Cancelled ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Accepted"
                }).then(res => {
                  swal("Waiting For Other User Response", {
                    title: "Pending",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
            })
          })
        } else {
        }
      });
  }

  acceptSayNo(index) {
    const id = recievedRequests.acceptedIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Cancel This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            meetingUserSay: "No"
          }).then(res => {
            firebase.firestore().collection('meetings').doc(id).get().then(doc => {
              if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Done"
                }).then(res => {
                  swal("Both Users Accepted Meeting", {
                    title: "Meeting Done",
                    icon: "success",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Cancelled"
                }).then(res => {
                  swal("Both Users Cancelled Meeting", {
                    title: "Meeting Cancelled ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "Yes" && doc.data().userSay === "No") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else if (doc.data().meetingUserSay === "No" && doc.data().userSay === "Yes") {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Complicated"
                }).then(res => {
                  swal("Differentiate Answers By Users", {
                    title: "Meeting Complicated ",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
              else {
                firebase.firestore().collection('meetings').doc(id).update({
                  status: "Accepted"
                }).then(res => {
                  swal("Waiting For Other User Response", {
                    title: "Pending",
                    icon: "warning",
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000)
                }).catch(error => {
                  swal("Check Your Internet Connect & Try Again", {
                    title: "Error",
                    icon: "success",
                  });
                })
              }
            })
          })
        } else {
        }
      });
  }

  deleteRecievedCancelled(index) {
    const id = recievedRequests.cancelledIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Delete This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).delete().then(res => {
            swal("Deleted Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Deleting!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {

        }
      });
  }

  cancelToAccept(index) {
    const id = recievedRequests.cancelledIds[index];
    swal({
      title: "Are you sure?",
      text: "Did You Really Want To Accept This Meeting?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.firestore().collection('meetings').doc(id).update({
            status: "Accepted"
          }).then(res => {
            swal("Updated Successfully", {
              title: "Congratulations ",
              icon: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }).catch(error => {
            swal("Error While Updation!", {
              title: "Sorry ",
              icon: "warning",
            });
          })
        } else {
        }
      });
  }

  rateRecvDone(index) {
    const id = recievedRequests.doneIds[index];
    this.setState({
      recievedRateId: id
    })
  }

  rateRecieved() {
    const { recievedRateId, rating } = this.state;
    firebase.firestore().collection('meetings').doc(recievedRateId).get().then(doc => {
      // console.log(doc.data().meetingUserId);
      firebase.firestore().collection('users').doc(doc.data().meetingUserId).get().then(res => {
        // myRatings.push(res.data().ratings);
        firebase.firestore().collection('users').doc(doc.data().meetingUserId).update({
          ratings: [...res.data().ratings, rating]
        }).then(result => {
          swal("You Rate " + rating + " Stars To " + res.data().fullName, {
            title: "Rating Done",
            icon: "success",
          });
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        })
      })
    })
  }
  //End Recieved Request Functions

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  render() {
    const { name, title, sendedRequestsFlag, recievedRequestsFlag, rating } = this.state;
    return (
      <div className="pt-5 pr-3 Dashboard">
        {!localStorage.getItem('user_id') && this.props.history.push("/")}
        <nav class="navbar navbar-dark bg-dark header float-right">
        <NavLink to='/profile'><button className="btn btn-primary mr-2">Profile</button></NavLink>
        <div className="float-right mt-1"><SignOut/></div>   
        </nav>
        <div className='float-left'><img src={Logo} alt='logo'/></div>
        <br />
        <div>
          {title && <h3 className='text-dark'>{name}, you haven't done any meeting yet</h3>}
          <br />
          <NavLink to='/meeting'><button className='btn btn-primary px-5'>Set A Meeting</button></NavLink>
        </div>

        {/* Sended Requests Toogles */}
        {!title && <div class="card mt-5">
          <div class="card-header" data-toggle="collapse" data-target="#sendedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link float-left" type="button" data-toggle="collapse" data-target="#sendedRequests" aria-expanded="false" aria-controls="collapseExample">
                Sended Request
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>}

        {/* Pending Requests Toogles */}
        <div class="card mt-3 collapse" id="sendedRequests">
          <div class="card-header bg-warning" data-toggle="collapse" data-target="#pendingRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" data-toggle="collapse" data-target="#pendingRequests" aria-expanded="false" aria-controls="collapseExample">
                Pending
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {sendedRequestsFlag && sendedRequests.pending.map((value, index) => {
          return <div class="collapse" id="pendingRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-warning"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.sendPendingToCancel.bind(this, index)}>Cancel</button>
              </div>
            </div>
          </div>
        })}

        {/* Accepted Requests Toogles */}
        <div class="card mt-3 collapse" id="sendedRequests">
          <div class="card-header bg-success" data-toggle="collapse" data-target="#acceptedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#acceptedRequests" aria-expanded="false" aria-controls="collapseExample">
                Accepted
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {sendedRequestsFlag && sendedRequests.accepted.map((value, index) => {
          return <div class="collapse" id="acceptedRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-success"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.sendAcceptToCancel.bind(this, index)}>Cancel</button>
                {/* {value.meetingDate < currentDate && <div><button className="btn btn-secondary float-right px-5 mt-1 mr-1" onClick={this.sendAcceptSayNo.bind(this, index)}>No</button><button className="btn btn-primary float-right px-5 mt-1 mr-1" onClick={this.sendAcceptSayYes.bind(this, index)}>Yes</button></div>} */}
                <button className="btn btn-secondary float-right px-5 mt-1 mr-1" onClick={this.sendAcceptSayNo.bind(this, index)}>No</button>
                <button className="btn btn-primary float-right px-5 mt-1 mr-1" onClick={this.sendAcceptSayYes.bind(this, index)}>Yes</button>
              </div>
            </div>
          </div>
        })}

        {/* Cancelled Requests Toogles */}
        <div class="card mt-3 collapse" id="sendedRequests">
          <div class="card-header bg-danger" data-toggle="collapse" data-target="#cancelledRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#cancelledRequests" aria-expanded="false" aria-controls="collapseExample">
                Cancelled
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {sendedRequestsFlag && sendedRequests.cancelled.map((value, index) => {
          return <div class="collapse" id="cancelledRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-danger"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.sendDeleteCancelled.bind(this, index)}>Delete</button>
                <button className="btn btn-warning float-right px-5 mt-1 mr-1" onClick={this.sendRequestAgain.bind(this, index)}>Send Request</button>
              </div>
            </div>
          </div>
        })}

        {/* Complicated Requests Toogles */}
        <div class="card mt-3 collapse" id="sendedRequests">
          <div class="card-header bg-secondary" data-toggle="collapse" data-target="#complicatedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#complicatedRequests" aria-expanded="false" aria-controls="collapseExample">
                Complicated
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {sendedRequests && sendedRequests.complicated.map((value, index) => {
          return <div class="collapse" id="complicatedRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-secondary"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
              </div>
            </div>
          </div>
        })}

        {/* Done Requests Toogles */}
        <div class="card mt-3 collapse" id="sendedRequests">
          <div class="card-header bg-primary" data-toggle="collapse" data-target="#doneRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#doneRequests" aria-expanded="false" aria-controls="collapseExample">
                Done
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {sendedRequestsFlag && sendedRequests.done.map((value, index) => {
          return <div class="collapse" id="doneRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-primary"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-dark float-right px-5 mt-1 mr-1" data-toggle="modal" data-target="#myModal2" onClick={this.sendRateDone.bind(this, index)}>Rate</button>
              </div>
            </div>
          </div>
        })}

        <div className="container">
          <div class="modal fade" id="myModal2" role="dialog">
            <div class="modal-dialog modal-sm">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close float-right" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body mystars">
                  <StarRatingComponent
                    name="rate1"
                    starCount={5}
                    value={rating}
                    onStarClick={this.onStarClick.bind(this)}
                  />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-dark" data-dismiss="modal" onClick={this.rateSended}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recieved Requests Toogles */}
        {!title && <div class="card mt-5">
          <div class="card-header" data-toggle="collapse" data-target="#recievedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link float-left" type="button" data-toggle="collapse" data-target="#recievedRequests" aria-expanded="false" aria-controls="collapseExample">
                Recieved Request
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>}

        {/* Pending Requests Toogles */}
        <div class="card mt-3 collapse" id="recievedRequests">
          <div class="card-header bg-warning" data-toggle="collapse" data-target="#rpendingRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" data-toggle="collapse" data-target="#rpendingRequests" aria-expanded="false" aria-controls="collapseExample">
                Pending
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {recievedRequestsFlag && recievedRequests.pending.map((value, index) => {
          return <div class="collapse" id="rpendingRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-warning"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.pendingToCancel.bind(this, index)}>Cancel</button>
                <button className="btn btn-success float-right px-5 mt-1 mr-1" onClick={this.pendingToAccept.bind(this, index)}>Accept</button>
              </div>
            </div>
          </div>
        })}

        {/* Accepted Requests Toogles */}
        <div class="card mt-3 collapse" id="recievedRequests">
          <div class="card-header bg-success" data-toggle="collapse" data-target="#racceptedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#racceptedRequests" aria-expanded="false" aria-controls="collapseExample">
                Accepted
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {recievedRequestsFlag && recievedRequests.accepted.map((value, index) => {
          return <div class="collapse" id="racceptedRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-success"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.acceptToCancel.bind(this, index)}>Cancel</button>
                {/* {value.meetingDate < currentDate && <div><button className="btn btn-secondary float-right px-5 mt-1 mr-1" onClick={this.acceptSayNo.bind(this, index)}>No</button><button className="btn btn-primary float-right px-5 mt-1 mr-1" onClick={this.acceptSayYes.bind(this, index)}>Yes</button></div>} */}
                <button className="btn btn-secondary float-right px-5 mt-1 mr-1" onClick={this.acceptSayNo.bind(this, index)}>No</button>
                <button className="btn btn-primary float-right px-5 mt-1 mr-1" onClick={this.acceptSayYes.bind(this, index)}>Yes</button>
              </div>
            </div>
          </div>
        })}

        {/* Cancelled Requests Toogles */}
        <div class="card mt-3 collapse" id="recievedRequests">
          <div class="card-header bg-danger" data-toggle="collapse" data-target="#rcancelledRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#rcancelledRequests" aria-expanded="false" aria-controls="collapseExample">
                Cancelled
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {recievedRequestsFlag && recievedRequests.cancelled.map((value, index) => {
          return <div class="collapse" id="rcancelledRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-danger"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-danger float-right px-5 mt-1 mr-1" onClick={this.deleteRecievedCancelled.bind(this, index)}>Delete</button>
                <button className="btn btn-success float-right px-5 mt-1 mr-1" onClick={this.cancelToAccept.bind(this, index)}>Accept</button>
              </div>
            </div>
          </div>
        })}

        {/* Complicated Requests Toogles */}
        <div class="card mt-3 collapse" id="recievedRequests">
          <div class="card-header bg-secondary" data-toggle="collapse" data-target="#rcomplicatedRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#rcomplicatedRequests" aria-expanded="false" aria-controls="collapseExample">
                Complicated
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {recievedRequestsFlag && recievedRequests.complicated.map((value, index) => {
          return <div class="collapse" id="rcomplicatedRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-secondary"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
              </div>
            </div>
          </div>
        })}

        {/* Done Requests Toogles */}
        <div class="card mt-3 collapse" id="recievedRequests">
          <div class="card-header bg-primary" data-toggle="collapse" data-target="#rdoneRequests" aria-expanded="false" aria-controls="collapseExample">
            <h5 class="mb-0">
              <button class="btn btn-link text-dark" type="button" data-toggle="collapse" data-target="#rdoneRequests" aria-expanded="false" aria-controls="collapseExample">
                Done
              </button>
              <i class="fas fa-caret-down float-right mt-2"></i>
            </h5>
          </div>
        </div>

        {recievedRequestsFlag && recievedRequests.done.map((value, index) => {
          return <div class="collapse" id="rdoneRequests">
            <div className="card mt-4 primary">
              <h6 className="card-header text-left text-dark bg-primary"><b>{value.username}</b> Want To Meet <b>{value.meetingUsername}</b></h6>
              <div className="card-body">
                <h6 className="card-title text-left"><b>Location : </b>{value.meetingLocationName}</h6>
                <h6 className="card-title text-left"><b>Date : </b>{value.meetingDate}</h6>
                <h6 className="card-title text-left"><b>Time : </b>{value.meetingTime}</h6>
                <h6 className="card-title text-left"><b>Status : </b>{value.status}</h6>
                <button className="btn btn-dark float-right px-5 mt-1 mr-1" data-toggle="modal" data-target="#myModal" onClick={this.rateRecvDone.bind(this, index)}>Rate</button>
              </div>
            </div>
          </div>
        })}

        <div className="container">
          <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog modal-sm">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close float-right" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body mystars">
                  <StarRatingComponent
                    name="rate1"
                    starCount={5}
                    value={rating}
                    onStarClick={this.onStarClick.bind(this)}
                  />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-dark" data-dismiss="modal" onClick={this.rateRecieved}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)