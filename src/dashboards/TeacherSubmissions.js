import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all submissions
  const fetchSubmissions = () => {
    axios
      .get("http://localhost:8080/submissions")
      .then((response) => setSubmissions(response.data))
      .catch((error) => console.error("Error fetching submissions:", error));
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
  const eventSource = new EventSource("http://localhost:8080/notifications/stream");

  eventSource.onmessage = (event) => {
    if (event.data === "new-submission") {
      console.log("📢 New submission detected — refreshing...");
      fetchSubmissions(); // refresh instantly
    }
  };

  return () => {
    eventSource.close();
  };
}, []);


  // Handle evaluation submission
  const handleEvaluate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8080/submissions/${selectedSubmission.id}`,
        { marks, feedback }
      );

      setMessage("✅ Evaluation saved successfully!");
      setSelectedSubmission(null);
      setMarks("");
      setFeedback("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error saving evaluation:", error);
      setMessage("❌ Failed to save evaluation.");
    }
  };

  const handleDownload = (fileName) => {
    const fileUrl = `http://localhost:8080/submissions/files/${fileName}`;
    window.open(fileUrl, "_blank");
  };

  if (selectedSubmission) {
    return (
      <div className="dashboard-content">
        <div className="placeholder-box">
          <button
            onClick={() => setSelectedSubmission(null)}
            style={{
              backgroundColor: "#1e5631",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 15px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            ← Back
          </button>

          <h1>Evaluate Submission</h1>
          <p>
            <strong>Assignment:</strong>{" "}
            {selectedSubmission.assignment?.title || "N/A"}
          </p>
          <p>
            <strong>Student:</strong> {selectedSubmission.studentEmail}
          </p>
          <p>
            <strong>File:</strong>{" "}
            <button
              onClick={() => handleDownload(selectedSubmission.fileName)}
              style={{
                backgroundColor: "#2d6a4f",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              View File
            </button>
          </p>

          <form onSubmit={handleEvaluate}>
            <input
              type="number"
              placeholder="Enter marks (out of 100)"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
              style={{ width: "60%", marginBottom: "10px" }}
            />
            <br />
            <textarea
              placeholder="Enter feedback comments"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              style={{
                width: "80%",
                height: "100px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                fontFamily: "Poppins",
              }}
            ></textarea>
            <br />
            <button type="submit" style={{ marginTop: "10px" }}>
              Save Evaluation
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                color: message.includes("✅") ? "#1e5631" : "red",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>Student Submissions</h1>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {submissions.map((s) => (
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
                <strong>Student:</strong> {s.studentEmail} <br />
                <strong>File:</strong> {s.fileName} <br />
                <strong>Marks:</strong> {s.marks ?? "Not evaluated yet"} <br />
                <button
                  onClick={() => setSelectedSubmission(s)}
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
                  Evaluate
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TeacherSubmissions;
