import React, { useState } from "react";

import "./style/RegistroModal.css";

function RegistroModal(props) {
  const closeModal = () => {
    props.closeModal();
  };

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = ()=>{
    if(!name || !username || !password || !password2){
      return alert("Rellenar todos lo campos")
    }
    if(password !== password2){
      return alert("Contraseñas no coinciden")
    }
    props.handleSubmit({name: name, username: username, password:password})
  }

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
          <input type="text" placeholder="Nombre" onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Nombre Usuario" onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Repetir Contraseña" onChange={(e) => setPassword2(e.target.value)}/>
        </div>
        <div className="registerModal-button">
          <button onClick={handleSubmit}>Registrarte</button>
        </div>
      </div>
    </div>
  );
}

export default RegistroModal;
