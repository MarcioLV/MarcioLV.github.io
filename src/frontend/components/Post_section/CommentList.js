import React, { useState, useEffect } from "react";

import {connect} from "react-redux"
import config from "../../config"

import trash from "../../utils/icons/trash.png";

import "./style/ListaPost.css";


function CommentList(prop) {
  const {comments} = prop
  // const [comments, setComments ] = useState(prop.comments)
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
    const error = await fetchDeleteComment(commentId, postId);
    if(!error){
      prop.handleDeleteComment(index)
    }
  };

  const fetchDeleteComment= async (commentId, postId)=> {
    let error = false
    await fetch(`${config.api.url}:${config.api.port}/api/post/${postId}/comment`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: prop.user.token,
      },
      body: JSON.stringify({id: commentId}),
    })
      .then((response) => {if(response.status === 500){
        error = true 
      }})
      .catch((err) => {
        console.error("[ERROR]", err)
        error = true
      });

    return error;
  }

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