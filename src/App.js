import React, { Component } from 'react';

import Routings from "./config/routing";
import './App.css';
import store from "./Redux/store";
import { Provider } from "react-redux";


class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Routings />
      </Provider>
    );
  }
}

export default App;
