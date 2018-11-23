import React from "react";
// import { NavLink } from "react-router-dom";
import Logo from '../../assets/logo.png'
import One from '../../assets/1.jpeg';
import Two from '../../assets/2.jpg';
import "./Meeting.css";
import firebase from "../../config/firebase";
import Swing from 'react-swing';
import '../../assets/bootstrap/bootstrap.min.css';
import { Direction } from 'swing';
import swal from 'sweetalert';
// import Carousel from 'nuka-carousel';
import { Carousel } from 'antd';

const users = [];
var sum = null;
var length = null;

export default class Meeting extends React.Component {
	constructor(props) {
		super(props);

		this.state = ({
			usersFound: false
		})


		const user_id = localStorage.getItem('user_id');
		firebase.firestore().collection('users').get().then(res => {
			res.forEach(doc => {
				if (doc.data().uid != user_id) {
					users.push(doc.data());
				}
			})
			this.setState({
				usersFound: true
			})
		}).catch(error => {
			this.setState({
				usersFound: false
			})
			swal("Users Not Found!", {
			});
		})

		this.remove = this.remove.bind(this);
		this.meet = this.meet.bind(this);
	}

	componentDidMount() {
		swal("Swipe Left or Click Left Button To See More Users & Swipe Right or Click Right Button To Meet Him/Her.", {
		});
	}

	remove(index) {
		document.getElementById('parent' + index).style.display = "none";
	}

	meet(index) {
		const { dummyUsers } = this.state;
		const fullName = localStorage.getItem('fullName');
		swal({
			title: "Are you sure?",
			text: fullName + " you want to meet him/her",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					swal("Now Set Meeting Location", {
						title: "User Selected",
						icon: "success",
					});
					localStorage.setItem('MeetingUser', JSON.stringify(users[index]));
					this.props.history.push("/meetingpoint")
				} else {
				}
			});
	}

	swiped = (e, index) => {
		const fullName = localStorage.getItem('fullName');
		let agreed;

		if (e.throwDirection.toString() === 'Symbol(RIGHT)') agreed = true;
		else agreed = false;

		if (agreed) {
			swal({
				title: "Are you sure?",
				text: fullName + " you want to meet him/her",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
				.then((willDelete) => {
					if (willDelete) {
						swal("Now Set Meeting Location", {
							title: "User Selected",
							icon: "success",
						});
						this.props.history.push("/meetingpoint");
						localStorage.setItem('MeetingUser', JSON.stringify(users[index]));
					} else {
						window.location.reload();
					}
				});
		}
		else {
			e.target.className += ' hidden';
		}
	};

	render() {
		const { usersFound } = this.state;
		const json = localStorage.getItem('MatchedUsers');
		const data = JSON.parse(json);

		return (
			<div className="text-dark Meeting">
				{/* <img src={Logo} alt='logo' /> */}
				{usersFound && <Swing
					config={{
						allowedDirections: [Direction.LEFT, Direction.RIGHT],
					}}
					className="stack"
					tagName="div"
					setStack={stack => this.setState({ stack: stack })}
					ref="stack"
				>
					{users.map((value, index) => {
						return <div className="card" ref="card1" throwout={e => this.swiped(e, index)} id={"parent" + index}>
							<div className="slider">
								<Carousel autoplay={true} dots={false} class="component">
									{value.userImages.map(val => {
										return <img src={val} className="images" />
									})}
								</Carousel>
							</div>
							<h4 className="fullName mt-1">{value.fullName}</h4>
							<h6 className="nickname">{value.nickname}</h6>
							<div className="buttons-parent mt-3">
								<button className="btn btn-danger buttons right" onClick={this.remove.bind(this, index)}><i class="fa fa-times"></i></button>
								<button className="btn btn-success buttons" onClick={this.meet.bind(this, index)}><i class="fas fa-check"></i></button>
							</div>
						</div>
					})}
				</Swing>}
			</div>
		);
	}
}

