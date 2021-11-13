import React, { Component } from "react";
import logo from "../../logo.svg";
import userIcon from "../../png/moreUser.gif";
import { Offcanvas, Card, ListGroup, Button } from "react-bootstrap";
import { BrowserRouter as Router, Link } from "react-router-dom";
// import AuthVerify from "./common/auth-verify";
import EventBus from "../../common/EventBus";

import AuthService from "../../services/auth.service";
import PokerPlanningService from "../../services/PokerPlanningService";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "hsl(11deg 100% 62%)",
    color: "hsl(11deg 100% 62%)",
    minWidth: "16px",
    height: "16px",
    borderRadius: "50%",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { showUserDialog: false, showModeratorBoard: false, showAdminBoard: false, currentUser: undefined, users: [], moderatorName: null, showAddAsModerator: false };
    this.setShow = this.setShow.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logOut = this.logOut.bind(this);
    this.frequentRefresh = this.frequentRefresh.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.removeFromModerator = this.removeFromModerator.bind(this);
    this.assignAsModerator = this.assignAsModerator.bind(this);
  }
  setShow = (flag) => {
    this.setState({ showUserDialog: flag });
  };

  assignAsModerator() {
    PokerPlanningService.assignAsModerator(this.state.currentUser.username).then((res) => {
      this.loadUser();
    });
  }
  removeFromModerator() {
    PokerPlanningService.removeFromModerator(this.state.currentUser.username).then((res) => {
      this.loadUser();
    });
  }

  handleClose = () => this.setShow(false);
  handleShow = () => this.setShow(true);
  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: false,
        showAdminBoard: false,
      });
      this.loadUser();
      this.frequentRefresh();
    } else {
      this.logOut();
      this.setState({
        currentUser: null,
        showModeratorBoard: false,
        showAdminBoard: false,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }
  loadUser() {
    PokerPlanningService.getUsers().then((res) => {
      this.setState({ showAddAsModerator: false });
      const moderatorName = res.data.filter((user) => user.isModerator === true);
      if (moderatorName != null && moderatorName.length > 0) {
        if (moderatorName[0].userName == this.state.currentUser.username) {
          this.setState({ showAddAsModerator: true });
        }
        this.setState({ moderatorName: moderatorName[0].userName });
      } else {
        this.setState({ moderatorName: null });
      }
      this.setState({ users: res.data });
    });
  }

  frequentRefresh() {
    const interval = setInterval(() => {
      this.loadUser();
    }, 1000);
    return () => clearInterval(interval);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div className="headerClass">
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div>
              <img src={logo} className="App-logo" alt="logo" />
              <span className="App-title">Poker Planning</span>

              {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <Link to={"/view-gitlab-issues"} className="nav-link">
                    {currentUser.username}
                  </Link>

                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                  <img src={userIcon} className="rightCorner" alt="logo" onClick={() => this.handleShow()} />
                </div>
              ) : (
                <div className="rightCorner">
                  <a href="/register" className="nav-link">
                    signup
                  </a>
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>
        <Offcanvas show={this.state.showUserDialog} onHide={this.handleClose} placement="end" backdrop={false}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {" "}
              <div className="ms-2 me-auto">
                <div className="fw-bold">Planning Poker</div>
                <div className="mildText">
                  {" "}
                  {this.state.moderatorName && <span className="moderatorLabel">moderated by {this.state.moderatorName}</span>}
                  {!this.state.moderatorName && <span className="moderatorLabel">No moderator assigned </span>}
                </div>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card className="votersCard">
              <Card.Body>
                <Card.Title>Voters</Card.Title>
                <Card.Text>
                  {this.state.showAddAsModerator == true && (
                    <span>
                      {" "}
                      <Button variant="outline-primary" onClick={() => this.removeFromModerator()}>
                        Remove from moderator
                      </Button>
                    </span>
                  )}
                  {this.state.showAddAsModerator == false && (
                    <span>
                      {" "}
                      <Button variant="primary" onClick={() => this.assignAsModerator()}>
                        Become as moderator
                      </Button>{" "}
                    </span>
                  )}
                </Card.Text>
              </Card.Body>
              <ListGroup variant="flush">
                {this.state.users.map((issue) => (
                  <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold userNameIcon">
                        {issue.isModerator && (
                          <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                            <Avatar alt={issue.userName} src="/static/images/avatar/1.jpg" />
                          </StyledBadge>
                        )}
                        {!issue.isModerator && <Avatar sx={{ bgcolor: green[500] }} alt={issue.userName} src="/broken-image.jpg" />}

                        <div className="ms-2 me-auto">
                          <div className="fw-bold  ">{issue.userName}</div>
                          {issue.isModerator && <span className="moderatorLabel">moderator</span>}
                        </div>
                      </div>
                    </div>
                    {issue.voted && !issue.showVotedPoint && <CheckCircleRoundedIcon sx={{ fontSize: 40, color: green[500] }} />}
                    {issue.voted && issue.showVotedPoint && <div className="votedPoint">{issue.votedPoint}</div>}
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  }
}

export default HeaderComponent;
