import React, { useState } from "react";

import Registro from "./Registro";

import "./style/LoginBox.css";

function LoginBox(props) {
  const {errLog, setErrLog} = props

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dataInc, setDataInc] = useState(false)

  //modal
  const [isOpened, setOpened] = useState(false);
  const openModal = () => {
    setOpened(true);
  };
  const closeModal = () => {
    setOpened(false);
  };
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      return setDataInc(true)
    }
    props.handleSubmit(username, password);
  };

  const handleSubmitReg = (user) => {
    props.handleSubmit(user.username, user.password);
  };

  const erraseError = () => {
    setDataInc(false)
    setErrLog(false)
    setErrLog(false)
  }

  return (
    <div className="login-box">
      <div className="login-box-conteiner">
        <div className="login-box-info">
          <form>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              onClick={erraseError}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onClick={erraseError}
            />
            <small style={errLog || dataInc ? { visibility: "visible" } : {}}>
              {errLog
                ? "Datos incorrectos"
                : "Rellenar todos los campos"}
            </small>
            <button type="submit" onClick={(e) => handleSubmit(e)}>Iniciar sesión</button>
          </form>
        </div>
        <div className="register">
          <button onClick={() => openModal()}>Crear cuenta nueva</button>
        </div>
      </div>
      <Registro
        isOpened={isOpened}
        onClose={closeModal}
        handleSubmitReg={(e) => handleSubmitReg(e)}
      />
    </div>
  );
}

export default LoginBox;
