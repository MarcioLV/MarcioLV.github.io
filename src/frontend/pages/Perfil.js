import React from "react";

import { connect } from "react-redux";
import { setUserPage } from "../actions";

import Loading from "../components/Loading";
import Header from "../components/Header";
import PostSection from "../components/Post_section/PostSection";
import EditModal from "../components/EditModal";
import FotoModal from "../components/FotoModal";

import config from "../config";

import userImg from "../utils/icons/user.png";
import changeImg from "../utils/icons/camara.png";
import "./style/Perfil.css";

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
    };
    this.openModal = this.openModal.bind(this);
    this.openModalImg = this.openModalImg.bind(this);
  }
  componentDidMount() {
    this.fetchPost();
  }

  openModal() {
    this.setState({ isOpened: true });
  }

  openModalImg() {
    this.setState({ isOpenedImg: true });
  }

  closeModal() {
    this.setState({ isOpened: false, isOpenedImg: false });
    this.fetchPost();
  }

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
    await fetch(`${config.api.url}:${config.api.port}/user/${userId}`, options)
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => {
        if (!response.error) {
          response = response.body
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
  //   try {
  //     let response = await fetch(
  //       `${config.api.url}:${config.api.port}/user/${userId}`,
  //       options
  //     );
  //     response = await response.text();
  //     response = await JSON.parse(response);
  //     response = response.body;
  //     this.props.setUserPage({
  //       userPage: {
  //         username: response.username,
  //         avatar: response.avatar,
  //         _id: userId,
  //       },
  //     });
  //     if (this.props.user._id !== this.props.userPage._id) {
  //       this.setState({ myPage: false });
  //     }
  //     console.log("perfil-response");
  //     this.setState({
  //       post: response.posts,
  //       loading: false,
  //     });
  //   } catch (err) {
  //     console.log(error);
  //     console.error("[error]", err.message)
  //     this.setState({error: true, loading: false});
  //   }
  // }
  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return "error";
    }

    let userImg2 = this.props.userPage.avatar
      ? this.props.userPage.avatar
      : userImg;

    return (
      <div className="perfil">
        <div className="perfil-view">
          <Header handleLogout={this.props.handleLogout} />
          <section className="perfil-user-contenedor">
            <div className="perfil-user perfil-contenedor">
              <div className="perfil-user-imagen">
                <div className="perfil-user-imagen-avatar">
                  <img src={userImg2} alt="user-imagen" />
                </div>
                {this.state.myPage ? (
                  <div
                    className="perfil-user-imagen-change" /*style={showStyle}*/
                  >
                    <div
                      className="perfil-user-imagen-change_contenedor"
                      onClick={this.openModalImg}
                    >
                      <img src={changeImg} alt="" />
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
