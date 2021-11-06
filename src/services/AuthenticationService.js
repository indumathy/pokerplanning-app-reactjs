import axios from "axios";

/**
 * @Copyright by https://loizenai.com
 *        youtube loizenai
 */
//const API_URL = "http://localhost:8080/api/auth/";
const API_URL = "https://pokerplanning-backend.herokuapp.com/api/auth/";

class AuthenticationService {
  signin = (username, password) => {
    console.log(".....eeeeee......");
    return axios
      .post(API_URL + "signin", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  signOut() {
    localStorage.removeItem("user");
  }

  register = async (firstname, lastname, username, email, password) => {
    return axios.post("/api/auth/signup", {
      firstname,
      lastname,
      username,
      email,
      password,
    });
  };

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthenticationService();
