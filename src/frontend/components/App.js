import React, { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Login from "../pages/login";
import Main from "../pages/Main";

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

  handleLogin(token, username) {
    this.setState({ is_logged: true, user: { 
      token: token, username: username } });
  }

  buscarPagina() {
    return this.state.is_logged ? (
      <Main user={this.state.user} />
    ) : (
      <Redirect from="/" to="/login" />
    );
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => this.buscarPagina()} />
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
        </Switch>
      </BrowserRouter>
    );
  }
}

// function handleLogin() {
//   provideAuth.signin()
// }

// function provideAuth() {
//   const [user, setUser] = useState(false);

//   const signin = () => {
//     setUser(true)
//     console.log(user);
//   }

//   return {
//     user,
//     signin
//   }
// }

// function PrivateRoute({ children, ...rest }) {
//   let auth = provideAuth.user;
//   return (
//     <Route
//       {...rest}
//       render={() =>
//         auth ? (
//           children
//         ) : (
//           <Redirect to="/login" />
//           // <div>loginloginloginloginlogin</div>
//         )
//       }
//     />
//   );
// }

export default App;
