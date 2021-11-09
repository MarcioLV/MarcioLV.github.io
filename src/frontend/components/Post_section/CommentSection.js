import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";


import CommentList from "./CommentList";
import "./style/CommentSection.css";

import config from "../../config";
const API_URL = config.api.url

function CommentSection(props) {
  const { post, handleDelComment, handleAddNewComment } = props;
  const [postComment, setPostComment] = useState(post.comments);
  const [comment, setComment] = useState("");
  const [height, setHeight] = useState();

  let h = useRef(null);
  const textareaheight = 20;

  const handleModComment = (e) => {
    if (e.target.value.slice(-1) !== "\n") {
      setComment(e.target.value);
      h.current.style.height = textareaheight + "px";
      h.current.style.height = h.current.scrollHeight + "px";
    }
  };

  const handleAddComment = async () => {
    if(!comment){
      return
    }
    const postId = post._id;
    const newComment = {
      user: {
        username: props.user.username,
        _id: props.user._id,
      },
      text: comment,
    };
    setComment("");
    const response = await fetchAddComment(postId, newComment);
    if (!response.error || !response.body.error) {
      newComment.post = postId;
      newComment._id = response.body._id;
      setPostComment([].concat(postComment, newComment));
      h.current.style.height = textareaheight + "px";
      handleAddNewComment();
    } else {
      alert("sucedio un error");
    }
  };

  const fetchAddComment = async (postId, data) => {
    let error = false;
    let datos = {};
    await fetch(
      `${API_URL}api/post/${postId}/comment`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.user.token,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((response) => (datos = response))
      .catch((err) => {
        console.error("[ERROR]", err);
        error = true;
      });

    return { ...datos, error };
  };

  const handleDeleteComment = (index) => {
    let com = postComment;
    com.splice(index, 1);
    setPostComment([].concat(com));
    handleDelComment();
  };

  const handleSubmit = (e) => {
    if (e.charCode === 13) {
      if (!e.shiftKey) {
        handleAddComment();
      } else {
        setComment(msj + "\n");
        h.current.style.height = textareaheight + "px";
        h.current.style.height = h.current.scrollHeight + "px";
      }
    }
  };
  return (
    <>
      <div className="post-comment_section-input">
        <div className="post-comment_section-input-container">
          <textarea
            value={comment}
            type="text"
            placeholder="Agrega un comentario"
            ref={h}
            onChange={(e) => handleModComment(e)}
            onKeyPress={(e) => {
              handleSubmit(e);
            }}
          />
          <button
            type="submit"
            id={post._id}
            onClick={(e) => handleAddComment(e)}
          >
            Agregar
          </button>
        </div>
      </div>
      <CommentList
        comments={postComment}
        handleDeleteComment={handleDeleteComment}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};

export default connect(mapStateToProps, null)(CommentSection);
