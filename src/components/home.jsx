import React, { Component } from "react";
import PokerPlanningService from "../services/PokerPlanningService";
import { Button, Card, Spinner } from "react-bootstrap";
class ListEmployeeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
    };
    this.addEmployee = this.addEmployee.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.viewGitLabIssues = this.viewGitLabIssues.bind(this);
  }

  deleteEmployee(id) {
    PokerPlanningService.deleteEmployee(id).then((res) => {
      this.setState({ employees: this.state.employees.filter((employee) => employee.id !== id) });
    });
  }
  viewEmployee(id) {
    this.props.history.push(`/view-employee/${id}`);
  }
  editEmployee(id) {
    this.props.history.push(`/add-employee/${id}`);
  }

  componentDidMount() {
    PokerPlanningService.getEmployees().then((res) => {
      this.setState({ employees: res.data });
    });
  }

  addEmployee() {
    this.props.history.push("/add-employee/_add");
  }

  viewGitLabIssues() {
    this.props.history.push("/view-gitlab-issues");
  }
  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.viewGitLabIssues}>
          {" "}
          Vacos.Erp::InEstimation
        </button>

        <Spinner animation="grow" variant="primary" className="spinnerP1" />
      </div>
    );
  }
}

export default ListEmployeeComponent;
