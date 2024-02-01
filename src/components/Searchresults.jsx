import React from "react";
const Searchresults = ({ result, handleUser }) => {
  return (
    <div key={result.id} onClick={() => handleUser(result.login)}>
      <img
        className="searchResultImg"
        src={result.avatar_url}
        alt="profile pic"
      />
      <div className="searchResultName">{result.login}</div>
    </div>
  );
};
export default Searchresults;
