import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
import Contribution from "./Contribution";
import Language from "./Language";
import Updaterepo from "./Updaterepo.tsx";
import Gettopics from "./Gettopics";
import Tree from "./Tree";
import { useNavigate } from "react-router-dom";

const Repository = () => {
  const { username, repoName } = useParams();
  const [repo, setRepo] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}`,
          {
            owner: username,
            repo: repoName,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        setRepo(res.data);
      } catch (e) {
        console.error(e);
        setError("An error occurred in Repository. Please try again.");
      }
    };
    if (username && repoName) {
      fetchRepo();
    }
  }, [username, repoName]);
  const getTags = async () => {
    try {
      const res = await octokit.request(
        `GET /repos/${username}/${repoName}/tags`,
        {
          owner: "OWNER",
          repo: "REPO",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      setTags(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getTags();
  }, [repo]);
  const handleUser = (userLogin) => {
    navigate(`/users/${userLogin}?refresh=true`);
  };
  const setTime = (user) => {
    const createTime = user.created_at;
    const pushedTime = user.pushed_at;
    const updatedTime = user.updated_at;
    const createDate = new Date(createTime);
    const pushedDate = new Date(pushedTime);
    const updatedDate = new Date(updatedTime);

    return (
      <>
        <div>Created : {createDate.toLocaleString()}</div>
        <div>Pushed : {pushedDate.toLocaleString()}</div>
        <div>Update : {updatedDate.toLocaleString()}</div>
      </>
    );
  };
  return (
    <>
      <div className="container">
        <div className="userRepositoryPage">
          <div className="containerInRepository">
            {repo ? (
              <div key={repo.id}>
                {" "}
                <img src={repo?.owner?.avatar_url} alt="profile pic" />
                <div>Name : {repo.name ? repo.name : "Unknown..."}</div>
                <div onClick={() => handleUser(username)} className="clickable">
                  Owner : {repo.owner?.login}
                </div>
                <div>
                  Main language :{" "}
                  {repo.language ? repo.language : "No information available"}
                </div>
                {setTime(repo)}
                {/* <div className="tags">
                  Tags :{" "}
                  {tags && tags.length > 0
                    ? tags.map((tag) => <div>Version : {tag.name}</div>)
                    : "No tags in this repository"}
                </div> */}
                <div>
                  visibile for other :{" "}
                  {repo.visibility
                    ? repo.visibility
                    : "No information available"}
                </div>
                <div>
                  descriptions :{" "}
                  {repo.description
                    ? repo.description
                    : "No description available"}
                </div>{" "}
                <div>
                  <Gettopics />
                </div>
                <div className="contributionSection">
                  <h4>People who contributed in this repository:</h4>
                  <Contribution />
                </div>{" "}
              </div>
            ) : (
              "No information available at this time, please try again later"
            )}
          </div>{" "}
          <div className="mainInRepository">
            <div>
              <Updaterepo />
            </div>
            <div className="mainInTreeComponent">
              <Tree />
            </div>{" "}
            <div className="languageComponent">
              {" "}
              <Language />
            </div>
          </div>
        </div>{" "}
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </>
  );
};

export default Repository;
