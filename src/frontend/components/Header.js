import React from "react";
import { Link, useHistory } from "react-router-dom";

import "./style/Header.css";

function Header(props) {
  const history = useHistory();
  const irInicio = () => {
    history.go(0);
  };

  return (
    <div className="header">
      <div className="header-contenedor">
        <div className="inicio">
          <button className="inicioButton" onClick={irInicio}>
            HOME
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
