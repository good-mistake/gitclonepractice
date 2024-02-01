import React from "react";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { useNavigationForUser } from "./useNavigationForUser";

const Following = () => {
  const { username } = useParams();
  const { handleUser } = useNavigationForUser();
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${username}/following`)
      .then((res) => setFollowing(res.data))
      .catch((e) => {
        console.log("Error in following", e);
        setError("An error occurred in Following. Please try again.");
      });
  }, [username]);

  return (
    <div className="container">
      {" "}
      <div className="userName"> {username} : Following </div>
      <div className="containerInFollowing">
        {following
          ? following.map((user) => {
              return (
                <div key={user.id}>
                  <div>
                    {" "}
                    <img src={user.avatar_url} alt="profile pic" />
                  </div>{" "}
                  <div>{user.type}: </div>
                  <div
                    onClick={() => handleUser(user.login)}
                    className="clickable"
                  >
                    {user.login}
                  </div>
                </div>
              );
            })
          : "No Information available at this time, please try again later."}
      </div>{" "}
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Following;
