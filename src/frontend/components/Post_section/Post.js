import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";


import CommentSection from "./CommentSection";
import ViewImage from "../ViewImage";

import userIcon from "../../utils/icons/user.png";

import "./style/Post.css";

import config from "../../config";
const API_URL = config.api.url

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
  const [postDelete, setPostDelete] = useState({})
  const [isOpened, setIsOpened] = useState(false);
  //-----------------
  let img = useRef(null);
  let imgCon = useRef(null);
  //fecha post
  let date = post.date.slice(4, 15).split(" ");
  let time = post.date.slice(16, 21);
  //-----------

  const handleDeleteStyle = () => {
    if (deleteStyle.visibility === "hidden") {
      return setDeleteStyle({});
    }
    return setDeleteStyle({ visibility: "hidden" });
  };

  
  const handleAddLike = async (e) => {
    if (!waitLike) {
      waitLike = true;
      if (like === "red") {
        const response = await fetchDeleteLike(post._id);
        if (response.error) {
          waitLike = false;
          return alert("Hubo un Error");
        }
        waitLike = false;
        setCantLike(cantLike - 1);
        return setLike("");
      }
      const response = await fetchAddLike(post._id);
      if (response.error) {
        waitLike = false;
        return alert("Hubo un Error");
      }
      setLike("red");
      setCantLike(cantLike + 1);
      waitLike = false;
    }
  };

  const handleDelePost = async (postId) => {
    const response = await fetchDelPost(postId);
    if(response.error){
      console.error("[error]", response.body);
      return alert("Hubo un Error");
    }
    setPostDelete({display: "none"})
  };

  const fetchAddLike = async (postId) => {
    const likeUser = {
      user: prop.user.username,
    };
    try {
      let response = await fetch(
        `${API_URL}api/post/${postId}/like`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: prop.user.token,
          },
          body: JSON.stringify(likeUser),
        }
      );
      response = response.json();
      return response;
    } catch (err) {
      let response = { error: true, body: err };
      return response;
    }
  };

  const fetchDelPost = async (postId) => {
    try {
      let response = await fetch(
        `${API_URL}api/post/${postId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: prop.user.token,
          },
        }
      );
      response = await response.json();
      return response;
    } catch (err) {
      console.error("[error]", err);
      let response = { error: true };
      return response;
    }
  };

  const fetchDeleteLike = async (postId) => {
    const likeUser = {
      user: prop.user.username,
    };
    try {
      let response = await fetch(
        `${API_URL}api/post/${postId}/like`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: prop.user.token,
          },
          body: JSON.stringify(likeUser),
        }
      );
      response = await response.json();
      return response;
    } catch (err) {
      console.error("[error]", err);
      let response = { error: true };
      return response;
    }
  };

  const handleDelComment = () => {
    setCantComment(cantComment - 1);
  };

  const handleAddNewComment = () => {
    setCantComment(cantComment + 1);
  };

  const handleCommentStyle = () => {
    if (commentStyle.display === "none") {
      return setCommentStyle({});
    }
    return setCommentStyle({ display: "none" });
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  const check = () => {
    const width = img.current.width;
    const height = img.current.height;
    const conWidth = imgCon.current.clientWidth;
    if (width >= height) {
      if (height <= conWidth) {
        img.current.style.minHeight = conWidth + "px";
      } else {
        img.current.style.maxHeight = conWidth + "px";
      }
    } else {
      if (width <= conWidth) {
        img.current.style.minWidth = conWidth + "px";
      } else {
        img.current.style.maxWidth = conWidth + "px";
      }
    }
  };

  let style = "";
  let postUserImg 
  if (post.user.avatar) {
    postUserImg = post.user.avatar;
  } else if (prop.userPage.avatar) {
    postUserImg = prop.userPage.avatar;
  } else {
    postUserImg = userIcon;
    style = "_default";
  }

  let picture = post.picture ? post.picture : ""

  let usuario = post.user.username ? post.user.username : post.user;
  let postUserId = post.user._id ? post.user._id : prop.userPage._id;
  let myPost =
    post.user._id === prop.user._id
      ? true
      : prop.user._id === prop.userPage._id
      ? true
      : false;

  return (
    <div className="post" style={postDelete}>
      <div className="post-contenedor" >
        <div className="post-user">
          <div className="post-user-info-username">
            <Link
              to={{
                pathname: "/perfil/" + postUserId,
              }}
            >
              <figure className="post-user-info-username-figure" ref={imgCon}>
                <img
                  src={API_URL + postUserImg}
                  alt="user"
                  className={`post-user-info-username-figure-img${style}`}
                  onLoad={postUserImg !== userIcon ? check : undefined}
                  ref={img}
                />
              </figure>
            </Link>
            <div className="post-user-info-username-figure-info">
              <h3>
                <Link
                  to={{
                    pathname: "/perfil/" + postUserId,
                  }}
                >
                  {usuario}
                </Link>
              </h3>
              <small>
                {date[1] + " " + date[0]} {time}
              </small>
            </div>
          </div>
          {myPost && (
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
          )}
        </div>
        {post.text && <div className="post-text">{post.text}</div>}
        {picture && (
          <figure className="post-picture">
            <img src={API_URL + picture} onClick={() => setIsOpened(true)}/>
          </figure>
        )}
        <ViewImage
          onClose={() => closeModal()}
          isOpened={isOpened}
          image={picture}
        />
        <div className="post-like">
          <button
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
          <CommentSection
            post={post}
            handleDelComment={handleDelComment}
            handleAddNewComment={handleAddNewComment}
          />
        </section>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPage: state.userPage,
  };
};

export default connect(mapStateToProps, null)(Post);