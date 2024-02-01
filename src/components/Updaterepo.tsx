import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
import { useNavigate } from "react-router-dom";
interface UpdateRepoState {
  name: string;
  description: string;
  homepage: string;
  private: boolean;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
}

const Updaterepo: React.FC = () => {
  const { username, repoName } = useParams<{
    username: any;
    repoName: any;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [updatestatus, setUpdateStatus] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const [updateRepo, setUpdateRepo] = useState<UpdateRepoState>({
    name: "Hello-World",
    description: "This is your first repository",
    homepage: "https://github.com",
    private: true,
    has_issues: true,
    has_projects: true,
    has_wiki: true,
  });
  const updateRepository = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await octokit.request(
        `PATCH /repos/${username}/${repoName}`,
        {
          data: {
            name: updateRepo.name,
            description: updateRepo.description,
            homepage: updateRepo.homepage,
            private: updateRepo.private,
            has_issues: updateRepo.has_issues,
            has_projects: updateRepo.has_projects,
            has_wiki: updateRepo.has_wiki,
          },
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      setUpdateRepo((prevRepo) => ({
        ...prevRepo,
        ...res.data,
      }));

      navigate(
        `/users/${
          res.data?.owner.length > 1 ? res.data?.owner : username
        }/repo/${res.data?.name ? res.data?.name : repoName}`
      );
      setUpdateStatus(true);
    } catch (e) {
      console.log(e.response?.data);
      setUpdateStatus(false);
      setError("An error occurred in Update Repository. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDataAndUpdateRepository = async () => {
      if (username && repoName) {
        await updateRepository;
      }
    };

    fetchDataAndUpdateRepository();
  }, [username, repoName]);

  return (
    <div className="containerInUpdateRepo">
      {" "}
      <div>
        <form onSubmit={updateRepository}>
          <h2>
            You can update this repository below if you have authentication
          </h2>
          <label>
            Repository Name:
            <input
              type="text"
              placeholder={repoName}
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  name: e.target.value,
                }))
              }
            />
          </label>

          <label>
            Repository Description:
            <input
              type="text"
              placeholder={updateRepo.description}
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  description: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Repository homepage:
            <input
              type="text"
              placeholder={updateRepo.homepage}
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  homepage: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Private:
            <select
              className="selectInUpdateRepo"
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  private: e.target.value === "true",
                }))
              }
            >
              {" "}
              <option value=""> Please choose an option</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            Issues:
            <select
              className="selectInUpdateRepo"
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  has_issues: e.target.value === "true",
                }))
              }
            >
              <option value=""> Please choose an option</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            Projects:
            <select
              className="selectInUpdateRepo"
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  has_projects: e.target.value === "true",
                }))
              }
            >
              <option value=""> Please choose an option</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            WIki:
            <select
              className="selectInUpdateRepo"
              onChange={(e) =>
                setUpdateRepo((prevRepo) => ({
                  ...prevRepo,
                  has_wiki: e.target.value === "true",
                }))
              }
            >
              <option value=""> Please choose an option</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <button type="submit">
            {loading ? "Updating..." : "Update Repository"}
          </button>
          {updatestatus !== null && (
            <div className={updatestatus ? "success" : "fail"}>
              {updatestatus
                ? "Updated succesfully!"
                : "Failed to update,please try again later"}
            </div>
          )}
        </form>
      </div>{" "}
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Updaterepo;
