import { useNavigate } from "react-router-dom";
const useNavigationForUser = () => {
  const navigate = useNavigate();

  const handleUser = (userLogin) => {
    navigate(`/users/${userLogin}?refresh=true`);
  };
  const handleRepos = (userLogin) => {
    navigate(`users/${userLogin}/repos`);
  };
  const handleFollowers = (userLogin) => {
    navigate(`/users/${userLogin}/followers?refresh=true`);
  };

  const handleFollowing = (userLogin) => {
    navigate(`/users/${userLogin}/following?refresh=true`);
  };
  const handleSubscription = (userLogin) => {
    navigate(`/users/${userLogin}/subscriptions`);
  };
  const handleExactRepo = (username, repoName) => {
    navigate(`/users/${username}/repo/${repoName}`);
  };
  return {
    handleUser,
    handleFollowers,
    handleFollowing,
    handleSubscription,
    handleRepos,
    handleExactRepo,
  };
};
export { useNavigationForUser };
