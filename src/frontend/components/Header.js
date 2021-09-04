import React from "react";
import {Link} from 'react-router-dom'

import "./style/Header.css";

function Header(props) {
  // const handleCloseSesion = () => {
  //   sessionStorage.removeItem("token")
  //   sessionStorage.removeItem("username")
  // };

  return (
    <div className="header">
      <div className="header-contenedor">
        <div className="inicio">
          <button className="inicioButton" /*onClick={irInicio}*/>
            <Link to="/">HOME</Link>
          </button>
        </div>
        <div className="closeSesion">
          <button className="closeSesionButton" onClick={props.handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
