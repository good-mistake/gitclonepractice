import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
const Tree = () => {
  const { username, repoName } = useParams();
  const [sha, setSha] = useState([]);
  const [tree, setTree] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceRerender, setForceRerender] = useState(0);
  const [error, setError] = useState("");

  const fetchSha = async () => {
    try {
      const res = await octokit.request(
        `GET /repos/${username}/${repoName}/branches`,
        {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      setSha(res.data);
    } catch (e) {
      console.log(e);
      setError("An error occurred in Tree. Please try again.");
    }
  };
  useEffect(() => {
    const fetchTree = async (commitSha, branchName) => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}/git/trees/${commitSha}`,
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        return res.data.tree.map((item) => ({ ...item, branch: branchName }));
      } catch (e) {
        console.log("Error fetching tree data:", e);
        setError("An error occurred in Tree. Please try again.");

        return [];
      }
    };

    const fetchData = async () => {
      try {
        await fetchSha();
        if (sha.length > 0) {
          const treeData = await Promise.all(
            sha.map(async (item) => {
              const branchName = item.name || "main";
              const treeItems = await fetchTree(item.commit.sha, branchName);
              return treeItems;
            })
          );
          setTree(treeData.flat());
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError("An error occurred in Tree. Please try again.");
      }
    };
    if (username && repoName) {
      fetchData();
    }
  }, [username, repoName, forceRerender]);

  const toggleOpen = (branchName) => {
    setIsOpen(branchName === isOpen ? null : branchName);
  };

  const getTree = () => {
    setForceRerender((prev) => prev + 1);
  };
  const handleCheck = (branchName) => {
    return isOpen === branchName;
  };
  if (loading) {
    return (
      <div>
        <button className={`getTree`} onClick={getTree}>
          Main Tree
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="branchContainer">
        {sha
          ? sha.map((e) => (
              <div
                key={e.id}
                className={`treeNode ${
                  handleCheck(e.name) ? "open" : "closed"
                } branchName`}
                onClick={() => toggleOpen(e.name)}
              >
                {e.name ? e.name : " main"}
              </div>
            ))
          : "No information available at this time."}
      </div>
      {tree && tree.length > 0 ? (
        <div
          className={`${
            handleCheck(tree.map((e) => e.branch))
              ? isOpen
                ? "active"
                : "hidden"
              : ""
          } treeInfo`}
        >
          {tree.map(
            (e) =>
              handleCheck(e.branch) && (
                <div key={e.id} className={`treeBranch`}>
                  <div>SHA: {e.sha}</div>
                  <div>Branch: {e.branch}</div>
                  <div>Path: {e.path}</div>
                  <div>Type: {e.type}</div>
                  <div>File size: {e.size}</div>
                  <div>Mode: {e.mode}</div>
                </div>
              )
          )}
        </div>
      ) : (
        "No Trees available"
      )}{" "}
      {error && <div className="errorMessage">{error}</div>}
    </>
  );
};

export default Tree;
