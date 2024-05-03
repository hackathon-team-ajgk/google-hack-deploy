import { useNavigate } from "react-router-dom";
import { Reveal } from "./Reveal";

function NoPage() {
  const navigate = useNavigate();
  return (
    <div className="no-page-container">
      <Reveal>
        <div className="no-page-message">
          <h1 className="no-page">404: Page Not Found</h1>
          <button
            id="no-page-btn"
            className="button"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </button>
        </div>
      </Reveal>
    </div>
  );
}

export default NoPage;
