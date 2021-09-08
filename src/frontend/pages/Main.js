import React from "react";
import config from "../config";

import {Redirect} from "react-router-dom";


import "./style/Main.css";

import PostSection from '../components/PostSection'
import Loading from '../components/Loading'
import Header from '../components/Header'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      post: [],
      user: {
        username: props.user.username,
        avatar: props.user.avatar,
        _id: props.user._id,
        token: "Bearer " + props.user.token,
      },
    };
  }
  
  componentDidMount() {
    console.log("main");
    this.fetchPost();
  }

  fetchPost() {
    this.setState({loading: true, error: false})
    const options = {
      headers: {
        Authorization: this.state.user.token,
      },
    };
    fetch(`${config.api.url}:${config.api.port}/post`, options)
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => Array.from(response.body))
      .then((response) => this.setState({ post: response, loading: false, error: false }))
      .catch((err) => console.error("[error]", err.message));
  }

  render() {
    if(this.state.loading){return <Loading />}
    return (
      <div className="wall">
        <Header handleLogout={this.props.handleLogout}/>
        <div className="wall-center">
          <PostSection user={this.state.user} post={this.state.post}/>
        </div>
      </div>
    );
  }
}

export default Main;
