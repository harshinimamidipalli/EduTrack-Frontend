import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import StudentSubmission from "./StudentSubmission";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    try {
      // Get all assignments
      const assignmentRes = await axios.get("http://localhost:8080/assignments");

      // Get all submissions
      const submissionRes = await axios.get("http://localhost:8080/submissions");

      // Filter out assignments that this student has already submitted
      const studentEmail = "student@test.com";
      const submittedAssignmentIds = submissionRes.data
        .filter((s) => s.studentEmail === studentEmail)
        .map((s) => s.assignment.id);

      const today = new Date();

      const remainingAssignments = assignmentRes.data
        .filter((a) => !submittedAssignmentIds.includes(a.id))
        .filter((a) => new Date(a.deadline) >= today);

      remainingAssignments.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );

      setAssignments(remainingAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
  const eventSource = new EventSource("http://localhost:8080/notifications/stream");

  eventSource.onmessage = (event) => {
    if (event.data === "new-assignment") {
      console.log("📢 New assignment detected — refreshing...");
      fetchAssignments(); // refresh instantly
    }
  };

  return () => {
    eventSource.close();
  };
}, []);


  if (selectedAssignment) {
    return (
      <StudentSubmission
        selectedAssignment={selectedAssignment}
        onSubmissionSuccess={fetchAssignments}
        onBack={() => setSelectedAssignment(null)}
      />
    );
  }

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>Assignments To Do</h1>

        {assignments.length === 0 ? (
          <p>No assignments available right now.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {assignments.map((a) => (
              <li
                key={a.id}
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: "10px",
                  padding: "15px",
                  margin: "10px 0",
                  textAlign: "left",
                }}
              >
                <strong>{a.title}</strong>
                <br />
                <em>Deadline: {a.deadline}</em>
                <p>{a.description}</p>

                <button
                  onClick={() => setSelectedAssignment(a)}
                  style={{
                    backgroundColor: "#2d6a4f",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  View / Submit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;
