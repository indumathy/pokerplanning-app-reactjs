import React, { Component } from "react";
import PokerPlanningService from "../services/PokerPlanningService";

import { Button, Card, Badge, Collapse } from "react-bootstrap";
import PlanningCardDetails from "./PlanningCardsDetails";
import { FcMenu } from "react-icons/fc";

import { Redirect } from "react-router-dom";
import AuthService from "../services/AuthenticationService";
class ListGitLabInEstimationIssuesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      issuesInEstimations: [],
      data: [],
      selectedCustomer: null,
      open: true,
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
    };

    this.addEmployee = this.addEmployee.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.viewGitLabIssues = this.viewGitLabIssues.bind(this);
    this.updateState = this.updateState.bind(this);

    this.frequentRefresh = this.frequentRefresh.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  updateState(e) {
    this.setState({ selectedCustomer: null });
  }
  deleteEmployee(id) {
    PokerPlanningService.deleteEmployee(id).then((res) => {
      this.setState({ issuesInEstimations: this.state.issuesInEstimations.filter((issue) => issue.id !== id) });
    });
  }
  viewEmployee(id) {
    this.props.history.push(`/view-employee/${id}`);
  }
  editEmployee(id) {
    this.props.history.push(`/add-employee/${id}`);
  }

  frequentRefresh() {
    const interval = setInterval(() => {
      this.getCurrentUser();
    }, 1000);
    return () => clearInterval(interval);
  }

  getCurrentUser() {
    PokerPlanningService.getCurrentUser().then((res) => {
      if (this.state.currentUser === [] || this.state.currentUser.isModerator != res.data.isModerator) {
        this.setState({ currentUser: res.data });
      }
    });
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });

    this.frequentRefresh();
    /* BackendService.getUserBoard().then(
      (response) => {
        this.setState({ content: response.data });
      },
      (error) => {
        console.log(error);
        this.setState({
          error: error.toString(),
        });
      }
    );

    */
    PokerPlanningService.viewGitLabIssues().then((res) => {
      this.setState({ issuesInEstimations: res.data });
      let result = Object.entries(res.data);
      let localData = [];
      result.map((item, index) => {
        const obj = { value: item[1].iid, label: item[1].iid + " - " + item[1].title };
        this.state.data.push(obj);
        this.setState({ data: this.state.data });
        console.log("key is:- ", item[0], " and value is:- ", item[1]);
      });
    });
  }

  addEmployee() {
    this.props.history.push("/add-employee/_add");
  }

  viewGitLabIssues() {
    this.props.history.push("/view-gitlab-issues");
    this.setState({ open: !this.state.open });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    return (
      <div>
        <Button onClick={() => this.viewGitLabIssues()} aria-controls="example-collapse-text" aria-expanded={this.state.open} variant="info" className="menu">
          <FcMenu className="iconMenu" />
          <Badge className="badge">{this.state.issuesInEstimations.length}</Badge>
        </Button>

        <div className="issuePokerPlanning">
          <Collapse in={this.state.open} dimension="width">
            <div className=" issueBoxOuter">
              {this.state.issuesInEstimations.map((issue) => (
                <Card
                  className={this.state.selectedCustomer != null && this.state.selectedCustomer.iid === issue.iid ? "issueBoxSelected" : "issueBox"}
                  key={issue.iid}
                  onClick={this.selectTicket(issue)}
                >
                  <Card.Header>{issue.title}</Card.Header>
                  <Card.Body>
                    <Card.Title>{issue.labels}</Card.Title>
                    <Card.Text></Card.Text>
                    <Button variant="info">
                      {" "}
                      <a href={`https://gitlab2.vacos.de/erp/vacos.erp/-/issues/${issue.iid}`} className="linkButton" target="_blank">
                        {issue.iid}
                      </a>
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Collapse>

          <div className="col-md-6">
            <PlanningCardDetails val={this.state.selectedCustomer} data={this.state.data} updateStateProp={this.updateState} />
          </div>
        </div>
      </div>
    );
  }

  selectTicket(issue) {
    return () => {
      console.log("......this.state.currentUser.isModerator...." + this.state.currentUser.isModerator);
      if (this.state.currentUser.isModerator) {
        this.setState({ selectedCustomer: issue });
      }
    };
  }
}

export default ListGitLabInEstimationIssuesComponent;
