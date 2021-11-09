import React from "react";

import { connect } from "react-redux";
import { setUserPage } from "../actions";

import "./style/Main.css";

import PostSection from "../components/Post_section/PostSection";
import Loading from "../components/Loading";
import Error from "../components/Error";

import config from "../../../config";
const API_URL = config.api.url

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

  componentDidUpdate({reload}){
    if(reload !== this.props.reload){
      this.fetchPost()
    }
  }

  fetchPost() {
    this.props.setUserPage({
      userPage: {
        username: null,
        avatar: null,
        _id: null,
      },
    });
    this.setState({ loading: true, error: false });
    const options = {
      headers: {
        Authorization: this.props.user.token,
      },
    };
    fetch(`${API_URL}api/post`, options)
      .then((response) => response.json())
      .then((response) =>
        this.setState({ post: response.body, loading: false, error: false })
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
