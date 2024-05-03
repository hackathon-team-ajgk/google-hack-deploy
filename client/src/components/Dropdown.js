import { useNavigate } from "react-router-dom";
import { NavbarData } from "./NavbarData";

function Dropdown({ toggle, logout }) {
  const navigate = useNavigate();

  return (
    <div className="dropdown-menu">
      {NavbarData.map((val, key) => (
        <div
          key={`account-${key}`}
          className="dropdown-link-nav"
          onClick={() => {
            toggle();
            navigate(val.path);
          }}
        >
          {val.name}
        </div>
      ))}
      <div
        id="profile-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          navigate("/profile");
        }}
      >
        Profile
      </div>
      <div
        id="list-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          navigate("/your-list");
        }}
      >
        List
      </div>
      <div
        id="logout-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          logout();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  );
}

export default Dropdown;
