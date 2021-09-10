import React, {useState, useRef} from "react";
import { connect } from "react-redux";

import config from '../../config'

import CommentList from "./CommentList";
import "./style/ListaPost.css";

function CommentSection(props) {
  const {post, handleDelComment, handleAddNewComment} = props
  const [postComment, setPostComment] = useState(post.comments);
  const [comment, setComment] = useState("");

  let h = useRef(null);
  const textareaheight = 20;

  const handleModComment = (e) => {
    h.current.style.height = textareaheight + "px";
    h.current.style.height = h.current.scrollHeight + "px";
    setComment(e.target.value);
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    const postId = e.target.id
    const newComment = {
      user: {
        username: props.user.username,
        _id: props.user._id
      },
      text: comment 
    }
    const response = await fetchAddComment(postId, newComment);
    if(!response.error || !response.body.error){
      newComment.post = postId
      newComment._id = response.body._id
      setPostComment([].concat(postComment, newComment));
      setComment('')
      handleAddNewComment()
    }else{
      alert("sucedio un error")
    }
  };

  const fetchAddComment = async (postId, data) => {
    let error = false
    let datos = {}
    await fetch(`${config.api.url}:${config.api.port}/post/${postId}/comment`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.user.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => datos = response)
      .catch((err) => {
        console.error("[ERROR]", err)
        error = true
      });

    return {...datos, error}
  }

  const handleDeleteComment = (index) => {
    let com = postComment
    com.splice(index, 1)
    setPostComment([].concat(com))
    handleDelComment()
  }

  return (
    <>
      <form action="">
        <div className="post-comment_section-input">
          <textarea
            value={comment}
            type="text"
            placeholder="Agrega un comentario"
            style={{ height: textareaheight + "px" }}
            ref={h}
            onChange={(e) => handleModComment(e)}
          />
          <button
            type="submit"
            id={post._id}
            onClick={(e) => handleAddComment(e)}
          >
            Agregar
          </button>
        </div>
      </form>
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