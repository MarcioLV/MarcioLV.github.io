import React, {useState} from "react";
import ReactDOM from 'react-dom'

import RegistroModal from "./RegistroModal";

import config from "../config";
const API_URL = config.api.url


function Registro(props) {
  const [taken, setTaken] = useState(false)
  if (!props.isOpened) {
    return null;
  }

  const erraseTaken = () => {
    if(taken){
      setTaken(false)
    }
  }
  
  const handleSubmit = async (user) => {
    const response = await fetchUser(user)
    if(response.error){
      console.error('[error]', response);
      return alert("Hubo un error")
    }
    if(response.body === 'taken'){
      return setTaken(true)
    }
    props.onClose()
    props.handleSubmitReg(user)
  }

  const fetchUser = async (user) => {
    try{
      let response = await fetch(
        `${API_URL}api/user`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      )
      response = await response.json();
      return response;
    }catch(error){
      let err = {
        error: true,
        body: error,
      };
      return err;
    }
  }

  return ReactDOM.createPortal(
    <RegistroModal closeModal={props.onClose} handleSubmit={handleSubmit} taken={taken} erraseTaken={()=>erraseTaken()}/>,
    document.getElementById("modal-root")
  )
}

export default Registro;
