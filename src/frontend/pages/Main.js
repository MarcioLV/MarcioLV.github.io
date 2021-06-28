import React, { useState } from "react";
import ListaPost from "../components/ListaPost";
import AgregarPost from "../components/AgregarPost";
import config from "../config";

import "./style/Main.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      user: {
        username: props.user.username,
        token: "Bearer " + props.user.token,
      },
    };
    this.handleAddPost = this.handleAddPost.bind(this);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  componentDidMount() {
    this.fetchPost();
  }

  handleAddPost(text) {
    const post = {
      user: this.state.user.username,
      text: text,
    };
    this.fetchAddData(post);
  }

  handleAddLike(postId) {
    const likeUser = {
      user: this.state.user.username,
    };
    this.fetchAddData(likeUser, postId, "like");
  }

  handleAddComment(postId, comment){
    const commentPost = {
      user: this.state.user.username,
      comment: comment
    }
    this.fetchAddData(commentPost, postId, "comment")
  }

  fetchPost() {
    const options = {
      headers: {
        Authorization: this.state.user.token,
      },
    };
    fetch(`${config.api.url}:${config.api.port}/post`, options)
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => Array.from(response.body))
      .then((response) => this.setState({ post: response }))
      .catch((err) => console.error("[error]", err.message));
  }

  fetchAddData(data, id = "", modo = "") {
    if (modo) {
      id += "/";
    }
    fetch(`${config.api.url}:${config.api.port}/post/${id}${modo}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.user.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => console.log(response))
      .catch((err) => console.error("[ERROR]", err));
  }

  render() {
    return (
      <div className="wall">
        <div className="wall-center">
          <section className="agregar-post">
            <AgregarPost handleAddPost={this.handleAddPost} />
          </section>
          <section className="ver-post">
            <ListaPost
              post={this.state.post}
              handleAddLike={this.handleAddLike}
              handleAddComment={this.handleAddComment}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default Main;
