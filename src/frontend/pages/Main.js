import React from "react";
import config from "../config";

import { connect } from "react-redux";

import "./style/Main.css";

import PostSection from "../components/Post_section/PostSection";
import Loading from "../components/Loading";
import Header from "../components/Header";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      post: [],
    };
  }

  componentDidMount() {
    this.fetchPost();
  }

  fetchPost() {
    this.setState({ loading: true, error: false });
    const options = {
      headers: {
        Authorization: this.props.user.token,
      },
    };
    fetch(`${config.api.url}:${config.api.port}/post`, options)
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((response) => Array.from(response.body))
      .then((response) =>
        this.setState({ post: response, loading: false, error: false })
      )
      .catch((err) => {
        console.error("[error]", err.message)
        this.setState({loading: false, error: true})

      });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return "error";
    }
    return (
      <div className="wall">
        <Header handleLogout={this.props.handleLogout} />
        <div className="wall-center">
          <PostSection myPage={true} post={this.state.post} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(Main);
