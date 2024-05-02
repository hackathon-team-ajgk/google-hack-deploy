import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/home-page/Home.js";
import Login from "./pages/user-auth/Login.js";
import Register from "./pages/user-auth/Register.js";
import NoPage from "./components/NoPage.js";
import Layout from "./components/Layout.js";
import YourList from "./pages/user-list/YourList.js";
import Movies from "./pages/movies-page/Movies.js";
import About from "./pages/about-page/About.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import UserProfile from "./pages/user-profile/UserProfile.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/your-list" element={<YourList />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
