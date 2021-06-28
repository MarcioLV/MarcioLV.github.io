import React, { useState } from "react";

import "./style/ListaPost.css";

function ListaPost(prop) {
  const { post, ...method } = prop;
  console.log(post);

  if (post.length === 0) {
    return <div>Loading</div>;
  }

  let invertPost = post;
  return (
    <>
      {invertPost.map((element) => {
        return (
          <div key={element._id} className="post">
            <Post post={element} method={method} />
          </div>
        );
      })}
    </>
  );
}

function Post(prop) {
  const { post, method } = prop;
  const [comment, setComment] = useState("");
  const [like, setLike] = useState({color: "red"})

  // const postLike = true

  // if(postLike){
  //   setLike({color: "red"})
  // }

  const handleAddLike = (e) => {
    method.handleAddLike(e.target.id);
  };

  const handleAddComment = (e) => {
    method.handleAddComment(e.target.id, comment);
    setComment("");
  };

  return (
    <>
      <div className="contenedor">
        <div className="post-user">
          <h3>{post.user}</h3>
          <small>{post.date}</small>
        </div>
        <div className="post-text">{post.text}</div>
        <div className="post-like">
          <button 
            id={post._id} 
            onClick={(e) => handleAddLike(e)}
            style={like}            
          >
            Like
          </button>
          <button>Comment</button>
        </div>
        <section className="post-comment_section">
          <div className="post-comment_section-input">
            <input
              value={comment}
              type="text"
              placeholder="Agrega un comentario"
              onChange={(e) => setComment(e.target.value)}
            />
            <button id={post._id} onClick={(e) => handleAddComment(e)}>
              Agregar
            </button>
          </div>
          <div className="post-comment_section-list">
            <CommentList />
            <CommentList />
          </div>
        </section>
      </div>
    </>
  );
}

function CommentList() {
  return (
    <>
      <div className="post-comment_section-comment">
        <h5>Username</h5>
        <p>Este es un commentario</p>
      </div>
    </>
  );
}

export default ListaPost;
