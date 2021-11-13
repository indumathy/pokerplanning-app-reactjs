import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import card0 from "../png/0.PNG";
import card1 from "../png/1.png";
import card2 from "../png/2.png";
import card3 from "../png/3.png";
import card5 from "../png/5.png";
import card8 from "../png/8.png";
import card13 from "../png/13.png";
import card20 from "../png/20.png";
import card40 from "../png/40.png";
import card100 from "../png/100.png";
import userIcon from "../png/user4.gif";
import cardInfinity from "../png/infinity.png";
import cardBreak from "../png/break.png";
import done from "../png/done4.png";
import resetall from "../png/reset.png";

import Pause from "./timer/Pause";
import Play from "./timer/Play";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Animated } from "react-native";
//This Component is a child Component of Customers Component
import PokerPlanningService from "../services/PokerPlanningService";
// Import react-circular-progressbar module and styles
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// Animation
import ChangingProgressProvider from "./usercounter/ChangingProgressProvider";

// Radial separators

export default class PlanningCardDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: null,
      selectedTicket: null,
      currentUser: [],
      searchSelectedVal: null,
      playing: false,
      isPlaying: false,
      showUserDialog: false,
      votedUsersCountData: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getCustomerDetails = this.getCustomerDetails.bind(this);
    this.getData = this.getData.bind(this);
    this.setIsPlaying = this.setIsPlaying.bind(this);
    this.setShow = this.setShow.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.frequentRefresh = this.frequentRefresh.bind(this);
    this.loadVotedUserCount = this.loadVotedUserCount.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }
  setShow = (flag) => {
    this.showUserDialog = flag;
  };

  frequentRefresh() {
    const interval = setInterval(() => {
      this.loadVotedUserCount();
      this.getCurrentUser();
    }, 1000);
    return () => clearInterval(interval);
  }

  loadVotedUserCount() {
    PokerPlanningService.loadVotedUserCount().then((res) => {
      this.setState({ votedUsersCountData: res.data });
    });
  }

  getCurrentUser() {
    PokerPlanningService.getCurrentUser().then((res) => {
      if (this.state.currentUser === [] || this.state.currentUser.isModerator !== res.data.isModerator) {
        this.setState({ currentUser: res.data });
      }
    });
  }
  handleClose = () => this.setShow(false);
  handleShow = () => this.setShow(true);

  handlePlayerClick = () => {
    if (!this.state.playing) {
      this.setState({ playing: true });
    } else {
      this.setState({ playing: false });
    }
    this.setIsPlaying();
  };
  resetAllVotes = () => {
    PokerPlanningService.resetAllUsersVote();
    this.state.cardNumber = null;
  };
  showScore = () => {
    PokerPlanningService.showAllUsersVote();
  };
  //Function which is called when the component loads for the first time
  componentDidMount() {
    this.getCustomerDetails(this.props.val);
    this.getData(this.props.data);
    this.frequentRefresh();
  }

  //Function which is called whenver the component is updated
  componentDidUpdate(prevProps) {
    //get Customer Details only if props has changed
    if (this.props.val !== prevProps.val) {
      this.setState({ selectedTicket: this.props.val });
      this.getCustomerDetails(this.props.val);
    }
    if (this.props.val !== prevProps.val) {
      this.getData(this.props.data);
    }
  }

  componentWillReceiveProps(nextProps) {
    //  console.log("---------22222.............." + nextProps);
  }
  //Function to Load the customerdetails data from json.
  getCustomerDetails(issue) {
    if (issue != null) {
      if (this.props.data != null) {
        this.props.data.map((iss, index) => {
          if (iss.value == this.props.val.iid) {
            this.state.searchSelectedVal = this.state.data[index];
          }
        });
      }
    }

    this.setState({ customerDetails: issue });
  }

  getData(propData) {
    this.setState({ data: propData });
  }
  setIsPlaying() {
    console.log("...........isPlaying..............." + this.state.isPlaying);
    this.setState({ isPlaying: !this.state.isPlaying });
  }
  handleChange(e) {
    console.log("value change!!,,,,," + e);
    this.props.updateStateProp(e);
    if (e == null) {
      this.setState({ searchSelectedVal: null });
    } else {
      this.setState({ searchSelectedVal: e });
    }
  }

  render() {
    if (!this.state.data || this.state.data.length == 0)
      return (
        <>
          <div>
            <ul>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
              <liprocessingcircle></liprocessingcircle>
            </ul>
          </div>
        </>
      );
    return (
      <div className="customerdetails">
        {this.state.currentUser != null && this.state.currentUser.isModerator && (
          <div className="parent1 searchHeader">
            <div className="diva2">
              <Select
                options={this.state.data}
                className="basic-single selectStyle"
                classNamePrefix="search..."
                value={this.state.searchSelectedVal}
                isClearable="true"
                isSearchable="true"
                onChange={this.handleChange}
              />
            </div>
            {this.state.searchSelectedVal != null && (
              <div className="playerStatus">
                <div className="player">{this.state.playing ? <Pause onPlayerClick={this.handlePlayerClick} /> : <Play onPlayerClick={this.handlePlayerClick} />}</div>{" "}
                <div>
                  {this.state.playing ? <div>{this.state.playing ? <img src={resetall} className="done resetAllIcon" alt="logo" onClick={() => this.resetAllVotes()} /> : <div />}</div> : <div />}
                </div>{" "}
                <div>{this.state.playing ? <img src={done} className="done" alt="logo" onClick={() => this.showScore()} /> : <div />}</div>{" "}
              </div>
            )}
          </div>
        )}
        {this.state.currentUser != null && !this.state.currentUser.isModerator && (
          <div className="nonModeratorTicketHeaderOuter">
            {!this.state.selectedTicket && <div>No tikets assigned by the moderator yet </div>}
            {this.state.selectedTicket && (
              <div className="nonModeratorTicketHeaderInner">
                <Button variant="info">
                  {" "}
                  <a href={`https://gitlab2.vacos.de/erp/vacos.erp/-/issues/${this.state.selectedTicket.iid}`} className="linkButton" target="_blank">
                    {this.state.selectedTicket.iid}
                  </a>
                </Button>{" "}
                <div className="nonModeratorTicketHeaderInnerTitle">{this.state.selectedTicket.title} </div>
              </div>
            )}
          </div>
        )}{" "}
        <div className="parent">
          <div className="div1" onClick={this.updateUserVote(0)}>
            {" "}
            <img src={card0} className={this.state.cardNumber === 0 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>

          <div className="div2" onClick={this.updateUserVote(1)}>
            {" "}
            <img src={card1} className={this.state.cardNumber === 1 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div3" onClick={this.updateUserVote(2)}>
            {" "}
            <img src={card2} className={this.state.cardNumber === 2 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div4" onClick={this.updateUserVote(3)}>
            {" "}
            <img src={card3} className={this.state.cardNumber === 3 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div5" onClick={this.updateUserVote(5)}>
            {" "}
            <img src={card5} className={this.state.cardNumber === 5 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div6" onClick={this.updateUserVote(8)}>
            {" "}
            <img src={card8} className={this.state.cardNumber === 8 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div7" onClick={this.updateUserVote(13)}>
            {" "}
            <img src={card13} className={this.state.cardNumber === 13 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div8" onClick={this.updateUserVote(20)}>
            {" "}
            <img src={card20} className={this.state.cardNumber === 20 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div9" onClick={this.updateUserVote(40)}>
            {" "}
            <img src={card40} className={this.state.cardNumber === 40 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div10" onClick={this.updateUserVote(100)}>
            {" "}
            <img src={card100} className={this.state.cardNumber === 100 ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div11" onClick={this.updateUserVote("break")}>
            {" "}
            <img src={cardBreak} className={this.state.cardNumber === "break" ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
          <div className="div12" onClick={this.updateUserVote("???")}>
            {" "}
            <img src={cardInfinity} className={this.state.cardNumber === "???" ? "pokercardSelected" : "pokercard"} alt="logo" />{" "}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <CountdownCircleTimer
            isPlaying={this.state.isPlaying}
            duration={10}
            colors={[
              ["#004777", 0.4],
              ["#F7B801", 0.4],
              ["#A30000", 0.2],
            ]}
            onComplete={() => [true]}
          >
            {({ remainingTime, animatedColor }) => <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>{remainingTime}</Animated.Text>}
          </CountdownCircleTimer>

          <div label="Default animation speed" style={{ width: "22%", paddingLeft: 30 }}>
            <ChangingProgressProvider values={[0, 3, 6, 8, 10]}>
              {(percentage) => (
                <CircularProgressbarWithChildren value={this.state.votedUsersCountData.percentageVoted}>
                  {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                  <img src={userIcon} style={{ width: 60, marginTop: -25 }} alt="logo" />{" "}
                  <div style={{ fontSize: 25, marginTop: -5 }}>
                    <strong>
                      {this.state.votedUsersCountData.votedUserCount}/{this.state.votedUsersCountData.totalUserCount}{" "}
                    </strong>{" "}
                  </div>
                </CircularProgressbarWithChildren>
              )}
            </ChangingProgressProvider>
          </div>
        </div>
      </div>
    );
  }

  updateUserVote(voteVal) {
    return () => {
      console.log(".......slect-....." + this.state.searchSelectedVal);
      if (this.state.searchSelectedVal != null && this.state.isPlaying == true) {
        PokerPlanningService.updateUserVote(this.state.searchSelectedVal.iid, voteVal);
        this.setState({ cardNumber: voteVal });
      }
    };
  }
}
