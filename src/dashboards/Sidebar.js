import React from "react";
import "./Dashboard.css";

function Sidebar({ title, options, currentPage, onSelect }) {
  return (
    <div className="sidebar">
      <h2>{title}</h2>
      {options.map((opt) => (
        <button
          key={opt}
          className={currentPage === opt ? "active" : ""}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
