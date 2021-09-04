import React, { useState } from "react";

import "./style/RegistroModal.css";

function RegistroModal(props) {
  const closeModal = () => {
    props.closeModal();
  };

  const [data, setData] = useState({
    username: '',
    password: '',
    password2: ''
  })

  const handleSubmit = ()=>{
    if(!data.username || !data.password || !data.password2){
      return alert("Rellenar todos lo campos")
    }
    if(data.password !== data.password2){
      return alert("Contraseñas no coinciden")
    }
    props.handleSubmit(data)
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
          <input type="text" placeholder="Nombre Usuario" onChange={(e) => setData({...data, username: e.target.value})}/>
          <input type="password" placeholder="Contraseña" onChange={(e) => setData({...data, password: e.target.value})}/>
          <input type="password" placeholder="Repetir Contraseña" onChange={(e) => setData({...data, password2: e.target.value})}/>
        </div>
        <div className="registerModal-button">
          <button onClick={handleSubmit}>Registrarte</button>
        </div>
      </div>
    </div>
  );
}

export default RegistroModal;
