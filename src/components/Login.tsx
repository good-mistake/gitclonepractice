import React, { useEffect } from "react";
import { useState } from "react";
import octokit from "./octokit";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  const fetch = async () => {
    try {
      await octokit.request("GET /users/{username}", {
        username: value,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      setError(false);
    } catch (e) {
      console.log(e);
      setError(true);
      setErrorMessage("An error occurred in Login. Please try again.");
    }
  };
  useEffect(() => {
    if (value) {
      fetch();
    }
  }, [value]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && !error) {
      navigate(`/users/${value}`);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="containerInLogin">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login">Enter your profile name </label>
          <div>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="  Username"
            />{" "}
            <button type="submit" disabled={error}>
              Enter
            </button>
          </div>
        </div>{" "}
        {error ? (
          <p>
            Username was not found, make sure you entered the right Username
          </p>
        ) : (
          ""
        )}
      </form>{" "}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
};

export default Login;
