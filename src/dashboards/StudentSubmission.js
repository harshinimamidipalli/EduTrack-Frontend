import React, { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function StudentSubmission({ selectedAssignment, onSubmissionSuccess, onBack }) {
  const [file, setFile] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [images, setImages] = useState([]);

  const uploadButtonStyle = {
  backgroundColor: "#1e5631",
  color: "white",
  border: "none",
  borderRadius: "20px",
  padding: "8px 15px",
  cursor: "pointer",
  marginTop: "10px"
  };

  const labelStyle = {
  fontWeight: "bold",
  marginTop: "15px",
  display: "block"
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", selectedAssignment.id);
    formData.append("textAnswer", textAnswer);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await axios.post("http://localhost:8080/submissions", formData);
      alert("✅ File uploaded successfully!");

      // Auto-refresh parent dashboard assignments after successful upload
      if (typeof onSubmissionSuccess === "function") {
        onSubmissionSuccess();
      }

      // Go back to main screen after submitting
      if (typeof onBack === "function") {
        onBack();
      }

      setFile(null);
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("❌ Failed to upload submission.");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <button
          onClick={onBack}
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

        <h1>{selectedAssignment.title}</h1>
        <p>
          <strong>Deadline:</strong> {selectedAssignment.deadline}
        </p>
        <p>{selectedAssignment.description}</p>

        <hr style={{ margin: "25px 0" }} />

        <h3>Submit Your Work</h3>
        <form onSubmit={handleSubmit} style={{ textAlign: "left", width: "100%" }}>
        {/* Text Answer */}
        <label style={labelStyle}>Write Your Answer:</label>
        <textarea
          placeholder="Type your answer here..."
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          style={{
            width: "100%",
            height: "130px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "15px"
          }}
        />

        {/* Image Upload */}
        <label style={labelStyle}>Upload Images (optional):</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            backgroundColor: "white"
          }}
        />

        {/* PDF Upload */}
        <label style={labelStyle}>Upload PDF (required):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            marginBottom: "15px"
          }}
        />

        {/* Submit Button */}
        <button type="submit" style={uploadButtonStyle}>
          Submit Assignment
        </button>

      </form>

      </div>
    </div>
  );
}

export default StudentSubmission;
