import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: "Get-You-Authentication-Token",
});

export default octokit;
