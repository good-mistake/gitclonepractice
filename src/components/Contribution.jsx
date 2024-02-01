import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
import { useNavigate } from "react-router-dom";
const Contribution = () => {
  const { username, repoName } = useParams();
  const [contribute, setContribute] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}/contributors`,
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        setContribute(res.data);
      } catch (e) {
        console.log(e);
        setError("An error occurred in contribution. Please try again.");
      }
    };
    if (username && contribute) {
      fetchContributors();
    }
    fetchContributors();
  }, [username, repoName]);
  console.log(contribute);
  const handleUser = (userLogin) => {
    navigate(`/users/${userLogin}?refresh=true`);
  };
  const showContribute = () => {
    return contribute.map((user) => {
      return (
        <div key={user.id}>
          <img src={user.avatar_url} alt="profile pic" />
          <div onClick={() => handleUser(user.login)} className="clickable">
            {user.login ? user.login : "No name available"}
          </div>
          <div>
            {user.contributions ? (
              <span>Number of contribution : {user.contributions}</span>
            ) : (
              "didn't contribute"
            )}
          </div>
          <a href={user.html_url}>
            click to view contributors profile on GitHub
          </a>
        </div>
      );
    });
  };
  return (
    <div className="containerInContribution">
      {contribute ? showContribute() : "No contribution to this repository."}
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Contribution;
