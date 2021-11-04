import React from "react";
import {connect} from 'react-redux'

import ListaPost from "./ListaPost";
import AgregarPost from "./AgregarPost";
import config from "../../config";

import "./style/PostSection.css";

class PostSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: this.props.post,
    };
    this.handleAddPost = this.handleAddPost.bind(this);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleDeleteLike = this.handleDeleteLike.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
  }

  async handleAddPost(text, picture) {
    let formdata = new FormData()
    formdata.append("picture", picture)
    formdata.append("user", this.props.user._id)
    formdata.append("text", text)

    let newPost = await this.fetchAddPost(formdata);
    if(!newPost.error){
      newPost.user = {
        username: this.props.user.username,
        avatar: this.props.user.avatar,
        _id: this.props.user._id
      }
      this.setState({ post: [].concat(this.state.post, newPost) });
    }
  }

  async fetchAddPost(data) {
    let error = false;
    let datos = await fetch(`${config.api.url}:${config.api.port}/api/post`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: this.props.user.token,
      },
      body: data,
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => (response.body))
      .catch((err) => {
        console.error("[ERROR]", err)
        alert("No se pudo agregar el Post")
        error = true
      });
    return {...datos, error: error}
  }
  
  async handleDeletePost(post){
    return await this.fetchDeletePost(post)
  }

  async handleAddLike(postId) {
    const likeUser = {
      user: this.props.user.username,
    };
    await this.fetchAddData(likeUser, postId, "like");
  }

  async handleDeleteLike(postId) {
    const likeUser = {
      user: this.props.user.username,
    };
    await this.fetchDeleteLike(likeUser, postId, "like");
  }

  async handleAddComment(postId, comment) {
    const commentPost = {
      user: this.props.user.username,
      comment: comment,
    };
    const newComment = await this.fetchAddData(commentPost, postId, "comment");
    if(!newComment.error){
      return newComment;
    }else{
      alert("sucedio un error")
    }
  }

  async handleDeleteComment(postId, commentId) {
    const commentUser = {
      user: this.props.user.username,
      id: commentId,
    };
    const error = await this.fetchDeleteLike(commentUser, postId, "comment");
    return error;
  }

  async fetchDeletePost(id){
    let error;
    await fetch(`${config.api.url}:${config.api.port}/api/post/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.user.token,
      },
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => error = response.error)
      .catch((err) => {
        error = true
        console.error("[ERROR]", err)});
    if(!error){
      let post = this.state.post
      let index
      for(let i = 0; i<post.length; i++){
        if(post[i]._id === id){
          index = i
          break
        }
      }
      post.splice(index, 1)
      this.setState({ post: [].concat(post) });
    }else{
      alert("Sucedio un error")
    }
  }
  
  async fetchAddData(data, id = "", modo = "") {
    let datos = {};
    let error = false
    if (modo) {
      id += "/";
    }
    await fetch(`${config.api.url}:${config.api.port}/api/post/${id}${modo}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.user.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => (datos = response.body))
      .catch((err) => {
        console.error("[ERROR]", err)
        error = true
      });

    return {...datos, error: error};
  }

  async fetchDeleteLike(data, id, modo) {
    let error;
    await fetch(`${config.api.url}:${config.api.port}/api/post/${id}/${modo}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.user.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => (error = response.error))
      .catch((err) => console.error("[ERROR]", err));

    return error;
  }

  render() {
    let showStyle = !this.props.myPage
    ? {display: "none"}
    : {};
    return (
      <>
        <section className="agregar-post" style={showStyle}>
          <AgregarPost
            handleAddPost={this.handleAddPost}
          />
        </section>
        <section className="ver-post">
          <ListaPost
            post={this.state.post}
            myPage={this.props.myPage}
            handleAddLike={this.handleAddLike}
            handleAddComment={this.handleAddComment}
            handleDeleteLike={this.handleDeleteLike}
            handleDeleteComment={this.handleDeleteComment}
            handleDeletePost={this.handleDeletePost}
          />
        </section>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};

export default connect(mapStateToProps, null)(PostSection);
