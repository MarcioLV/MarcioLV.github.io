import React, { useRef } from "react";

import userIcon from "../utils/icons/user.png";

import config from "../config";
const API_URL = config.api.url

import "./style/SearchUser.css";
const SearchUser = ({ user }) => {
  let img = useRef(null);
  let imgCon = useRef(null);

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

  let avatar = user.avatar ? user.avatar : userIcon

  return (
    <div className="searchUser_user-container">
      <figure className="searchUser_user-figure" ref={imgCon}>
        <img
          ref={img}
          src={API_URL + avatar}
          alt=""
          className={`searchUser_user-figure-img${
            !user.avatar ? "_default" : ""
          }`}
          onLoad={user.avatar ? check : undefined}
        />
      </figure>
      <h2>{user.username}</h2>
    </div>
  );
};

export default SearchUser;
