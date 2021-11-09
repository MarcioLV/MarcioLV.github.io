import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import { setUser } from "../actions";

import userImg from "../utils/icons/user.png";

import "./style/FotoModal.css";

import config from "../config";
const API_URL = config.api.url

function FotoModal(props) {
  if (!props.isOpened) {
    return null;
  }

  //uso en el frontend
  const [file, setFile] = useState();
  //lo que mando
  const [imagen, setImagen] = useState();
  const [locked, setLocked] = useState(false);

  let img = useRef(null);
  let imgCon = useRef(null);

  const closeModal = () => {
    props.onClose();
  };

  const change = (e) => {
    if (e.target.files.length > 0) {
      let img = e.target.files[0];

      let reader = new FileReader();
      let image = new Image();

      reader.onload = function (f) {
        image.src = f.target.result;
        image.onload = async function () {
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = image.width;
          let height = image.height;
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

  const handleSubmit = async () => {
    let avatar;
    if (!locked) {
      if (!imagen) {
        alert("No subio ninguna imagen");
      } else {
        avatar = imagen;
      }
    }
    let formdata = new FormData();
    formdata.append("avatar", avatar);
    const response = await fetchUserAvatar(props.userId, formdata);
    if (response.error) {
      alert("Ocurrio un error");
    } else {
      props.setUser({ user: { ...props.user, avatar: response.body.avatar } });
      closeModal();
    }
  };

  const fetchUserAvatar = async (user, info) => {
    try {
      let response = await fetch(
        `${API_URL}api/user/${user}`,
        {
          method: "POST",
          headers: {
            Authorization: props.user.token,
          },
          mode: "cors",
          body: info,
        }
      );
      response = response.json();
      return response;
    } catch (err) {
      alert("Hubo un error");
      console.error("[error]", err);
    }
  };

  const check = (avatar) => {
    const width = img.current.width;
    const height = img.current.height;
    const conWidth = imgCon.current.clientWidth;
    if(avatar === API_URL + userImg){
      img.current.style.minWidth = "0"
      img.current.style.minHeight = "0"
    }else{
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
    }}
  };

  let avatar;
  if (locked) {
    avatar = API_URL + userImg;
  } else if (!file) {
    avatar = API_URL + props.userAvatar;
  } else {
    avatar = file.src;
  }

  return ReactDOM.createPortal(
    <div className="fotoModal">
      <div className="fotoModal-conteiner">
        <div className="fotoModal-header">
          <div className="fotoModal-header_titulo">
            <h1>Cambiar foto de perfil</h1>
          </div>
          <button className="closeButton" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="fotoModal-user-imagen">
          <div className="fotoModal-user-imagen-avatar" ref={imgCon}>
            <img
              src={avatar}
              alt="user-imagen"
              ref={img}
              onLoad={()=>check(avatar)}
            />
          </div>
        </div>
        <div className="fotoModal-section-input">
          <input
            type="file"
            accept="image/*"
            id="archivo"
            disabled={locked}
            style={{ display: "none" }}
            onChange={(e) => change(e)}
          />
          <button className={`filebutton ${locked && "filebutton-locked"}`}>
            <label htmlFor="archivo" className="label">
              Elegir foto
            </label>
          </button>
          <div className="fotoModal-section-input_eliminar">
            <input
              type="checkbox"
              name="img"
              value="eliminar"
              id="delete-img"
              onChange={() => setLocked(!locked)}
            />
            <label htmlFor="delete-img">
              <h4>Eliminar foto de perfil</h4>
            </label>
          </div>
        </div>
        <div className="fotoModal-button">
          <button className="fotoModal-button_cancelar" onClick={closeModal}>
            Cancelar
          </button>
          <button className="fotoModal-button_aceptar" onClick={handleSubmit}>
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(FotoModal);
