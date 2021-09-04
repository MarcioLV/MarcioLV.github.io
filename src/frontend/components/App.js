import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import config from "../config";

import NotFound from "./NotFound";
import Login from "../pages/login";
import Main from "../pages/Main";
import Perfil from "../pages/Perfil";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_logged: false,
      user: {
        username: null,
        token: null,
      },
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentDidMount() {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    if (token) {
      const user = {
        _id: userId,
        token: token
      }
      this.handleLogin(user);
    }
  }

  handleLogin = async (user) => {
    let userAvatar;
    let username
    try {
      const request = await fetch(
        `${config.api.url}:${config.api.port}/user/${user._id}`
      );
      const response = await request.text();
      const response2 = await JSON.parse(response);
      userAvatar = response2.body.avatar;
      username = response2.body.username;
    } catch (err) {
      console.error("[ERROR]" + err);
    }
    sessionStorage.setItem("token", user.token);
    sessionStorage.setItem("userId", user._id);
    this.setState({
      is_logged: true,
      user: {
        token: user.token,
        username: username,
        avatar: userAvatar,
        _id: user._id,
      },
    });
  };

  handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    this.setState({
      is_logged: false
    });
  }

  main() {
    return this.state.is_logged ? (
      <Main user={this.state.user} handleLogout={()=>this.handleLogout()} />
    ) : (
      <Redirect to="/login" />
    );
  }

  perfil(e) {
    return this.state.is_logged ? (
      <Perfil user={this.state.user} data={e} handleLogout={()=>this.handleLogout()}/>
    ) : (
      <Redirect to="/login" />
    );
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
          <Route exact path="/error" render={() => this.notFound()} />
          <Route exact path="/:userId" render={(e) => this.perfil(e)} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
