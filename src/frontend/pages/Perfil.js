import React, { useRef } from "react";

import { connect } from "react-redux";
import { setUserPage } from "../actions";

import Loading from "../components/Loading";
import Error from "../components/Error";
import PostSection from "../components/Post_section/PostSection";
import EditModal from "../components/EditModal";
import FotoModal from "../components/FotoModal";
import ViewImage from "../components/ViewImage";


import userImg from "../utils/icons/user.png";
import changeImg from "../utils/icons/camara.png";

import "./style/Perfil.css";
import config from "../config";
const API_URL = config.api.url

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      myPage: true,
      post: [],
      userPageId: this.props.data.match.params.userId,
      isOpened: false,
      isOpenedImg: false,
      isOpenedView: false,
    };
    this.check = this.check.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openModalImg = this.openModalImg.bind(this);
    this.openViewImage = this.openViewImage.bind(this);
  }

  componentDidMount() {
    this.fetchPost();
  }

  componentDidUpdate(props) {
    if (
      this.props.data.match.params.userId !== props.data.match.params.userId
    ) {
      this.setState(
        { userPageId: this.props.data.match.params.userId, myPage: true },
        () => this.fetchPost()
      );
    }
  }

  openModal() {
    this.setState({ isOpened: true });
  }

  openModalImg() {
    this.setState({ isOpenedImg: true });
  }

  openViewImage() {
    this.setState({ isOpenedView: true });
  }

  closeModal() {
    this.setState({ isOpened: false, isOpenedImg: false });
    this.fetchPost();
  }

  closeViewImage = () => {
    this.setState({ isOpenedView: false });
  };

  async fetchPost() {
    this.setState({ loading: true });
    const userId = this.state.userPageId;
    if (!userId) {
      return;
    }
    const options = {
      headers: {
        Authorization: this.props.user.token,
      },
    };
    await fetch(
      `${API_URL}api/user/${userId}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (!response.error) {
          response = response.body;
          this.props.setUserPage({
            userPage: {
              username: response.username,
              avatar: response.avatar,
              _id: userId,
            },
          });
          if (this.props.user._id !== this.props.userPage._id) {
            this.setState({ myPage: false });
          }
          this.setState({
            post: response.posts,
            loading: false,
          });
        } else {
          console.error("[error]", "perfil no encantrado");
          this.setState({ error: true, loading: false });
        }
      })
      .catch((err) => {
        console.error("[error]", err.message);
        this.setState({ error: true, loading: false });
      });
  }

  check = () => {
    const img = document.getElementById("img-perfil");
    const imgCon = document.getElementById("imgCon-perfil");
    const width = img.width;
    const height = img.height;
    const conWidth = imgCon.clientWidth;
    if (width >= height) {
      if (height <= conWidth) {
        img.style.minHeight = conWidth + "px";
      } else {
        img.style.maxHeight = conWidth + "px";
      }
    } else {
      if (width <= conWidth) {
        img.style.minWidth = conWidth + "px";
      } else {
        img.style.maxWidth = conWidth + "px";
      }
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return <Error/>;
    }

    let userImg2 = this.props.userPage.avatar
      ? this.props.userPage.avatar
      : userImg;
    
    return (
      <div className="perfil">
        <ViewImage
          onClose={() => this.closeViewImage()}
          isOpened={this.state.isOpenedView}
          image={API_URL + userImg2}
        />
        <div className="perfil-view">
          <section className="perfil-user-contenedor">
            <div className="perfil-user perfil-contenedor">
              <div className="perfil-user-imagen">
                <div className="perfil-user-imagen-avatar" id="imgCon-perfil">
                  <img
                    src={API_URL + userImg2}
                    alt="user-imagen"
                    onClick={this.openViewImage}
                    onLoad={
                      userImg2 !== userImg ? () => this.check() : undefined
                    }
                    
                    id="img-perfil"
                  />
                </div>
                {this.state.myPage ? (
                  <div
                    className="perfil-user-imagen-change"
                  >
                    <div
                      className="perfil-user-imagen-change_contenedor"
                      onClick={this.openModalImg}
                    >
                      <img src={API_URL + changeImg} alt="" />
                    </div>
                    <FotoModal
                      onClose={() => this.closeModal()}
                      isOpened={this.state.isOpenedImg}
                      userId={this.props.user._id}
                      userAvatar={userImg2}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <h1>{this.props.userPage.username}</h1>
              {this.state.myPage ? (
                <>
                  <button onClick={this.openModal}>Editar Perfil</button>
                  <EditModal
                    onClose={() => this.closeModal()}
                    isOpened={this.state.isOpened}
                  />{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          </section>
          <section className="perfil-post perfil-contenedor">
            <PostSection post={this.state.post} myPage={this.state.myPage} />
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};
const mapDispatchToProps = {
  setUserPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
