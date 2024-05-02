import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function ProfileCard({ member }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <div className="card">
      <div className="profile-cover">
        <img src={member.image} alt="pfp" className="pfp" />
      </div>
      <div className="profile-card-info">
        <div className="profile-user-info">
          <p id="profile-name" className="profile-title">
            {member.name}
          </p>
          <p id="profile-role" className="profile-title">
            {member.role}
          </p>
          <div id="profile-socials" className="button-group">
            <a
              className="social-icon"
              target="_blank"
              rel="noreferrer"
              href={member.github}
            >
              <GitHubIcon fontSize="large" />
            </a>
            <a
              className="social-icon"
              target="_blank"
              rel="noreferrer"
              href={member.linkedIn}
            >
              <LinkedInIcon fontSize="large" />
            </a>
          </div>
          {isOpen && <p className="profile-text">{member.bio}</p>}
          <button onClick={toggleIsOpen} className="see-more-less">
            {isOpen ? "See Less" : "See More"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
