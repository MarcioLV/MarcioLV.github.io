import React from "react";
import { connect } from "react-redux";

import Post from './Post'
import AgregarPost from "./AgregarPost";

import { fetchAddPost } from "../../utils/fetch";

import "./style/PostSection.css";

class PostSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: this.props.post,
    };
    this.handleAddPost = this.handleAddPost.bind(this);
  }

  async handleAddPost(text, picture) {
    let formdata = new FormData();
    formdata.append("picture", picture);
    formdata.append("user", this.props.user._id);
    formdata.append("text", text);

    let newPost = await fetchAddPost(formdata, this.props.user.token);
    if (!newPost.error) {
      newPost.body.user = {
        username: this.props.user.username,
        avatar: this.props.user.avatar,
        _id: this.props.user._id,
      };
      this.setState({ post: [].concat(this.state.post, newPost.body) });
    }
  }

  render() {
    return (
      <div className="postSection">
        {this.props.myPage && (
          <section className="agregar-post">
            <AgregarPost handleAddPost={this.handleAddPost} />
          </section>
        )}
        <section className="ver-post">
          {this.state.post.length === 0 ? (<div className="noHayPost">No hay post</div>) :
          (this.state.post.map((element) => {
            return (
              <React.Fragment key={element._id}>
                <Post post={element} myPage={this.props.myPage}/>
              </React.Fragment>
            );
          }))}
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
