import config from "../config";
const API_URL = config.api.url;

const fetchLogin = async (data) => {
  let options = {
    url: "api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
  let response = await tryFetch(options)
  return response
};

const fetchPost = async (options) => {
  options.method = "GET"
  options.url = "api/post"
  let response = await tryFetch(options)
  return response
}

const fetchAddPost = async(data, userToken) => {
  const options = {
    url: "api/post",
    method: "POST",
    headers: { Authorization: userToken },
    body: data
  };
  let response = await tryFetch(options)
  return response
  // let datos = await fetch(`${API_URL}api/post`, {
  //   method: "POST",
  //   mode: "cors",
  //   headers: {
  //     Authorization: this.props.user.token,
  //   },
  //   body: data,
  // })
  //   .then((response) => response.json())
  //   .catch((err) => {
  //     console.error("[ERROR]", err)
  //     alert("No se pudo agregar el Post")
  //     // error = true
  //   });
  // return datos
}

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
    alert("Hubo un error");
    console.error("[ERROR]" + err);
  }
  return response;
};

export { fetchLogin, fetchPost, fetchAddPost };
