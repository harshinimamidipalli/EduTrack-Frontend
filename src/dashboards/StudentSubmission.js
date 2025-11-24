import React, { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function StudentSubmission({ selectedAssignment, onSubmissionSuccess, onBack }) {
  const [file, setFile] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [images, setImages] = useState([]);

  // Preview modal states
  const [previewType, setPreviewType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const uploadButtonStyle = {
    backgroundColor: "#1e5631",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "8px 15px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginTop: "15px",
    display: "block",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && images.length === 0 && !textAnswer.trim()) {
      alert("Please submit text OR image OR PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment.id);
    formData.append("textAnswer", textAnswer);

    if (file) formData.append("file", file);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await axios.post("http://localhost:8080/submissions", formData);
      alert("🎉 Submission Successful!");

      if (onSubmissionSuccess) onSubmissionSuccess();
      if (onBack) onBack();

      setFile(null);
      setImages([]);
      setTextAnswer("");
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("❌ Failed to submit assignment!");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="placeholder-box" style={{ textAlign: "left" }}>
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

        {/* Assignment Details */}
        <h1>{selectedAssignment.title}</h1>
        <p>
          <strong>Deadline:</strong> {selectedAssignment.deadline}
        </p>
        <p>{selectedAssignment.description}</p>

        {/* Assignment Image Thumbnail */}
        {selectedAssignment.imagePath && (
          <div style={{ marginTop: "10px" }}>
            <h4>Assignment Image:</h4>
            <img
              src={`http://localhost:8080/${selectedAssignment.imagePath}`}
              alt="Assignment"
              width="180"
              style={{ borderRadius: "10px", cursor: "pointer" }}
              onClick={() => {
                setPreviewUrl(
                  `http://localhost:8080/${selectedAssignment.imagePath}`
                );
                setPreviewType("image");
              }}
            />
          </div>
        )}

        {/* Assignment PDF Thumbnail */}
        {selectedAssignment.pdfPath && (
          <div style={{ marginTop: "10px" }}>
            <h4>Assignment PDF:</h4>
            <div
              style={{
                width: "180px",
                height: "50px",
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
                setPreviewUrl(
                  `http://localhost:8080/${selectedAssignment.pdfPath}`
                );
                setPreviewType("pdf");
              }}
            >
              View PDF
            </div>
          </div>
        )}

        <hr style={{ margin: "25px 0" }} />

        {/* Submission Section */}
        <h3>Submit Your Work</h3>
        <form onSubmit={handleSubmit}>
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
              marginBottom: "15px",
            }}
          />

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
              backgroundColor: "white",
            }}
          />

          <label style={labelStyle}>Upload PDF (optional):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              marginBottom: "15px",
            }}
          />

          <button type="submit" style={uploadButtonStyle}>
            Submit Assignment
          </button>
        </form>
      </div>

      {/* Modal Viewer */}
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
              maxWidth: "120vw",
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

            {previewType === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  marginTop: "10px",
                }}
              />
            ) : (
              <iframe
                src={previewUrl}
                width="1200px"
                height="600px"
                title="PDF Preview"
                style={{
                  borderRadius: "10px",
                  marginTop: "8px",
                }}
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSubmission;
