import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Repositories: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${username}/repos`)
      .then((res) => {
        setRepo(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error in following", e);
        setLoading(false);
        setError("An error occurred in Repositories. Please try again.");
      });
  }, [username]);
  const handleExactRepo = (repoName: string) => {
    navigate(`/users/${username}/repo/${repoName}`);
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
  const handleUser = (userLogin) => {
    navigate(`/users/${userLogin}?refresh=true`);
  };
  return (
    <>
      <div className="container">
        <div className="userProfilePage" onClick={() => handleUser(username)}>
          {" "}
          <img src={repo[0]?.owner?.avatar_url} alt="Profile pic" />
          <div className="userName"> {username} Repositories</div>
        </div>
        <div className="containerInRepositories">
          {loading ? (
            <div>Loading...</div>
          ) : repo ? (
            repo.map((user) => {
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    handleExactRepo(user.name);
                  }}
                >
                  <div>{user.name}</div>
                  <div>
                    {user.description
                      ? user.description
                      : "No description available"}
                  </div>
                  <div>{user.fork === true ? user.forks_url : "No Forks"}</div>
                  {setTime(user)}
                  <div>{user.language}</div>
                  <div>Click to see the repository</div>
                </div>
              );
            })
          ) : (
            <div>
              No Repository available at this time, please try again later.
            </div>
          )}
        </div>{" "}
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </>
  );
};

export default Repositories;
