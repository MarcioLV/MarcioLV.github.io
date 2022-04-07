import React, { useState } from "react";

import "./style/login.css";
import LoginBox from "../components/LoginBox";
import { fetchLogin } from "../utils/fetch";

function Login(props) {
  const [errLog, setErrLog] = useState(false);

  const handleSubmit = (user, pass) => {
    const data = {
      username: user,
      password: pass,
    };
    tryLogin(data);
  };

  const tryLogin = async (data) => {
    const response = await fetchLogin(data);
    if (response.status === 400) {
      setErrLog(true);
    } else {
      props.onLogin(response.body);
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
          <LoginBox
            handleSubmit={handleSubmit}
            errLog={errLog}
            setErrLog={setErrLog}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
