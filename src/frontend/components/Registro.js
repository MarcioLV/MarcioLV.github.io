import React from "react";
import ReactDOM from 'react-dom'

import config from '../config'

import RegistroModal from "./RegistroModal";

function Registro(props) {
  if (!props.isOpened) {
    return null;
  }
  const handleSubmit = (user) => {
    fetchUser(user)
  }

  const fetchUser = async (user) => {
    try{
      const request = await fetch(
        `${config.api.url}:${config.api.port}/user`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      )
      alert("Usuario creado")
      props.onClose()
    }catch(err){
      alert("Hubo un error")
      console.error('[error]', err);
    }
  }
  return ReactDOM.createPortal(
    <RegistroModal closeModal={props.onClose} handleSubmit={handleSubmit}/>,
    document.getElementById("modal-root")
  )
}

export default Registro;
