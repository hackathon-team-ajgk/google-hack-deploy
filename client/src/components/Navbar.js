import React from "react";
import { NavbarData } from "./NavbarData";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    nav(path);
  };

  return (
    <>
      <ul className="navbar">
        {NavbarData.map((val, key) => (
          <li
            id={location.pathname === val.path ? "active" : ""}
            className="navbar-item"
            key={key}
            onClick={() => handleNavigate(val.path)}
          >
            <p className="navbar-item-name">{val.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Navbar;
