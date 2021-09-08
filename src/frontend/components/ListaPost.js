import React, { useState, useEffect, useRef } from "react";
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
              avatar={avatar}
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
  const [cantLike, setCantLike] = useState(post.likes.length);
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
        setCantLike(cantLike - 1);
        return setLike("");
      }
      await method.handleAddLike(e.target.id);
      setLike("red");
      setCantLike(cantLike + 1);
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

  //imagen del post
  let picture = "";
  let imgStyle = { display: "none" };
  const maxWidth = 450;
  if (post.picture) {
    picture = post.picture;
    imgStyle.display = "flex";
  }
  //-----------
  let userImg = post.user.avatar ? post.user.avatar : avatar ? avatar : user;
  let usuario = post.user.username ? post.user.username : post.user;
  let userId = post.user._id;

  //imagen de perfil
  let i = useRef(null);
  const check = () => {
    if (userImg == user) {
      i.current.style.width = "35px";
    } else {
      let height = i.current.clientHeight;
      let width = i.current.clientWidth;
      const MAX_WIDTH = 50;
      const MAX_HEIGHT = 50;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      i.current.style.height = height + "px";
      i.current.style.width = width + "px";
    }
  };

  return (
    <>
      <div className="post-contenedor">
        <div className="post-user">
          <div className="post-user-info-username">
            <figure className="post-user-info-username-figure">
              <img
                src={userImg}
                ref={i}
                onLoad={check}
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
        <figure className="post-picture" style={imgStyle}>
          <img src={picture} style={imgStyle} />
        </figure>
        <div className="post-like">
          <button
            id={post._id}
            onClick={(e) => handleAddLike(e)}
            style={{ color: like }}
          >
            Me Gusta
            <small style={{ color: "white" }}> | {cantLike} | </small>
          </button>
          <button onClick={handleCommentStyle}>
            Comentar <small>| {post.comments.length} |</small>
          </button>
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
  const [masComment, setMasComment] = useState(
    "visible" /*(2>=comments.length ? ("none") : ("block"))*/
  );

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
                <h4>{comentario.user}</h4>
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
        <button onClick={handleShowComment} style={{ visibility: masComment }}>
          Ver mas comentarios
        </button>
      </div>
    </>
  );
}

export default ListaPost;
