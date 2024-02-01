import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";

interface TreeItem {
  id: string;
  sha: string;
  branch: string;
  path: string;
  type: string;
  size: number;
  mode: string;
}

const Tree: React.FC = () => {
  const { username, repoName } = useParams<{
    username: string;
    repoName: string;
  }>();
  const [sha, setSha] = useState<Array<any>>([]);
  const [tree, setTree] = useState<Array<TreeItem>>([]);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceRerender, setForceRerender] = useState<number>(0);
  const [error, setError] = useState<string>("");

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
      console.error(e);
      setError("An error occurred in Tree. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTree = async (commitSha: string, branchName: string) => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}/git/trees/${commitSha}`,
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        return res.data.tree.map((item: any) => ({
          ...item,
          branch: branchName,
        }));
      } catch (e) {
        console.error("Error fetching tree data:", e);
        setError("An error occurred in Tree. Please try again.");
        return [];
      }
    };

    const fetchData = async () => {
      try {
        await fetchSha();
        if (sha.length > 0) {
          const treeData = await Promise.all(
            sha.map(async (item: any) => {
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

  const toggleOpen = (branchName: string) => {
    setIsOpen(branchName === isOpen ? null : branchName);
  };

  const getTree = () => {
    setForceRerender((prev) => prev + 1);
  };

  const handleCheck = (branches: string | string[]) => {
    if (Array.isArray(branches)) {
      return branches.includes(isOpen || "");
    }
    return isOpen === branches;
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
          ? sha.map((e: any) => (
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
      )}
      {error && <div className="errorMessage">{error}</div>}
    </>
  );
};

export default Tree;
