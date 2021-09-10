import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { setUser } from "../actions";

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
        Authorization: user.token,
      },
    };
    try {
      let response = await fetch(
        `${config.api.url}:${config.api.port}/user/${user._id}`,
        options
      );
      response = await response.text();
      response = await JSON.parse(response);
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
      }
    } catch (err) {
      console.error("[ERROR]" + err);
      // this.handleLogout()
    }
  };

  handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    this.setState({
      is_logged: false,
    });
  }

  main() {
    return this.state.is_logged ? (
      <Main handleLogout={() => this.handleLogout()} />
    ) : (
      <Redirect to="/login" />
    );
  }

  perfil(e) {
    if(this.state.is_logged){
      return <Perfil data={e} handleLogout={() => this.handleLogout()} />
    }
    else{
      return <Redirect to="/login" />
    }
    // return this.state.is_logged ? (
    //   <Perfil data={e} handleLogout={() => this.handleLogout()} />
    // ) : (
    //   <Redirect to="/login" />
    // );
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
          <Route exact path="/:userId" render={(e) => this.perfil(e)} />
          <Route render={() => this.notFound()} />
        </Switch>
      </BrowserRouter>
    );
  }
}

// export default App;
const mapDispatchToProps = {
  setUser,
};

export default connect(null, mapDispatchToProps)(App);
