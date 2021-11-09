import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { setUser } from "../actions";



import NotFound from "./NotFound";
import Login from "../pages/login";
import Main from "../pages/Main";
import Perfil from "../pages/Perfil";
import SearchPage from "../pages/SearchPage";
import Header from "./Header";

import "./style/App.css";

import config from "../../../config";
const API_URL = config.api.url

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
window.addEventListener("resize", () => {
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_logged: false,
      user: {
        username: null,
        token: null,
      },
      reloadMain: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentDidMount() {
    this.tryLogin();
  }

  async tryLogin() {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    if (token && userId) {
      const user = {
        _id: userId,
        token: token,
      };
      this.handleLogin(user);
    } else {
      this.setState({
        is_logged: false,
      });
    }
  }

  handleLogin = async (user) => {
    const options = {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    };
    try {
      let response = await fetch(
        `${API_URL}api/user/${user._id}`,
        options
      );
      response = await response.json();
      if (!response.error) {
        sessionStorage.setItem("token", user.token);
        sessionStorage.setItem("userId", user._id);
        this.props.setUser({
          user: {
            token: "Bearer " + user.token,
            username: response.body.username,
            avatar: response.body.avatar,
            _id: user._id,
          },
        });
        this.setState({
          is_logged: true,
        });
      }else{
        console.log(response);
      }
    } catch (err) {
      console.error("[ERROR]" + err);
      setTimeout(()=>{
        this.tryLogin()
      },[1000])
    }
  };

  handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    this.setState({
      is_logged: false,
    });
  }

  handleHome() {
    this.setState({ reloadMain: !this.state.reloadMain });
  }

  main() {
    return this.state.is_logged ? (
      <>
        <Header
          handleLogout={() => this.handleLogout()}
          handleHome={() => this.handleHome()}
        />
        <Main reload={this.state.reloadMain} />
      </>
    ) : (
      <Redirect to="/login" />
    );
  }

  perfil(e) {
    if (this.state.is_logged) {
      return (
        <>
          <Header handleLogout={() => this.handleLogout()} />
          <Perfil data={e} />
        </>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
  search(e) {
    if (this.state.is_logged) {
      return (
        <>
          <Header handleLogout={() => this.handleLogout()} />
          <SearchPage data={e}/>
        </>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
  notFound() {
    return this.state.is_logged ? <NotFound /> : <Redirect to="/login" />;
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => this.main()} />
          <Route
            exact
            path="/login"
            render={() =>
              this.state.is_logged ? (
                <Redirect to="/" />
              ) : (
                <Login onLogin={this.handleLogin} />
              )
            }
          />
          <Route exact path="/search/:search" render={(e) => this.search(e)} />
          <Route exact path="/perfil/:userId" render={(e) => this.perfil(e)} />
          <Route render={() => this.notFound()} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = {
  setUser,
};

export default connect(null, mapDispatchToProps)(App);
