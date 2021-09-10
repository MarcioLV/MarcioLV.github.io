import React, { useState } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import { setUser } from "../actions";

import config from "../config";

import "./style/EditModal.css";

function EditModal(props) {
  const usuario = props.user;
  if (!props.isOpened) {
    return null;
  }

  const [locked, setLocked] = useState(true);
  const [data, setData] = useState({
    username: usuario.username,
    password: "",
    password2: "",
    password3: "",
  });

  const handleEditPassword = () => {
    if (locked) {
      setLocked(false);
    } else {
      setLocked(true);
      setData({ ...data, password: "", password2: "", password3: "" });
    }
  };

  const handleSubmit = async () => {
    if (!data.username) {
      return alert("No viene Username");
    }
    if (!locked) {
      if (!data.password || !data.password2 || !data.password3) {
        return alert("Rellenar todos lo campos");
      }
      if (data.password2 !== data.password3) {
        return alert("Nueva contraseñas no coinciden");
      }
    }
    const user = {
      username: data.username,
      password: data.password,
      newPassword: data.password2,
    };
    const status = await fetchUser(user);
    if (status === 500) {
      alert("Contraseña Incorrecta");
    } else {
      props.setUser({ user: { ...props.user, username: user.username } });
      closeModal();
    }
  };

  const closeModal = () => {
    props.onClose();
  };

  const fetchUser = async (user) => {
    try {
      const request = await fetch(
        `${config.api.url}:${config.api.port}/user/${usuario._id}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      return request.status;
    } catch (err) {
      alert("Hubo un error");
      console.error("[error]", err);
    }
  };

  return ReactDOM.createPortal(
    <div className="editModal">
      <div className="editModal-conteiner">
        <div className="editModal-header">
          <div className="editModal-header_titulo">
            <h1>Editar Perfil</h1>
          </div>
          <button className="closeButton" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="editModal-inputs">
          <h3>Nombre de Usuario</h3>
          <input
            type="text"
            placeholder="Nombre Usuario"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />

          <div className="editModal-inputs_activarCont">
            <input type="checkbox" onClick={handleEditPassword} id="check1" />
            <label htmlFor="check1">
              <h3>Cambiar Contraseña</h3>
            </label>
          </div>

          <div className="editModal-inputs_contraseña">
            <input
              type="password"
              placeholder="Contraseña Actual"
              value={data.password}
              disabled={locked}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={data.password2}
              disabled={locked}
              onChange={(e) => setData({ ...data, password2: e.target.value })}
            />

            <input
              type="password"
              placeholder="Repetir Nueva Contraseña"
              value={data.password3}
              disabled={locked}
              onChange={(e) => setData({ ...data, password3: e.target.value })}
            />
          </div>
        </div>
        <div className="editModal-button">
          <button className="editModal-button_cancelar" onClick={closeModal}>
            Cancelar
          </button>
          <button className="editModal-button_aceptar" onClick={handleSubmit}>
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

const mapStateToProps = (state) => {
  return { user: state.user };
};
const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
