import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import config from "../../../../config";
const API_URL = config.api.url;

import userIcon from "../../utils/icons/user.png";
import loadPic from "../../utils/icons/picture1.png";
import closeIcon from "../../utils/icons/closeWhiteIcon.png";

import "./style/AgregarPost.css";

function AgregarPost(prop) {
  const [post, setPost] = useState("");
  const [height, setHeight] = useState();
  //uso en el frontend
  const [file, setFile] = useState();
  //lo que mando
  const [imagen, setImagen] = useState();

  let h = useRef(null);
  let img = useRef(null);
  let imgCon = useRef(null);
  let imgInput = useRef(null);

  useEffect(() => {
    if (h.current) {
      const textHeigth = h.current.clientHeight;
      setHeight(textHeigth);
    }
  }, [h.current]);

  useEffect(() => {
    if (height) {
      h.current.style.height = height + "px";
      h.current.style.height = h.current.scrollHeight + "px";
    }
  }, [post]);

  const change = (e) => {
    if (e.target.files.length > 0) {
      let img = e.target.files[0];
      let reader = new FileReader();
      let image = new Image();

      reader.onload = function (f) {
        image.src = f.target.result;
        image.onload = async function () {
          const maxHeight = 500;
          const maxWidth = 500;
          let width = image.width;
          let height = image.height;
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          image.width = width;
          image.height = height;
          setFile(image);

          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          const blob = await new Promise((rs) => canvas.toBlob(rs, 1));
          const resizedFile = await new File([blob], img.name, img);

          setImagen(resizedFile);
        };
      };
      reader.readAsDataURL(img);
    }
  };

  const handleSubmit = () => {
    if (!post && !file) {
      return alert("Escribe algo");
    }

    prop.handleAddPost(post, imagen);
    setPost("");
    setImagen(null);
    setFile(null);
  };

  const closeImage = () => {
    if (imgInput.current) {
      imgInput.current.value = "";
    }
    setImagen(null);
    setFile(null);
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

  let avatar = prop.user.avatar ? prop.user.avatar : userIcon;

  return (
    <div className="addPost">
      <div className="addPost-perfil">
        <div className="addPost-user">
          <Link
            to={{
              pathname: "/perfil/" + prop.user._id,
            }}
          >
            <figure className="addPost-user-figure" ref={imgCon}>
              <img
                ref={img}
                src={API_URL + avatar}
                alt=""
                className={`addPost-user-figure-img${
                  !prop.user.avatar ? "_default" : ""
                }`}
                onLoad={prop.user.avatar ? check : undefined}
              />
            </figure>
            <h4>{prop.user.username}</h4>
          </Link>
        </div>
        <div className="addPost-imagen">
          <label htmlFor="img-file">
            <img src={API_URL + loadPic} />
          </label>
          <input
            type="file"
            id="img-file"
            accept="image/*"
            onChange={(e) => change(e)}
          />
        </div>
      </div>
      <div className="addPost-input">
        <div className="addPost-input-container">
          <textarea
            value={post}
            type="text"
            placeholder="Agregar un post"
            ref={h}
            onChange={(e) => {
              setPost(e.target.value);
            }}
          />
        </div>
        {file && (
          <>
            <figure className="addPost-input-imagen">
              <img
                src={closeIcon}
                className="addPost-input-imagen_closeIcon"
                alt=""
                onClick={closeImage}
                ref={imgInput}
              />
              <img src={file.src} />
            </figure>
          </>
        )}
        <button onClick={handleSubmit}>Agregar</button>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};

export default connect(mapStateToProps, null)(AgregarPost);
