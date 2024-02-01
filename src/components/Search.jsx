import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import octokit from "./octokit";
import { useNavigationForUser } from "./useNavigationForUser";
import debounce from "lodash.debounce";
import Searchresults from "./Searchresults";

const Search = () => {
  const [search, setSearch] = useState([]);
  const [userInput, setUserInput] = useState("");
  const { handleUser } = useNavigationForUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchTopic = debounce(async () => {
    try {
      setLoading(true);
      const res = await octokit.request("GET /search/users", {
        q: userInput,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      setSearch(res.data);
    } catch (e) {
      console.log(e);
      setError("An error occurred during the search. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 400);
  useEffect(() => {
    if (userInput.trim() === "") {
      setSearch([]);
      setLoading(false);
      return;
    }
    fetchTopic();
  }, [userInput]);
  const handleShowResult = () => {
    navigate(`/search/result/${userInput}`);
  };
  const handleUserResult = (username) => {
    setUserInput("");
    handleUser(username);
  };
  return (
    <div className="containerInSearch">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter username"
        className="searchInput"
        onBlur={() => setLoading(false)}
      />{" "}
      <button onClick={fetchTopic}>Search</button>
      <div className={userInput.trim() === "" ? "" : `searchResults`}>
        {userInput && loading && <p>Loading...</p>}
        {!loading &&
          userInput &&
          (search.items?.length > 0 ? (
            search.items
              .slice(0, 5)
              .map((result) => (
                <Searchresults
                  key={result.id}
                  result={result}
                  handleUser={handleUserResult}
                />
              ))
          ) : (
            <p>No User was found.</p>
          ))}
        {userInput && search.items?.length > 8 && (
          <button className="seeAllButton" onClick={handleShowResult}>
            See all the results
          </button>
        )}{" "}
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </div>
  );
};

export default Search;
