import axios from "axios";

//const POKER_PLANNING_API_BASE_URL = "http://localhost:8080/api/v1/pokerplanning";
const POKER_PLANNING_API_BASE_URL = "https://pokerplanning-backend.herokuapp.com/api/v1/pokerplanning";

// Add a request interceptor
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    const token = "Bearer " + user.accessToken;
    config.headers.Authorization = token;
  }

  return config;
});

class PokerPlanningService {
  getEmployees() {
    return axios.get(POKER_PLANNING_API_BASE_URL);
  }

  createEmployee(employee) {
    return axios.post(POKER_PLANNING_API_BASE_URL, employee);
  }

  getEmployeeById(employeeId) {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/" + employeeId);
  }

  updateEmployee(employee, employeeId) {
    return axios.put(POKER_PLANNING_API_BASE_URL + "/" + employeeId, employee);
  }

  deleteEmployee(employeeId) {
    return axios.delete(POKER_PLANNING_API_BASE_URL + "/" + employeeId);
  }

  viewGitLabIssues(projectId) {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/gitlab");
  }
  getUsers() {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/gitlab/users");
  }
  getCurrentUser() {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/currentuser");
  }
  loadVotedUserCount() {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/gitlab/votedusercounts");
  }
  assignAsModerator(userId) {
    return axios.put(POKER_PLANNING_API_BASE_URL + "/gitlab/assignAsModerator/" + userId);
  }

  removeFromModerator(userId) {
    return axios.put(POKER_PLANNING_API_BASE_URL + "/gitlab/removeFromModerator/" + userId);
  }
  updateUserVote(ticketNumber, vote) {
    return axios.get(POKER_PLANNING_API_BASE_URL + "/vote?ticketNumber=" + ticketNumber + "&vote=" + vote);
  }
}

export default new PokerPlanningService();
