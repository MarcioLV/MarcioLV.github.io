import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import SearchUser from "../components/SearchUser";
import Loading from "../components/Loading";
import Error from "../components/Error";

import { connect } from "react-redux";

import "./style/SearchPage.css";

import config from "../../../config";
const API_URL = config.api.url

const SearchPage = (prop) => {
  const [users, setUsers] = useState();
  const [state, setState] = useState({ loading: true, error: false });

  let search = prop.data.match.params.search;

  useEffect(() => {
    handleFetchUsers();
  }, [search]);

  const handleFetchUsers = async () => {
    setState({ loading: true, error: false });
    const response = await fetchUsers();
    if (response.error) {
      console.error(response.body);
      return setState({ loading: false, error: true });
    }
    setUsers(response.body);
    setState({ loading: false, error: false });
  };

  const fetchUsers = async () => {
    try {
      let response = await fetch(
        `${API_URL}api/user?user=${search}`,
        {
          headers: {
            Authorization: "Bearer " + prop.user.token,
          },
        }
      );
      response = await response.json();
      return response;
    } catch (error) {
      let err = {
        error: true,
        body: error,
      };
      return err;
    }
  };

  if (state.loading) {
    return <Loading />;
  }

  if (state.error) {
    return <Error />;
  }

  return (
    <div className="searchPage">
      <div className="searchPage-container">
        <h2>Usuarios Encontrados</h2>
        {users.map((user) => {
          return (
            <div className="searchPage_user" key={user._id}>
              <Link
                to={{
                  pathname: "/perfil/" + user._id,
                }}
              >
                <SearchUser user={user} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(SearchPage);
