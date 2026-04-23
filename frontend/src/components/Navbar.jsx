import { NavLink } from "react-router-dom";
import { IoChatbubbleEllipses, IoHome, IoBookmark, IoGitCompare } from "react-icons/io5";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">🏠</span>
          <span className="gradient-text">Agent Mira</span>
        </NavLink>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              <IoHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>
              <IoChatbubbleEllipses /> Chat
            </NavLink>
          </li>
          <li>
            <NavLink to="/saved" className={({ isActive }) => (isActive ? "active" : "")}>
              <IoBookmark /> Saved
            </NavLink>
          </li>
          <li>
            <NavLink to="/compare" className={({ isActive }) => (isActive ? "active" : "")}>
              <IoGitCompare /> Compare
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
