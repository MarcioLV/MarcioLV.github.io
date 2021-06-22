import React, { useState } from "react";

import Registro from './Registro'

import "./style/LoginBox.css";

function LoginBox(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //modal
  const [isOpened, setOpened] = useState(false)
  const openModal = () =>{
    setOpened(true)
  }
  const closeModal = ()=>{
    setOpened(false)
  }
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSubmit(username, password)
  };
  return (
    <div className="login">
      <div className="login-box">
        <div className="login-info">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={(e) => handleSubmit(e)}>Iniciar sesión</button>
        </div>
        <div className="register">
          <button onClick={()=>openModal()}>Crear cuenta nueva</button>
        </div>
      </div>
      <Registro isOpened={isOpened} onClose={closeModal} />
    </div>
  );
}

export default LoginBox;
