import React from "react"

import './style/home.css'

import Header from '../components/Header'
import MovieCard from '../components/MovieCard'

class Home extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className='home'>
        <Header />
        <div className="main">
          <div className="contenedor">
            <div className="grilla">
              <div className="filtro">
                <ul>
                  <li>Ordenar</li>
                  <li>Filtros</li>
                </ul>
                <button>Buscar</button>
              </div>
              <div className="lista-peliculas">
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    )


  }
}

export default Home