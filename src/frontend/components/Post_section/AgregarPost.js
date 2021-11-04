import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import user from "../../utils/icons/user.png";
import loadPic from "../../utils/icons/picture1.png";

import "./style/AgregarPost.css";

function AgregarPost(prop) {
  const [post, setPost] = useState("");
  const [height, setHeight] = useState();
  //uso en el frontend
  const [file, setFile] = useState();
  //lo que mando
  const [imagen, setImagen] = useState();

  let h = useRef(null);

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

  // const handleAddText = (e) => {
  //   setPost(e.target.value);
  // };

  let userImg = prop.user.avatar ? prop.user.avatar : user;

  let i = useRef(null);
  const check = () => {
    if (userImg == user) {
      i.current.style.width = "35px";
    } else {
      let height = i.current.clientHeight;
      let width = i.current.clientWidth;
      const MAX_WIDTH = 50;
      const MAX_HEIGHT = 50;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      i.current.style.height = height + "px";
      i.current.style.width = width + "px";
    }
  };
  return (
    <div className="addPost">
      <div className="addPost-perfil">
        <div className="addPost-user">
          <figure className="addPost-user-figure">
            <Link
              to={{
                pathname: "/" + prop.user._id,
              }}
            >
              <img
                ref={i}
                src={userImg}
                alt=""
                className="addPost-user-figure-img"
                onLoad={check}
              />
            </Link>
          </figure>
          <h4>
            <Link
              to={{
                pathname: "/" + prop.user._id,
              }}
            >
              {prop.user.username}
            </Link>
          </h4>
        </div>
        <div className="addPost-imagen">
          <label htmlFor="img-file">
            <img src={loadPic} />
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
        {file && <figure
          className="addPost-input-imagen"
        >
          <img src={file.src}/>
        </figure>}
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
