import React, { useState, useEffect } from "react";

import {connect} from "react-redux"

import trash from "../../utils/icons/trash.png";
import {fetchDeleteComment} from '../../utils/fetch'

import "./style/CommentList.css";

import config from "../../config";
const API_URL = config.api.url

function CommentList(prop) {
  const {comments} = prop
  const [limit, setLimit] = useState(2);
  const [masComment, setMasComment] = useState("visible");

  useEffect(() => {
    if (limit >= comments.length) {
      setMasComment("hidden");
    } else {
      setMasComment("visible");
    }
  });

  const handleShowComment = () => {
    if (limit + 4 >= comments.length) {
      setMasComment("hidden");
      return setLimit(comments.length);
    }
    setLimit(limit + 4);
  };

  const handleDelComment = async (postId, commentId, index) => {
    const options = {
      commentId: commentId,
      postId: postId,
      token: prop.user.token
    }
    const response = await fetchDeleteComment(options);
    if(!response.error){
      prop.handleDeleteComment(index)
    }
  };
  
  return (
    <>
      <div className="post-comment_section-list">
        {comments.map((comentario, index) => {
          let commentStyle = {};
          if (index < comments.length - limit) {
            commentStyle = { display: "none" };
          }
          return (
            <div
              className="post-comment_section-comment"
              style={commentStyle}
              key={index}
            >
              <div className="post-comment_section-comment-text">
                <h4>{comentario.user.username}</h4>
                <p>{comentario.text}</p>
              </div>
              {
                comentario.user._id === prop.user._id ?
                  <button
                    onClick={() =>
                      handleDelComment(comentario.post, comentario._id, index)
                    }
                  >
                    <img src={trash} alt="Delete icon" />
                  </button> : 
                  <></>
              }
            </div>
          );
        })}
      </div>
      <div className="post-comment_section-button">
        <button onClick={handleShowComment} style={{ visibility: masComment }}>
          Ver mas comentarios
        </button>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};


export default connect(mapStateToProps, null)(CommentList);