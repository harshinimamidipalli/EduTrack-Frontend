import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function StudentEvaluations() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/submissions")
      .then((response) => {
        // Filter only submissions that belong to this student
        const studentSubs = response.data.filter(
          (s) => s.studentEmail === "student@test.com"
        );
        setEvaluations(studentSubs);
      })
      .catch((error) => console.error("Error fetching evaluations:", error));
  }, []);

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>My Evaluations</h1>

        {evaluations.length === 0 ? (
          <p>No evaluated assignments yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {evaluations.map((s) => (
              <li
                key={s.id}
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: "10px",
                  padding: "15px",
                  margin: "10px 0",
                  textAlign: "left",
                }}
              >
                <strong>Assignment:</strong> {s.assignment.title} <br />
                <strong>Marks:</strong>{" "}
                {s.marks !== null ? s.marks : "Not evaluated yet"} <br />
                <strong>Feedback:</strong>{" "}
                {s.feedback !== null ? s.feedback : "Awaiting evaluation"} <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentEvaluations;
