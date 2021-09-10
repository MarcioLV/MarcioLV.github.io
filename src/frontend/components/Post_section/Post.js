import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import config from "../../config";

import CommentSection from "./CommentSection";

import user from "../../utils/icons/user.png";

import "./style/ListaPost.css";

function Post(prop) {
  const { post, handleDelPost, myPage, method } = prop;
  const [commentStyle, setCommentStyle] = useState({ display: "none" });
  const [deleteStyle, setDeleteStyle] = useState({ visibility: "hidden" });

  let waitLike = false;
  //asignar like activado/desactivado
  let likeColor = "";
  for (let element of post.likes) {
    if (element.user === prop.user.username) {
      likeColor = "red";
    }
  }
  const [like, setLike] = useState(likeColor);
  const [cantLike, setCantLike] = useState(post.likes.length);
  const [cantComment, setCantComment] = useState(post.comments.length);
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
  const handleDelComment = () => {
    setCantComment(cantComment - 1);
  };
  const handleAddNewComment = () => {
    setCantComment(cantComment + 1);
  }
  const handleCommentStyle = () => {
    if (commentStyle.display === "none") {
      return setCommentStyle({});
    }
    return setCommentStyle({ display: "none" });
  };

  //imagen del post
  let picture = "";
  let imgStyle = { display: "none" };
  if (post.picture) {
    picture = post.picture;
    imgStyle.display = "flex";
  }
  //-----------

  //imagen de perfil
  let i = useRef(null);
  const check = () => {
    if (postUserImg == user) {
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

  let postUserImg;
  if (post.user.avatar) {
    postUserImg = post.user.avatar;
  } else if (prop.userPage.avatar) {
    postUserImg = prop.userPage.avatar;
  } else {
    postUserImg = user;
  }
  let usuario = post.user.username ? post.user.username : post.user;
  let postUserId = post.user._id ? post.user._id : prop.userPage._id;
  return (
    <>
      <div className="post-contenedor">
        <div className="post-user">
          <div className="post-user-info-username">
            <figure className="post-user-info-username-figure">
              <img
                src={postUserImg}
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
                    pathname: "/" + postUserId,
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
          {post.user._id === prop.user._id || myPage ? (
            <div className="post-user-button">
              <button onClick={handleDeleteStyle}>...</button>
              <div
                className="post-user-delete"
                style={deleteStyle}
                onClick={() => handleDelePost(post._id)}
              >
                Eliminar Post
              </div>
            </div>
          ) : (
            <></>
          )}
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
            Comentar <small>| {cantComment} |</small>
          </button>
        </div>
        <section className="post-comment_section" style={commentStyle}>
          <CommentSection post={post} handleDelComment={handleDelComment} handleAddNewComment={handleAddNewComment} />
        </section>
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

export default connect(mapStateToProps, null)(Post);
