import React, { useState } from "react";

import "./style/AgregarPost.css";


function AgregarPost(prop) {
  const [post, setPost] = useState("");

  const handleSubmit = () => {
    if(!post){
      return alert("Escribe algo")
    }
    
    prop.handleAddPost(post)
    setPost('')
  };

  return (
    <div className="addPost">
      <h4>UserName</h4>
      <input
        value={post}
        type="text"
        placeholder="Agregar un post"
        onChange={(e) => setPost(e.target.value)}
      />
      <button onClick={handleSubmit}>Agregar</button>
    </div>
  );
}

export default AgregarPost;
