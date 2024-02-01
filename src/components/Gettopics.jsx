import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
const Gettopics = () => {
  const { username, repoName } = useParams();
  const [topic, setTopic] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}/topics`,
          {
            owner: "OWNER",
            repo: "REPO",
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        setTopic(res.data);
      } catch (e) {
        console.log(e);
        setError("An error occurred in Topics. Please try again.");
      }
    };
    if (username && repoName) {
      fetchTopic();
    }
  }, []);
  const getTopic = Object.entries(topic);
  return (
    <>
      {topic
        ? getTopic.map(([key, value], index) => (
            <div key={index}>{`${key} =${
              value.length < 1 ? "  No Topics was provided by the user." : value
            }`}</div>
          ))
        : "No topic was provided by the users."}
      {error && <div className="errorMessage">{error}</div>}
    </>
  );
};

export default Gettopics;
