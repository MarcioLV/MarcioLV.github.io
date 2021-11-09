import React, { useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { connect } from "react-redux";

import Search from "./Search";

import logOutIcon from "../utils/icons/logout-icon.png";
import homeIcon from "../utils/icons/home-icon.png";
import user from "../utils/icons/user.png";
import config from "../../../config"
const API_URL = config.api.url

import "./style/Header.css";

function Header(props) {
  let history = useHistory();
  let location = useLocation();

  let img = useRef(null);
  let imgCon = useRef(null);

  const irInicio = () => {
    if (location.pathname !== "/") {
      history.push("/");
    } else {
      props.handleHome();
    }
  };

  const check = () => {
    const width = img.current.width;
    const height = img.current.height;
    const conWidth = imgCon.current.clientWidth;
    if (width >= height) {
      if (height <= conWidth) {
        img.current.style.minHeight = conWidth + "px";
      } else {
        img.current.style.maxHeight = conWidth + "px";
      }
    } else {
      if (width <= conWidth) {
        img.current.style.minWidth = conWidth + "px";
      } else {
        img.current.style.maxWidth = conWidth + "px";
      }
    }
  };

  let avatarImg = props.user.avatar ? props.user.avatar : user

  return (
    <div className="header">
      <div className="header-contenedor">
        <div className="left-side">
          <div className="home">
            <button className="inicioButton" onClick={irInicio}>
              <img src={homeIcon} />
            </button>
          </div>
        </div>
        <div className="center">
          <Search />
        </div>
        <div className="right-side">
          <div className="header-perfil">
            <Link
              to={{
                pathname: "/perfil/" + props.user._id,
              }}
            >
              <h4>{props.user.username}</h4>
              <figure className="header-perfil-figure" ref={imgCon}>
                <img
                  ref={img}
                  src={API_URL + avatarImg}
                  alt=""
                  className={`header-perfil-figure-img${
                    !props.user.avatar ? "_default" : ""
                  }`}
                  onLoad={props.user.avatar ? check : undefined}
                />
              </figure>
            </Link>
          </div>
          <div className="logOut">
            <button className="closeSesionButton" onClick={props.handleLogout}>
              <img src={logOutIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(Header);

// export default Header;
