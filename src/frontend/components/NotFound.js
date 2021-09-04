import React from 'react'
import {Link} from 'react-router-dom'

import './style/notFound.css'

function NotFound(){
  return (
    <div className="notFound">
      <div className="notFound-container">
        <h1>404</h1>
        <h2>Pagina no encontrada</h2>
        <h3>Volver a <Link to="/">Pagina Principal</Link></h3>
      </div>
    </div>
  )
}

export default NotFound