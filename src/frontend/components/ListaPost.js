import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import trash from "../utils/icons/trash.png";
import user from "../utils/icons/user.png";

import "./style/ListaPost.css";

function ListaPost(prop) {
  const { post, username, avatar, handleDeletePost, ...method } = prop;
  if (post.length === 0) {
    return <div className="noHayPost">No hay post</div>;
  }

  const handleDelPost = async (id) => {
    await handleDeletePost(id);
  };

  return (
    <>
      {post.map((element) => {
        return (
          <div key={element._id} className="post">
            <Post
              post={element}
              username={username}
              avatar= {avatar}
              handleDelPost={handleDelPost}
              method={method}
            />
          </div>
        );
      })}
    </>
  );
}

function Post(prop) {
  const { post, username, avatar, handleDelPost, method } = prop;
  const [postComment, setPostComment] = useState(post.comments);
  const [comment, setComment] = useState("");
  const [commentStyle, setCommentStyle] = useState({ display: "none" });
  const [deleteStyle, setDeleteStyle] = useState({ visibility: "hidden" });

  //mostrar borrar post
  let myPost = { display: "none" };
  if (post.user.username === username) {
    myPost = {};
  }
  //--------------------------------

  let waitLike = false;
  //asignar like activado/desactivado
  let likeColor = "";
  for (let element of post.likes) {
    if (element.user === username) {
      likeColor = "red";
    }
  }
  const [like, setLike] = useState(likeColor);
  //-----------------

  //arregler fecha post
  let date = post.date.slice(0, 10);
  let time = post.date.slice(11, 16);
  //-----------
  const handleDeleteStyle = () => {
    if (deleteStyle.visibility === "hidden") {
      return setDeleteStyle({});
    }
    return setDeleteStyle({ visibility: "hidden" });
  };

  const handleDelePost = (postId) => {
    handleDelPost(postId);
  };

  const handleAddLike = async (e) => {
    if (!waitLike) {
      waitLike = true;
      if (like === "red") {
        await method.handleDeleteLike(e.target.id);
        waitLike = false;
        return setLike("");
      }
      await method.handleAddLike(e.target.id);
      setLike("red");
      waitLike = false;
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const nuevoCom = comment;
    setComment("");
    const newComment = await method.handleAddComment(e.target.id, nuevoCom);
    let pushComment = postComment;
    pushComment.push(newComment);
    setPostComment([]);
    setPostComment(pushComment);
  };
  const handleDeleteComment = async (post, commentId, index) => {
    const error = await method.handleDeleteComment(post, commentId);
    if (!error) {
      let deleteComment = postComment;
      setPostComment([]);
      deleteComment.splice(index, 1);
      setPostComment(deleteComment);
    }
  };
  const handleCommentStyle = () => {
    if (commentStyle.display === "none") {
      return setCommentStyle({});
    }
    return setCommentStyle({ display: "none" });
  };
  let userImg = post.user.avatar ? (post.user.avatar) : avatar ? (avatar) : (user)
  let usuario = post.user.username ? (post.user.username) : (post.user)
  let userId = post.user._id
  return (
    <>
      <div className="post-contenedor">
        <div className="post-user">
          <div className="post-user-info-username">
            <figure className="post-user-info-username-figure">
              <img
                src={userImg}
                alt="user"
                className="post-user-info-username-figure-img"
              />
            </figure>
            <div className="post-user-info-username-figure-info">
              <h3>
                <Link
                  to={{
                    pathname: "/" + userId,
                  }}
                >
                  {usuario}
                </Link>
              </h3>
              <small>
                {date} {time}
              </small>
            </div>
          </div>

          <div className="post-user-button" style={myPost}>
            <button onClick={handleDeleteStyle}>...</button>
            <div
              className="post-user-delete"
              style={deleteStyle}
              onClick={() => handleDelePost(post._id)}
            >
              Eliminar Post
            </div>
          </div>
        </div>
        <div className="post-text">{post.text}</div>
        <div className="post-like">
          <button
            id={post._id}
            onClick={(e) => handleAddLike(e)}
            style={{ color: like }}
          >
            Me Gusta
          </button>
          <button onClick={handleCommentStyle}>Comentar</button>
        </div>
        <section className="post-comment_section" style={commentStyle}>
          <form action="">
            <div className="post-comment_section-input">
              <input
                value={comment}
                type="text"
                placeholder="Agrega un comentario"
                onChange={(e) => setComment(e.target.value)}
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
            username={username}
            handleDeleteComment={handleDeleteComment}
          />
        </section>
      </div>
    </>
  );
}

function CommentList(prop) {
  const { comments, username, handleDeleteComment } = prop;
  const [limit, setLimit] = useState(2);

  const handleShowComment = () => {
    if (limit + 4 > comments.length) {
      return setLimit(comments.length);
    }
    setLimit(limit + 4);
  };

  const handleComment = (post, commentId, index) => {
    handleDeleteComment(post, commentId, index);
  };

  return (
    <>
      <div className="post-comment_section-list">
        {comments.map((comentario, index) => {
          let commentStyle = {};
          let delStyle = { display: "none" };
          if (index < comments.length - limit) {
            commentStyle = { display: "none" };
          }
          if (comentario.user === username) {
            delStyle = {};
          }
          return (
            <div
              className="post-comment_section-comment"
              style={commentStyle}
              key={index}
            >
              <div className="post-comment_section-comment-text">
                <h5>{comentario.user}</h5>
                <p>{comentario.text}</p>
              </div>
              <button
                style={delStyle}
                onClick={() =>
                  handleComment(comentario.post, comentario._id, index)
                }
              >
                <img src={trash} alt="Delete icon" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="post-comment_section-button">
        <button onClick={handleShowComment}>Ver mas comentarios</button>
      </div>
    </>
  );
}

export default ListaPost;
