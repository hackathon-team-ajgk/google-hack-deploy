import { useNavigate } from "react-router-dom";

function Dropdown({ toggle, logout }) {
  const navigate = useNavigate();

  return (
    <div className="dropdown-menu">
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
