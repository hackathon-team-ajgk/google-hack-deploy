import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/home-page/Home";
import Login from "./pages/user-auth/Login";
import Register from "./pages/user-auth/Register";
import NoPage from "./components/NoPage";
import Layout from "./components/Layout";
import YourList from "./pages/user-list/YourList";
import Movies from "./pages/movies-page/Movies";
import About from "./pages/about-page/About";
import { AuthProvider } from "./contexts/AuthContext";
import UserProfile from "./pages/user-profile/UserProfile";

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
