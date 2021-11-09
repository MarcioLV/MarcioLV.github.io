import React from "react";
import ReactDOM from "react-dom";

import closeIcon from "../utils/icons/closeWhiteIcon.png";
import "./style/viewImage.css";
import config from '../../../config'
const API_URL = config.api.url

function ViewImage(props) {
  if (!props.isOpened) {
    return null;
  }

  const closeModal = () => {
    props.onClose();
  };

  return ReactDOM.createPortal(
    <div className="viewImage">
      <div className="viewImage-container">
        <div className="vewImage-image">
          <img src={props.image} alt="picture" />
        </div>
        <button className="viewImage-button" onClick={closeModal}>
          <img src={API_URL + closeIcon} alt="" />
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ViewImage;
