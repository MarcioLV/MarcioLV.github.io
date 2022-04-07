import React from "react";
import {connect} from 'react-redux'

import ListaPost from "./ListaPost";
import AgregarPost from "./AgregarPost";

import {fetchAddPost} from '../../utils/fetch'

import "./style/PostSection.css";

import config from "../../config";
const API_URL = config.api.url

class PostSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: this.props.post,
    };
    this.handleAddPost = this.handleAddPost.bind(this);
  }

  async handleAddPost(text, picture) {
    let formdata = new FormData()
    formdata.append("picture", picture)
    formdata.append("user", this.props.user._id)
    formdata.append("text", text)

    let newPost = await fetchAddPost(formdata, this.props.user.token);
    if(!newPost.error){
      newPost.body.user = {
        username: this.props.user.username,
        avatar: this.props.user.avatar,
        _id: this.props.user._id
      }
      this.setState({ post: [].concat(this.state.post, newPost.body) });
    }
  }
  
  // async fetchAddData(data, id = "", modo = "") {
  //   let datos = {};
  //   let error = false
  //   if (modo) {
  //     id += "/";
  //   }
  //   await fetch(`${API_URL}api/post/${id}${modo}`, {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: this.props.user.token,
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((response) => (datos = response.body))
  //     .catch((err) => {
  //       console.error("[ERROR]", err)
  //       error = true
  //     });

  //   return {...datos, error: error};
  // }

  render() {
    return (
      <div className="postSection">
        {this.props.myPage && 
        <section className="agregar-post">
          <AgregarPost
            handleAddPost={this.handleAddPost}
          />
        </section>}
        <section className="ver-post">
          <ListaPost
            post={this.state.post}
            myPage={this.props.myPage}
          />
        </section>
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

export default connect(mapStateToProps, null)(PostSection);
