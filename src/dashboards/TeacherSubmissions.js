import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // For preview modal (PDF / image / text)
  const [previewType, setPreviewType] = useState(null); // 'pdf' | 'image' | 'text'
  const [previewUrl, setPreviewUrl] = useState("");

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

  // Real-time updates for new submissions
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/notifications/stream");

    eventSource.onmessage = (event) => {
      if (event.data === "new-submission") {
        console.log("📢 New submission detected — refreshing...");
        fetchSubmissions();
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

  // Helper to get list of image names from the comma-separated field
  const getImageList = (imageNames) => {
    if (!imageNames) return [];
    return imageNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  // ---- Single Submission View (Evaluate Screen) ----
  if (selectedSubmission) {
    const assignment = selectedSubmission.assignment || {};
    const imageList = getImageList(selectedSubmission.imageNames);

    const fileBaseUrl = "http://localhost:8080/submissions/files/";

    return (
      <div className="dashboard-content">
        <div className="placeholder-box" style={{ textAlign: "left" }}>
          <button
            onClick={() => {
              setSelectedSubmission(null);
              setMessage("");
              setPreviewType(null);
            }}
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

          {/* Assignment Info */}
          <p>
            <strong>Assignment:</strong> {assignment.title || "N/A"}
          </p>
          <p>
            <strong>Student:</strong> {selectedSubmission.studentEmail}
          </p>
          <p>
            <strong>Assignment Description:</strong> {assignment.description}
          </p>

          {/* Assignment attached Image / PDF (if teacher had uploaded them) */}
          {assignment.imagePath && (
            <div style={{ marginTop: "10px" }}>
              <h4>Assignment Reference Image:</h4>
              <img
                src={`http://localhost:8080/${assignment.imagePath}`}
                alt="Assignment"
                width="200"
                style={{ borderRadius: "10px", cursor: "pointer" }}
                onClick={() => {
                  setPreviewUrl(`http://localhost:8080/${assignment.imagePath}`);
                  setPreviewType("image");
                }}
              />
            </div>
          )}

          {assignment.pdfPath && (
            <div style={{ marginTop: "10px" }}>
              <h4>Assignment Reference PDF:</h4>
              <div
                style={{
                  width: "250px",
                  height: "60px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8f8f8",
                  fontSize: "18px",
                }}
                onClick={() => {
                  setPreviewUrl(`http://localhost:8080/${assignment.pdfPath}`);
                  setPreviewType("pdf");
                }}
              >
                📄 View Assignment PDF
              </div>
            </div>
          )}

          <hr style={{ margin: "25px 0" }} />

          {/* Student Submission Section */}
          <h3>Student Submission</h3>

          {/* View student's text answer file (if any) */}
          {selectedSubmission.textFileName && (
            <p>
              <strong>Text Answer:</strong>{" "}
              <button
                onClick={() => {
                  setPreviewUrl(fileBaseUrl + selectedSubmission.textFileName);
                  setPreviewType("text");
                }}
                style={{
                  backgroundColor: "#2d6a4f",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
              >
                View Text Answer
              </button>
            </p>
          )}

          {/* View student's main file (PDF) */}
          {selectedSubmission.fileName && (
            <p>
              <strong>Uploaded File (PDF):</strong>{" "}
              <button
                onClick={() => {
                  setPreviewUrl(fileBaseUrl + selectedSubmission.fileName);
                  setPreviewType("pdf");
                }}
                style={{
                  backgroundColor: "#2d6a4f",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
              >
                View PDF
              </button>
            </p>
          )}

          {/* View student's images (if any) */}
          {imageList.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <strong>Uploaded Images:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {imageList.map((imgName) => (
                  <img
                    key={imgName}
                    src={fileBaseUrl + imgName}
                    alt="Submission"
                    width="120"
                    style={{ borderRadius: "8px", cursor: "pointer" }}
                    onClick={() => {
                      setPreviewUrl(fileBaseUrl + imgName);
                      setPreviewType("image");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <hr style={{ margin: "25px 0" }} />

          {/* Evaluation Form */}
          <h3>Marks & Feedback</h3>
          <form onSubmit={handleEvaluate}>
            <input
              type="number"
              placeholder="Enter marks (out of 100)"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
              style={{
                width: "60%",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
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
            <button
              type="submit"
              style={{
                marginTop: "10px",
                backgroundColor: "#2d6a4f",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
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

          {/* Modal Preview (PDF / Image / Text) */}
          {previewType && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
              onClick={() => setPreviewType(null)}
            >
              <div
                style={{
                  background: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewType(null)}
                  style={{
                    float: "right",
                    border: "none",
                    background: "transparent",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>

                {previewType === "image" && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "90vh",
                      marginTop: "10px",
                    }}
                  />
                )}

                {(previewType === "pdf" || previewType === "text") && (
                  <iframe
                    src={previewUrl}
                    width="1200px"
                    height="600px"
                    title="File Preview"
                    style={{ borderRadius: "10px", marginTop: "10px" }}
                  ></iframe>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- List View (All Submissions) ----
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
                <strong>File:</strong> {s.fileName || "—"} <br />
                <strong>Marks:</strong>{" "}
                {s.marks !== null && s.marks !== undefined
                  ? s.marks
                  : "Not evaluated yet"}
                <br />
                <button
                  onClick={() => {
                    setSelectedSubmission(s);
                    setMarks(s.marks ?? "");
                    setFeedback(s.feedback ?? "");
                    setMessage("");
                    setPreviewType(null);
                  }}
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
