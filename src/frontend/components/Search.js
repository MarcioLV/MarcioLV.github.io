import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import searchIcon from "../utils/icons/search-icon.png";
import "./style/Search.css";

const Search = (props) => {
  const [searchInp, setSearchInp] = useState("");
  let history = useHistory();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInp) {
      return;
    }
    history.push("/search/" + searchInp);
  };

  return (
    <div className="search-container">
      <div className="Main_container">
        <form className="search-input">
          <input
            type="text"
            placeholder="Buscar"
            value={searchInp}
            onChange={(e) => setSearchInp(e.target.value)}
          />
          <button
            type="submit"
            onClick={(e) => handleSearch(e)}
            className="search-input_search"
          >
            <img src={searchIcon} alt="search-Icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
