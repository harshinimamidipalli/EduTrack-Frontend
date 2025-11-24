import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function TeacherMarks() {
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/submissions");
        console.log("Fetched submissions:", response.data);

        // Keep only those with valid marks
        const evaluated = response.data.filter(
          (s) => s.marks !== null && s.marks !== undefined
        );

        setMarksData(evaluated);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, []);

  // Group submissions by assignment title
  const groupedByAssignment = marksData.reduce((acc, s) => {
    const title = s.assignment?.title || "Untitled Assignment";
    if (!acc[title]) acc[title] = [];
    acc[title].push(s);
    return acc;
  }, {});

  // Calculate overall average marks
  const totalMarks = marksData.reduce((sum, s) => sum + s.marks, 0);
  const average =
    marksData.length > 0 ? (totalMarks / marksData.length).toFixed(2) : 0;

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>All Student Marks</h1>

        {marksData.length === 0 ? (
          <p>No marks have been given yet.</p>
        ) : (
          <>
            {Object.keys(groupedByAssignment).map((title) => (
              <div
                key={title}
                style={{
                  backgroundColor: "#f8f8f8",
                  borderRadius: "10px",
                  marginBottom: "30px",
                  padding: "15px",
                }}
              >
                <h2
                  style={{
                    color: "#1e5631",
                    borderBottom: "2px solid #2d6a4f",
                    paddingBottom: "5px",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </h2>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#2d6a4f",
                        color: "white",
                      }}
                    >
                      <th style={{ padding: "10px" }}>Student Email</th>
                      <th style={{ padding: "10px" }}>Marks</th>
                      <th style={{ padding: "10px" }}>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByAssignment[title].map((s) => (
                      <tr key={s.id} style={{ backgroundColor: "#f2f2f2" }}>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {s.studentEmail}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {s.marks}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {s.feedback ? s.feedback : "No feedback"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div
              style={{
                marginTop: "30px",
                padding: "10px",
                backgroundColor: "#e9f5ee",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              📊 Overall Average Marks: {average}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherMarks;
