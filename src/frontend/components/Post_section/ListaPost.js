import React from "react";
import {connect} from "react-redux"

import Post from './Post'

import "./style/ListaPost.css";

function ListaPost(prop) {
  const { post, handleDeletePost, myPage, ...method } = prop;
  if (post.length === 0) {
    return <div className="noHayPost">No hay post</div>;
  }
  return (
    <>
      {post.map((element) => {
        return (
          <div key={element._id} className="post">
            <Post
              post={element}
              myPage={myPage}
              method={method}
            />
          </div>
        );
      })}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};

export default connect(mapStateToProps, null)(ListaPost);

