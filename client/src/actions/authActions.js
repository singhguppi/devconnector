import { GET_ERRORS, SET_CURRENT_USER } from "./type";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register User

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/users/register", userData)
    .then(res => {
      history.push("/login");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login user - Get user token

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // save to local storage

      const { token } = res.data;

      //set token to ls
      localStorage.setItem("jwtToken", token);
      // set token to auth Header

      setAuthToken(token);

      // decode token to user data
      const decoded = jwt_decode(token);
      // set current user

      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set logged user

export const setCurrentUser = decode => {
  return {
    type: SET_CURRENT_USER,
    payload: decode
  };
};

// Log user out

export const logoutUser = () => dispatch => {
  //remove token from local storage

  localStorage.removeItem("jwtToken");

  // Remove auth header for future request

  setAuthToken(false);

  // set current user to {} which will also set isauthenticated to flase

  dispatch(setCurrentUser({}));

  window.location.href = "/login";
};
