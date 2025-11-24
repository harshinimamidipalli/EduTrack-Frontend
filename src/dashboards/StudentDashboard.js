import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import StudentAssignments from "./StudentAssignments";
import StudentEvaluations from "./StudentEvaluations";
import StudentMarks from "./StudentMarks";



function StudentDashboard() {
  const [currentPage, setCurrentPage] = useState("Assignments To Do");

  const renderContent = () => {
    switch (currentPage) {
      case "Assignments To Do":
        return <StudentAssignments />;
      case "Evaluations":
        return <StudentEvaluations />;
      case "Marks":
        return <StudentMarks />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        title="Student Menu"
        options={["Assignments To Do", "Evaluations", "Marks"]}
        currentPage={currentPage}
        onSelect={setCurrentPage}
      />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
}

export default StudentDashboard;
