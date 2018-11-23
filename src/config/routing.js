import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import FbLogin from "../components/FbLogin/FbLogin";
import UserDetails from "../components/Details/UserDetails";
import Photos from "../components/Photos/Photos";
import Beverages from "../components/Beverages/Beverages";
import CurrentLocation from "../components/Location/Location";
import Dashboard from "../components/Dashboard/Dashboard";
import Meeting from "../components/Meeting/Meeting";
import MeetingPoint from "../components/MeetingPoint/MeetingPoint";
import DateAndTime from "../components/DateAndTime/DateAndTime";
import Direction from "../components/Direction/Direction";
import Profile from "../components/Profile/Profile";
import PersonalInformation from "../components/PersonalInformation/PersonalInformation";
import ProfileBeverages from "../components/ProfileBeverages/ProfileBeverages";
import ProfileMeetingTimings from "../components/ProfileMeetingTimings/ProfileMeetingTimings";
import ProfilePhotos from "../components/ProfilePhotos/ProfilePhotos";
import _404 from "../components/404/404";


const Routers = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={FbLogin} />
          <Route path="/details" component={UserDetails} />
          <Route path="/photos" component={Photos} />
          <Route path="/beverages" component={Beverages} />
          <Route path="/location" component={CurrentLocation} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/meetingpoint" component={MeetingPoint} />  
          <Route path="/dateandtime" component={DateAndTime} />  
          <Route path="/direction" component={Direction} /> 
          <Route path="/profile" component={Profile} />
          <Route path="/personalinfo" component={PersonalInformation} />  
          <Route path="/profilebeverages" component={ProfileBeverages} />  
          <Route path="/profilemeetingtimings" component={ProfileMeetingTimings} />
          <Route path="/profilephotos" component={ProfilePhotos} />         
          <Route component={_404} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  )
}

export default Routers