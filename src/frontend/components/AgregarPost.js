import React, { useState } from "react";
import { Link } from "react-router-dom";

import user from "../utils/icons/user.png";

import "./style/AgregarPost.css";

function AgregarPost(prop) {
  const [post, setPost] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post) {
      return alert("Escribe algo");
    }

    prop.handleAddPost(post);
    setPost("");
  };


  let userImg = prop.avatar ? (prop.avatar) : (user)
  return (
    <div className="addPost">
      <div className="addPost-perfil">
        <div className="addPost-user">
          <figure className="addPost-user-figure">
            <img src={userImg} alt="" className="addPost-user-figure-img" />
          </figure>
          <h4>
            <Link
              to={{
                pathname: "/" + prop.userId,
              }}
            >
              {prop.userPage}
            </Link>
          </h4>
        </div>
      </div>
      <form action="">
        <div className="addPost-input">
          <textarea
            value={post}
            type="text"
            placeholder="Agregar un post"
            onChange={(e) => setPost(e.target.value)}
          />
          <button type="submit" onClick={(e) => handleSubmit(e)}>
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarPost;
