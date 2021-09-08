import React, { useState } from "react";
import ReactDOM from "react-dom";

import config from "../config";

import userImg from "../utils/icons/user.png";

import "./style/FotoModal.css";

function FotoModal(props) {
  if (!props.isOpened) {
    return null;
  }

  //uso en el frontend
  const [file, setFile] = useState();
  //lo que mando
  const [imagen, setImagen] = useState();
  const [locked, setLocked] = useState(false);

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
          // const maxHeight = 200;
          // const maxWidth = 200;
          // let width = image.width;
          // let height = image.height;
          // if (height > maxHeight) {
          //   width *= maxHeight / height;
          //   height = maxHeight;
          // }

          // if (width > maxWidth) {
          //   height *= maxWidth / width;
          //   width = maxWidth;
          // }
          const MAX_WIDTH = 210;
          const MAX_HEIGHT = 210;
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

  const handleAddFoto = (e) => {
    const { value } = e.target;
    if (value === "cargar") {
      setLocked(false);
    } else {
      setLocked(true);
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
    const status = await fetchUserAvatar(props.userId, formdata);
    if (status === 500) {
      alert("Ocurrio un error");
    } else {
      closeModal();
    }
  };

  const fetchUserAvatar = async (user, info) => {
    try {
      const request = await fetch(
        `${config.api.url}:${config.api.port}/user/${user}`,
        {
          method: "POST",
          mode: "cors",
          body: info,
        }
      );
    } catch (err) {
      alert("Hubo un error");
      console.error("[error]", err);
    }
  };

  let avatar;
  let style;
  if (locked) {
    avatar = userImg;
  } else if (!file) {
    avatar = props.userAvatar;
  } else {
    avatar = file.src;
    style = { width: file.width, height: file.height };
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
          <div className="fotoModal-user-imagen-avatar">
            <img src={avatar} alt="user-imagen" style={style} />
          </div>
        </div>
        <div className="fotoModal-section-input">
          <div className="fotoModal-section-input_cargar">
            <input
              type="radio"
              name="img"
              value="cargar"
              onChange={(e) => handleAddFoto(e)}
              defaultChecked
            />
            <h4>Cargar foto de perfil</h4>
          </div>
          <input
            type="file"
            accept="image/*"
            id="archivo"
            disabled={locked}
            onChange={(e) => change(e)}
          />
          <div className="fotoModal-section-input_eliminar">
            <input
              type="radio"
              name="img"
              value="eliminar"
              onChange={(e) => handleAddFoto(e)}
            />
            <h4>Eliminar foto de perfil</h4>
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

export default FotoModal;
