import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import TeacherAssignments from "./TeacherAssignments";
import TeacherSubmissions from "./TeacherSubmissions";

function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState("Assignments Created");

  const renderContent = () => {
    switch (currentPage) {
      case "Assignments Created":
        return <TeacherAssignments />;

      case "Submissions":
        return <TeacherSubmissions />;

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        title="Teacher Menu"
        options={["Assignments Created", "Submissions"]}
        currentPage={currentPage}
        onSelect={setCurrentPage}
      />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
}

export default TeacherDashboard;
