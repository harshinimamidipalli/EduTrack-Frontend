import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import StudentSubmission from "./StudentSubmission";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    try {
      const assignmentRes = await axios.get("http://localhost:8080/assignments");
      const submissionRes = await axios.get("http://localhost:8080/submissions");

      const studentEmail = "student@test.com";
      const submittedAssignmentIds = submissionRes.data
        .filter((s) => s.studentEmail === studentEmail)
        .map((s) => s.assignment.id);

      const today = new Date();

      const remainingAssignments = assignmentRes.data
      .filter((a) => new Date(a.deadline) >= today)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .map((a) => ({
        ...a,
        submitted: submittedAssignmentIds.includes(a.id)
        
      }));


      setAssignments(remainingAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Real-time updates using SSE
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/notifications/stream");

    eventSource.onmessage = (event) => {
      if (event.data === "new-assignment") {
        fetchAssignments();
      }
    };

    return () => eventSource.close();
  }, []);

  // If assignment selected → Show submission screen
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

                {/* Show Image Preview if available */}
                {a.imagePath && (
                  <img
                    src={`http://localhost:8080/${a.imagePath}`}
                    alt="Assignment"
                    width="250"
                    style={{ borderRadius: "10px", marginTop: "10px" }}
                  />
                )}

                {/* Show PDF Preview if available */}
                {a.pdfPath && (
                  <iframe
                    src={`http://localhost:8080/${a.pdfPath}`}
                    width="100%"
                    height="300px"
                    title="PDF Preview"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  ></iframe>
                )}

                <button
                  onClick={() => setSelectedAssignment(a)}
                  style={{
                    backgroundColor: a.submitted ? "#ff8c00" : "#2d6a4f",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  disabled={a.submitted && new Date(a.deadline) < new Date()} // Disable if late
                 >
                  {!a.submitted
                    ? "Submit"
                    : new Date(a.deadline) >= new Date()
                      ? "View / ReSubmit"
                      : "View Only"}
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
