import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Login.tsx";
import User from "./components/User.tsx";
import Followers from "./components/Followers";
import Following from "./components/Following";
import Subscription from "./components/Subscription";
import Repository from "./components/Repository";
import Repositories from "./components/Repositories.tsx";
import Searchresults from "./components/Searchresults.jsx";
import Header from "./components/Header.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users/:username/followers" element={<Followers />} />
        <Route path="/users/:username/following" element={<Following />} />
        <Route path="/users/:username" element={<User />} />
        <Route
          path="/users/:username/subscriptions"
          element={<Subscription />}
        />
        <Route path="users/:username/repos" element={<Repositories />} />
        <Route
          path="/users/:username/repo/:repoName"
          element={<Repository />}
        />
        <Route path="/search/result/:userInput" element={<Searchresults />} />
        <Route path="/repos/:username/:repoName/contributors" />
      </Routes>
    </Router>
  );
};

export default App;
