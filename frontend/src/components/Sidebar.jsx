// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // <- correct package name
import { faUser, faChartBar, faGamepad, faFlask } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <aside className="w-52 bg-green-800 min-h-screen text-white fixed top-0 left-0 p-6 hidden sm:block">
      <div className="mb-10">
        <h2 className="text-lg font-bold">Edural</h2>
      </div>

      <nav className="flex flex-col gap-6">
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-90" aria-label="Profile">
          <FontAwesomeIcon icon={faUser} className="w-5 h-5" aria-hidden="true" />
          <span>Profile</span>
        </Link>

        <Link to="/progress" className="flex items-center gap-3 hover:opacity-90" aria-label="Progress">
          <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" aria-hidden="true" />
          <span>Progress</span>
        </Link>

        <Link to="/Home" className="flex items-center gap-3 hover:opacity-90" aria-label="My Games">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5" aria-hidden="true" />
          <span>My Games</span>
        </Link>

        <Link to="/labs" className="flex items-center gap-3 hover:opacity-90" aria-label="Labs">
          <FontAwesomeIcon icon={faFlask} className="w-5 h-5" aria-hidden="true" />
          <span>Labs</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
