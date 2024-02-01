import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigationForUser } from "./useNavigationForUser";

const Followers = () => {
  const { username } = useParams();
  const { handleUser } = useNavigationForUser();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${username}/followers`)
      .then((res) => setFollowers(res.data))
      .catch((e) => {
        console.log("error in followers", e);
        setError("An error occurred in followers. Please try again.");
      });
  }, [username]);

  return (
    <div className="container">
      <div className="userName">{username} Followers </div>
      <div className="containerInFollowers">
        {followers
          ? followers.map((users) => {
              return (
                <div key={users.id}>
                  <div>
                    {" "}
                    <img src={users.avatar_url} alt="follower pic" />
                  </div>
                  <div>{users.type} : </div>
                  <div
                    onClick={() => handleUser(users.login)}
                    className="clickable"
                  >
                    {users.login}
                  </div>
                </div>
              );
            })
          : "No Information available at this time, please try again later."}
      </div>
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Followers;
