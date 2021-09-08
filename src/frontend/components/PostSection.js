import React from "react";
import ListaPost from "./ListaPost";
import AgregarPost from "./AgregarPost";
import config from "../config";

import "./style/PostSection.css";

class PostSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: this.props.post,
      userPage: this.props.userPage,
      userPageId: this.props.userPageId,
      userPageAvatar: this.props.avatar,
      myPage: true,
      user: {
        username: this.props.user.username,
        avatar: this.props.user.avatar,
        _id: this.props.user._id,
        token: this.props.user.token,
      },
    };
    this.handleAddPost = this.handleAddPost.bind(this);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleDeleteLike = this.handleDeleteLike.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
  }

  componentDidMount() {
    let page = this.state.myPage;
    let userPage = this.state.user.username
    if (
      this.state.userPageId &&
      this.state.userPageId !== this.state.user._id
    ) {
      page = false;
    }
    if(this.state.userPage){ userPage = this.state.userPage}
    this.setState({ loading: false, myPage: page, userPage: userPage });
  }

  async handleAddPost(text, picture) {
    let formdata = new FormData()
    formdata.append("picture", picture)
    formdata.append("user", this.state.user._id)
    formdata.append("text", text)

    const newPost = await this.fetchAddPost(formdata);
    console.log(newPost)
    newPost.user = {
      username: this.state.user.username,
      avatar: this.state.user.avatar,
    }
    this.setState({ post: [].concat(this.state.post, newPost) });
  }
  
  async handleDeletePost(post){
    return await this.fetchDeletePost(post)
  }

  async handleAddLike(postId) {
    const likeUser = {
      user: this.state.user.username,
    };
    await this.fetchAddData(likeUser, postId, "like");
  }

  async handleDeleteLike(postId) {
    const likeUser = {
      user: this.state.user.username,
    };
    await this.fetchDeleteLike(likeUser, postId, "like");
  }

  async handleAddComment(postId, comment) {
    const commentPost = {
      user: this.state.user.username,
      comment: comment,
    };
    const newComment = await this.fetchAddData(commentPost, postId, "comment");
    return newComment;
  }

  async handleDeleteComment(postId, commentId) {
    const commentUser = {
      user: this.state.user.username,
      id: commentId,
    };
    const error = await this.fetchDeleteLike(commentUser, postId, "comment");
    return error;
  }

  async fetchDeletePost(id){
    let error;
    await fetch(`${config.api.url}:${config.api.port}/post/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.user.token,
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => error = response.error)
      .catch((err) => console.error("[ERROR]", err));
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
      this.setState({post: post})
    }
  }
  async fetchAddPost(data) {
    let datos = {};
    await fetch(`${config.api.url}:${config.api.port}/post`, {
      method: "POST",
      mode: "cors",
      headers: {
        // "Content-Type": "application/json",
        Authorization: this.state.user.token,
      },
      body: data,
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => (datos = response.body))
      .catch((err) => console.error("[ERROR]", err));

    return datos;
  }
  
  async fetchAddData(data, id = "", modo = "") {
    let datos = {};
    if (modo) {
      id += "/";
    }
    await fetch(`${config.api.url}:${config.api.port}/post/${id}${modo}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.user.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => (datos = response.body))
      .catch((err) => console.error("[ERROR]", err));

    return datos;
  }

  async fetchDeleteLike(data, id, modo) {
    let error;
    await fetch(`${config.api.url}:${config.api.port}/post/${id}/${modo}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.user.token,
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
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    let style = {};
    if (!this.state.myPage) {
      style = {
        display: "none",
      };
    }
    return (
      <>
        <section className="agregar-post" style={style}>
          <AgregarPost
            handleAddPost={this.handleAddPost}
            username={this.state.user.username}
            userPage={this.state.userPage}
            userId={this.state.user._id}
            avatar={this.state.user.avatar}
          />
        </section>
        <section className="ver-post">
          <ListaPost
            post={this.state.post}
            avatar={this.state.userPageAvatar}
            username={this.state.user.username}
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

export default PostSection;
