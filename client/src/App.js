import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Register from "./components/auth/Register";
import CreateProfile from "./components/create-profile/CreateProfile";
import Login from "./components/auth/Login";
import EditProfile from "./components/edit-profile/EditProfile";
import PrivateRoute from "./components/common/PrivateRoute";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import { clearCurrentProfile } from "./actions/profileActions";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
if (localStorage.jwtToken) {
  //set auth token header auth

  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and exp;

  const decoded = jwt_decode(localStorage.jwtToken);

  // set user and is authenticated

  store.dispatch(setCurrentUser(decoded));

  // check for expired token

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //Logout user
    store.dispatch(logoutUser());
    // clear current profile
    store.dispatch(clearCurrentProfile());
  }
}
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profile/:handle" component={Profile} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path="/create-profile"
              component={CreateProfile}
            ></PrivateRoute>
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path="/edit-profile"
              component={EditProfile}
            ></PrivateRoute>
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path="/add-experience"
              component={AddExperience}
            ></PrivateRoute>
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path="/add-education"
              component={AddEducation}
            ></PrivateRoute>
          </Switch>
          <Switch>
            <PrivateRoute exact path="/feed" component={Posts}></PrivateRoute>
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path="/post/:id"
              component={Post}
            ></PrivateRoute>
          </Switch>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
