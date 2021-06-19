import React from 'react'

import './style/Header.css'

const Header = ()=> {
  return (
    <div className="header">
      <div className="contenedor">
        <div className="list-left">
          <ul className='list-item'>
            <li><h1>T100M</h1></li>
            <li>Película</li>
            <li>Programa de televisión</li>
            <li>Personas</li>
            <li>Más</li>
          </ul>
        </div>
        <div className="list-rigth">
          <ul className='list-item'>
            <li>Acceder</li>
            <li>Unirse</li>
            <li>Buscar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header