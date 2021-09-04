import React from "react";

import Loading from "../components/Loading";
import Header from "../components/Header";
import PostSection from "../components/PostSection";
import EditModal from "../components/EditModal";

import config from "../config";

import userImg from "../utils/icons/user.png";
import "./style/Perfil.css";

class Perfil extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: true,
      error: false,
      post: [],
      userPage:'',
      userPageId: this.props.data.match.params.userId,
      userPageAvatar: "",
      myPage: true,
      user: {
        username: this.props.user.username,
        avatar: this.props.user.avatar,
        _id: this.props.user._id,
        token: "Bearer " + this.props.user.token,
      },
      isOpened: false,
    };
    this.openModal = this.openModal.bind(this)
  }
    

  componentDidMount() {
    if (this.state.userPageId !== this.state.user._id) {
      this.setState({ myPage: false });
    }
    this.fetchPost();
    console.log(this.state.myPage);
  }

  openModal() {
    this.setState({ isOpened: true });
  }

  closeModal() {
    this.setState({ isOpened: false });
    this.fetchPost()
  }

  fetchPost() {
    this.setState({ loading: true });
    const userId = this.state.userPageId;
    if (!userId) {
      return;
    }
    const options = {
      headers: {
        Authorization: this.state.user.token,
      },
    };
    fetch(`${config.api.url}:${config.api.port}/user/${userId}`, options)
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => response.body)
      .then((response) =>
        {console.log(response)
        this.setState({
          post: response.posts,
          userPageAvatar: response.avatar,
          userPage: response.username,
          loading: false,
        })}
      )
      .catch((err) => console.error("[error]", err.message));
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    let style = !this.state.myPage ? { display: "none" } : {};
    let userImg2 = this.state.userPageAvatar
      ? this.state.userPageAvatar
      : userImg;
    return (
      <div className="perfil">
        <div className="perfil-view">
          <Header handleLogout={this.props.handleLogout} />
          <section className="perfil-user-contenedor">
            <div className="perfil-user perfil-contenedor">
              <div className="perfil-user-imagen">
                <img src={userImg2} alt="user-imagen" />
              </div>
              <h1>{this.state.userPage}</h1>
              <button style={style} onClick={this.openModal}>Editar Perfil</button>
              <EditModal onClose={()=>this.closeModal()} isOpened={this.state.isOpened} user={this.state.user}/>
            </div>
          </section>
          <section className="perfil-post perfil-contenedor">
            <PostSection
              post={this.state.post}
              userPageId = {this.state.userPageId}
              user={this.state.user}
              userPage={this.state.userPage}
              avatar={this.state.userPageAvatar}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default Perfil;
