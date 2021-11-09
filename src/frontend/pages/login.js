import React, {useState, useEffect} from "react";

import "./style/login.css";
import LoginBox from "../components/LoginBox";

import config from "../../../config";
const API_URL = config.api.url
console.log(API_URL);

function Login(props) {
  const [errLog, setErrLog] = useState(false)

  const handleSubmit = (user, pass) => {
    const data = {
      username: user,
      password: pass,
    };
    fetchLogin(data);
  };

  const fetchLogin = async (data) => {
    try {
      let response = await fetch(
        `${API_URL}api/auth/login`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      response = await response.json();
      if (response.status === 400) {
        setErrLog(true);
      } else {
        props.onLogin(response.body);
      }
    } catch (err) {
      alert("Hubo un error")
      console.error("[ERROR]" + err);
    }
  };
  
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-page-name">
          <h1>RedSocial</h1>
          <h3>
            Comunicate y comparti con las personas que forman parte de tu vida
          </h3>
        </div>
        <div className="login-page-input">
          <LoginBox handleSubmit={handleSubmit} errLog={errLog} setErrLog={setErrLog}/>
        </div>
      </div>
    </div>
  );
}

export default Login;
