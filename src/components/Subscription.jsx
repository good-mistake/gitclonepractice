import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigationForUser } from "./useNavigationForUser";
const Subscription = () => {
  const { username } = useParams();
  const [subscription, setSubscription] = useState([]);
  const { handleUser, handleExactRepo } = useNavigationForUser();
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${username}/subscriptions`)
      .then((res) => setSubscription(res.data))
      .catch((e) => {
        console.log("Error in following", e);
        setError("An error occurred in Subscription. Please try again.");
      });
  }, [username]);
  return (
    <div className="container">
      <h2
        className="userSubscriptionOwner clickable"
        onClick={() => handleUser(username)}
      >
        Subscription : {username}
      </h2>
      <div className="containerInSubscription">
        {subscription
          ? subscription.map((user) => {
              return (
                <div key={user.id} className="subscriptions">
                  <div
                    className="ownerProfilePage clickable"
                    onClick={() => handleUser(user.owner.login)}
                  >
                    {" "}
                    <img src={user.owner?.avatar_url} alt="Profile pic" />
                    <div className="userName"> Owner : {user.owner.login}</div>
                  </div>
                  <div
                    className="clickable"
                    onClick={() => handleExactRepo(user.owner.login, user.name)}
                  >
                    Repo Name: {user.name}
                  </div>
                  <div>
                    {user.has_downloads === true
                      ? "has been downloaded"
                      : "No Downloads yet"}
                  </div>
                  <div>Number of open issues: {user.open_issues}</div>
                  {/* <div>{user.git_commits_url}</div> */}
                  <div>
                    Forks : {user.fork === true ? user.forks : "No forks"}
                  </div>
                  <div>stargazers : {user.stargazers_count}</div>
                  <div>
                    License :{" "}
                    {user.license?.name ? user.license?.name : "No license"}
                  </div>
                  <div>
                    Full name address :{" "}
                    {user.full_name
                      ? user.full_name
                      : "No name available at this time"}
                  </div>
                  <div>
                    Main language :{" "}
                    {user.language
                      ? user.language
                      : "No languages at this time"}
                  </div>
                  <div>
                    Description :{" "}
                    {user.description
                      ? user.description
                      : "Owner didn't provide any descriptions"}
                  </div>
                  <div>
                    {user.has_wiki === true ? "Wiki available" : "No Wiki"}
                  </div>
                  <div>
                    {user.has_discussions === true
                      ? user.comments_url
                      : "No Comments Discussions"}
                  </div>{" "}
                  <div>
                    <a href={user.clone_url}>click for Github Link </a>
                  </div>
                </div>
              );
            })
          : "No Information is available at this moment, please try again later."}
        {subscription.length <= 0 ? (
          <div className="noSubscription">
            NO Subscription right now, click on the owner's name top to go back
            to owners profile
          </div>
        ) : (
          ""
        )}
      </div>{" "}
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Subscription;
