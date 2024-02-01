import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useReducer } from "react";
import octokit from "./octokit";

interface UserState {
  userData: any;
  error: boolean;
  numberOfContribute: any;
  repos: any;
  loading: boolean;
}
type Action =
  | { type: "setUserData"; payload: any }
  | { type: "setError"; payload: boolean }
  | { type: "setNumberOfContribute"; payload: any }
  | { type: "setRepos"; payload: any }
  | { type: "setLoading"; payload: boolean };
const initialState: UserState = {
  userData: "",
  error: false,
  numberOfContribute: "",
  repos: [],
  loading: false,
};
const userReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case "setUserData":
      return { ...state, userData: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    case "setNumberOfContribute":
      return { ...state, numberOfContribute: action.payload };
    case "setRepos":
      return { ...state, repos: action.payload };
    case "setLoading":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
const User: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [error, setError] = useState<string>("");

  const [state, dispatch] = useReducer(userReducer, initialState);
  const { userData, numberOfContribute, loading, repos } = state;
  // href={userData.followers_url}

  const fetchUserData = async () => {
    try {
      dispatch({ type: "setLoading", payload: true });
      const res = await octokit.request(`GET /users/${username}`, {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      dispatch({ type: "setUserData", payload: res.data });
      dispatch({ type: "setError", payload: false });
    } catch (e) {
      console.log(e);
      setError("An error occurred in User. Please try again.");

      dispatch({ type: "setUserData", payload: "" });
      dispatch({ type: "setError", payload: true });
    } finally {
      dispatch({ type: "setLoading", payload: false });
    }
  };
  const handleFollowers = () => {
    navigate(`/users/${username}/followers`);
  };
  const handleFollowing = () => {
    navigate(`/users/${username}/following`);
  };
  const handleRepo = () => {
    navigate(`/users/${username}/repos`);
  };
  const handleOneRepo = (repo) => {
    navigate(`/users/${username}/repo/${repo}`);
  };
  const handleSubscription = () => {
    navigate(`/users/${username}/subscriptions`);
  };
  const getContributions = async () => {
    try {
      const store = await fetch(
        `https://github-contributions-api.jogruber.de/v4/good-mistake?y=last`
      );
      const data = await store.json();
      dispatch({ type: "setNumberOfContribute", payload: data });
    } catch (e) {
      console.log(e, "erorr");
    }
  };
  const getRepos = async () => {
    if (userData && userData.repos_url) {
      try {
        const store = await fetch(userData.repos_url);
        const res = await store.json();
        dispatch({ type: "setRepos", payload: res });
      } catch (e) {
        console.log(e, "error fetching repositories");
      }
    }
  };
  useEffect(() => {
    getContributions();
    fetchUserData();
  }, [username]);
  useEffect(() => {
    getRepos();
  }, [userData]);
  const sliced = repos.slice(0, 9);
  return (
    <>
      <div className="container">
        {" "}
        {loading && <div className="loading">Loading...</div>}{" "}
        <div className="profilePageDisplay">
          <div className="containerInUser">
            <img src={userData?.avatar_url} alt="profile pic" />{" "}
            <h2> {username}</h2>
            <div>{userData?.name ? userData.name : "....."}</div>
            <div>{userData?.bio ? userData.bio : "No bio at this time"}</div>
            <div>{userData?.blog ? userData.blog : "No Blog available"}</div>
            <div>
              {userData?.hireable ? "Available for hire" : "Not hireable"}
            </div>
            <div>
              {userData?.twitter_username
                ? userData.twitter_username
                : "No social media "}
            </div>
            <div>
              Public repositories :
              {userData?.public_repos
                ? userData?.public_repos
                : "User doesn't have any public repositories"}
            </div>
            <div onClick={handleRepo} className="clickable">
              Repositories...
            </div>{" "}
            <div onClick={handleFollowers} className="clickable">
              {userData?.followers} followers
            </div>
            <div onClick={handleFollowing} className="clickable">
              {userData?.following} following
            </div>{" "}
            <div>{userData?.email ? userData.email : "No email entered"}</div>
            <div>
              {userData?.location ? userData?.location : "Location unknown"}
            </div>
            <div>
              {userData?.organization_url
                ? userData?.organization_url
                : "No organizations"}
            </div>
            <div onClick={handleSubscription} className="clickable">
              Subscriptions
            </div>
            <div>{userData?.company ? userData?.company : "No Company"}</div>
            <div>{userData?.created_at}</div>
          </div>
          <div className="repos">
            {" "}
            <div className="card-header">Favorite Repositories</div>
            {repos ? (
              repos.length > 9 ? (
                <div className="cardBody">
                  {sliced.map((e) => {
                    return (
                      <div
                        className="repoList clickableRepo"
                        onClick={() => {
                          handleOneRepo(e.name);
                        }}
                      >
                        <div className="repoListName">
                          <div>{e.name}</div>
                          <div className="private-or-public">
                            {" "}
                            {e.private === "false" ? "Private" : "Public"}
                          </div>
                        </div>
                        <div className="codeLanguage"> {e.language}</div>
                        <div>{e.description ? e.description : ""}</div>
                        <div>{e.fork ? e.fork : ""}</div>{" "}
                      </div>
                    );
                  })}{" "}
                  <div onClick={handleRepo} className="clickable">
                    See other repositories...
                  </div>
                </div>
              ) : (
                <div className="cardBody">
                  {repos.map((e) => {
                    return (
                      <ul className="repoList">
                        <li>
                          <div>{e.name}</div>
                          <div className="private-or-public">
                            {" "}
                            {e.private === "false" ? "Private" : "Public"}
                          </div>
                        </li>
                        <li className="codeLanguage"> {e.language}</li>
                        <li>{e.description ? e.description : ""}</li>
                        <li>{e.fork ? e.fork : ""}</li>{" "}
                      </ul>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="cardBody">
                No Repository available at this time.
              </div>
            )}
            <div className="mainInUser">
              <div className="">
                {" "}
                {numberOfContribute.total && (
                  <div>
                    {numberOfContribute.total.lastYear} contributions in the
                    last year
                  </div>
                )}
              </div>
              <div>
                {" "}
                <img
                  src={`https://ghchart.rshah.org/${username}`}
                  alt="2016rshah's Github chart"
                />
                <a href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile">
                  learn how to contribute
                </a>
              </div>
            </div>
          </div>
        </div>{" "}
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </>
  );
};

export default User;
