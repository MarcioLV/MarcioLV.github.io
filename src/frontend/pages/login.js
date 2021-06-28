import React from "react";
import { useLocation } from 'react-router-dom'

import "./style/login.css";
import LoginBox from "../components/LoginBox";

import config from "../config"

class Login extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   loading: true,
    //   error: false,
    // };
  }
  componentDidMount(){
  // login automatico para desarrollo
    const data = {
      username: 'marcio',
      password: 'marcio',
    };
    this.fetchLogin(data);
  }

  handleSubmit(user, pass) {
    if(!user || !pass){
      return alert("Rellenar todos los campos")
    }
    const data = {
      username: user,
      password: pass,
    };
    this.fetchLogin(data);
  }
  
  fetchLogin = async (data) => {
    try {
      const request = await fetch(
        `${config.api.url}:${config.api.port}/auth/login`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const response = await request.text();
      const response2 = await JSON.parse(response)
      if(response2.status === 400){
        alert("Datos Incorrenctos")
      }else{
        this.props.onLogin(response2.body, data.username)
      }
    } catch (err) {
      console.error("[ERROR]" + err);
    }
  };

  render() {
    // if(this.state.loading){
    //   // return <Loading />
    //   return "Loading..."
    // }
    // if(this.state.error){
    //   // return <Error />
    //   return 'Error'
    // }
    return (
      <div className="main">
        <div className="conteiner">
          <div className="page-name">
            <h1>RedSocial</h1>
            <h3>
              Comunicate y comparti con las personas que forman parte de tu vida
            </h3>
          </div>
          <LoginBox handleSubmit={this.handleSubmit.bind(this)} />
        </div>
      </div>
    );
  }
}

export default Login;
