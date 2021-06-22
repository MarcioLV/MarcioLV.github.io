import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Login from "../pages/login";
import Main from "../pages/Main";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_logged: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin(is_logged) {
    this.setState({ is_logged });
  }

  // PrivateRoute({ children, ...rest }) {
  //   console.log(children);
  //   console.log(rest);
  //   return (
  //     <Route
  //       {...rest}
  //       render={({ location }) => {
  //         console.log(this.state.is_logged);
  //         this.state.is_logged ? children : <Redirect to="/login" />;
  //       }}
  //     />
  //   );
  // }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" 
            // component={Main}
            render={()=>{
              return(
              this.state.is_logged ? <Main/> : <Redirect from="/" to="/login"/>
            )}}
          />
          <Route
            exact
            path="/login"
            // component={Login}
            render={() => <Login onLogin={this.handleLogin} />}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
