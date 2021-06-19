import React from 'react'

import './style/MovieCard.css'

// const style = {backgroundImage: "url('https://www.themoviedb.org/t/p/w220_and_h330_face/qb28nkLZV0v6yJZZRpJYl0LE35N.jpg')"}
const url = 'https://www.themoviedb.org/t/p/w220_and_h330_face/qb28nkLZV0v6yJZZRpJYl0LE35N.jpg'

const MovieCard = ()=>{
  return (
    <div className='card'>
      <div className="card-imagen">
        <img src={url} alt="" />
      </div>
      <div className="card-descripcion">
        <div className="card-description_puntaje">
          86%
        </div>
        <div className="card-description_info">
          <h3>Cruela</h3>
          <p>26 may 2021</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard