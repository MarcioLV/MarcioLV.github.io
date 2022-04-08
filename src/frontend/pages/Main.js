import React from "react";

import { connect } from "react-redux";
import { setUserPage } from "../actions";

import "./style/Main.css";

import { fetchPost } from "../utils/fetch";

import PostSection from "../components/Post_section/PostSection";
import Loading from "../components/Loading";
import Error from "../components/Error";

import config from "../config";
const API_URL = config.api.url;

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
    this.setState({ loading: true, error: false });
    this.tryFetchPost();
  }

  componentDidUpdate({ reload }) {
    if (reload !== this.props.reload) {
      this.setState({ loading: true, error: false });
      this.tryFetchPost();
    }
  }

  async tryFetchPost() {
    this.props.setUserPage({
      userPage: {
        username: null,
        avatar: null,
        _id: null,
      },
    });
    const options = {
      headers: {
        Authorization: this.props.user.token,
      },
    };
    let response = await fetchPost(options);
    if (!response.error) {
      this.setState({ post: response.body, loading: false, error: false });
    } else {
      this.setState({ loading: false, error: true });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return <Error />;
    }
    return (
      <div className="wall">
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
const mapDispatchToProps = {
  setUserPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
