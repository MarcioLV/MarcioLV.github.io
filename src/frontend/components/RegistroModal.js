import React, { useState } from "react";

import "./style/RegistroModal.css";

function RegistroModal(props) {
  const { taken } = props;
  const [errReg, setErrReg] = useState(false);
  const [pass, setPass] = useState(false);
  const closeModal = () => {
    props.closeModal();
  };

  const [data, setData] = useState({
    username: "",
    password: "",
    password2: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!data.username || !data.password || !data.password2) {
      return setErrReg(true);
    }
    if (data.password !== data.password2) {
      return setPass(true);
    }
    const user = {
      username: data.username,
      password: data.password
    }
    props.handleSubmit(user);
  };

  const erraseTaken = () => {
    setErrReg(false);
    setPass(false);
    props.erraseTaken();
  };

  return (
    <div className="registerModal">
      <div className="registerModal-conteiner">
        <div className="registerModal-header">
          <div className="registerModal-header_titulo">
            <h1>Registrarte</h1>
            <p>Es rápido y fácil.</p>
          </div>
          <button className="closeButton" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="registerModal-inputs">
          <form>
            <small style={errReg || taken ? { visibility: "visible" } : {}}>
              {errReg
                ? "Rellena todos los campos"
                : "Nombre de usuario ocupado"}
            </small>
            <input
              type="text"
              placeholder="Nombre Usuario"
              onChange={(e) => setData({ ...data, username: e.target.value })}
              onClick={erraseTaken}
            />
            <small style={pass ? { visibility: "visible" } : {}}>
              Las contraseñas no coinciden
            </small>
            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              onClick={erraseTaken}
            />
            <input
              type="password"
              placeholder="Repetir Contraseña"
              onChange={(e) => setData({ ...data, password2: e.target.value })}
              onClick={erraseTaken}
            />
            <div className="registerModal-button">
              <button type="submit" onClick={(e)=>handleSubmit(e)}>Registrarte</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistroModal;
