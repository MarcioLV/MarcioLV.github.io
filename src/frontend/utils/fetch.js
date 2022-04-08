import config from "../config";
const API_URL = config.api.url;

const fetchLogin = async (data) => {
  let options = {
    url: "api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return letTryFetch(options);
  // let response = await tryFetch(options);
  // return response;
};

const fetchModUser = async (user, opt) => {
  const options = {
    url: `api/user/${opt.userId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
    body: JSON.stringify(user),
  };
  return letTryFetch(options);
};

const fetchModUserAvatar = async (opt) => {
  let options = {
    url: `api/user/${opt.userId}`,
    method: "POST",
    headers: {
      Authorization: opt.token,
    },
    body: opt.info,
  };
  return letTryFetch(options);
};

const fetchPost = async (options) => {
  options.method = "GET";
  options.url = "api/post";
  return letTryFetch(options);
  // let response = await tryFetch(options);
  // return response;
};

const fetchAddPost = async (data, userToken) => {
  const options = {
    url: "api/post",
    method: "POST",
    headers: { Authorization: userToken },
    body: data,
  };
  return letTryFetch(options);
  // let response = await tryFetch(options);
  // return response;
};

const fetchDelPost = async (opt) => {
  const options = {
    url: `api/post/${opt.postId}`,
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
  };
  return letTryFetch(options);
  // const response = await tryFetch(options);
  // if (response.error) {
  //   alert("Hubo un error");
  //   console.error("[ERROR]" + response.body);
  // }
  // return response;
};

const fetchAddLike = async (opt) => {
  const options = {
    url: `api/post/${opt.postId}/like`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
    body: JSON.stringify({ user: opt.user }),
  };
  return letTryFetch(options);
  // const response = await tryFetch(options);
  // if (response.error) {
  //   alert("Hubo un error");
  //   console.error("[ERROR]" + response.body);
  // }
  // return response;
};

const fetchDeleteLike = async (opt) => {
  const options = {
    url: `api/post/${opt.postId}/like`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
    body: JSON.stringify({ user: opt.user }),
  };
  return letTryFetch(options);
  // const response = await tryFetch(options);
  // if (response.error) {
  //   alert("Hubo un error");
  //   console.error("[ERROR]" + response.body);
  // }
  // return response;
};

const fetchAddComment = async (opt) => {
  // let error = false;
  // let datos = {};
  const options = {
    url: `api/post/${opt.postId}/comment`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
    body: JSON.stringify(opt.newComment),
  };
  return letTryFetch(options);
  // const response = await tryFetch(options);
  // if (response.error) {
  //   alert("Hubo un error");
  //   console.error("[ERROR]" + response.body);
  // }
  // return response;
};

const fetchDeleteComment = async (opt) => {
  const options = {
    url: `api/post/${opt.postId}/comment`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: opt.token,
    },
    body: JSON.stringify({ id: opt.commentId }),
  };
  return letTryFetch(options);
};

const letTryFetch = async (options) => {
  const response = await tryFetch(options);
  if (response.error) {
    alert("Hubo un error");
    console.error("[ERROR]" + response.body);
  }
  return response;
};

const tryFetch = async (options) => {
  let response;
  try {
    response = await fetch(`${API_URL}${options.url}`, {
      method: options.method,
      mode: "cors",
      headers: options.headers,
      body: options.body,
    });
    response = await response.json();
  } catch (err) {
    response = { error: true, body: err };
  }
  return response;
};

export {
  fetchLogin,
  fetchPost,
  fetchAddPost,
  fetchDeleteLike,
  fetchAddLike,
  fetchDelPost,
  fetchAddComment,
  fetchDeleteComment,
  fetchModUser,
  fetchModUserAvatar
};
