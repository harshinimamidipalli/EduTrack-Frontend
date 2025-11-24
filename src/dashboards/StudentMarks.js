import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function StudentMarks() {
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/submissions");

        // Filter only this student's submissions
        const studentSubs = response.data.filter(
          (s) => s.studentEmail === "student@test.com"
        );

        // Only include evaluated ones (marks not null)
        const evaluated = studentSubs.filter((s) => s.marks !== null);

        setMarksData(evaluated);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, []);

  // Calculate average marks
  const totalMarks = marksData.reduce((sum, s) => sum + s.marks, 0);
  const average =
    marksData.length > 0 ? (totalMarks / marksData.length).toFixed(2) : 0;

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>My Marks</h1>

        {marksData.length === 0 ? (
          <p>No marks available yet.</p>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#2d6a4f",
                    color: "white",
                    borderRadius: "10px",
                  }}
                >
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                    Assignment
                  </th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                    Marks
                  </th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((s) => (
                  <tr
                    key={s.id}
                    style={{
                      backgroundColor: "#f2f2f2",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{s.assignment.title}</td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      {s.marks}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {s.feedback ? s.feedback : "No feedback"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "30px",
                padding: "10px",
                backgroundColor: "#e9f5ee",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              📊 Average Marks: {average}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentMarks;
