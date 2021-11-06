import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import HeaderComponent from "./components/layout/HeaderComponent";
import FooterComponent from "./components/layout/FooterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGitLabInEstimationIssuesComponent from "./components/ListGitLabInEstimationIssuesComponent";

import { Component } from "react";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Router>
          <HeaderComponent />
          <div className="democontainer">
            <Switch>
              <Route exact path={["/"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profxile" component={Profile} />
              <Route path="/user" component={BoardUser} />
              <Route path="/mod" component={BoardModerator} />
              <Route path="/admin" component={BoardAdmin} />

              <Route path="/view-gitlab-issues" component={ListGitLabInEstimationIssuesComponent}></Route>
            </Switch>
          </div>
        </Router>
        {/*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
