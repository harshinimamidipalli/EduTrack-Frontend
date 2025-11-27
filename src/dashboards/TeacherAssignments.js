import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  // Fetch assignments from backend
  const fetchAssignments = () => {
    axios
      .get("http://localhost:8080/assignments")
      .then((response) => setAssignments(response.data))
      .catch((error) =>
        console.error("Error fetching assignments:", error)
      );
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Add Assignment with optional files
  const handleAddAssignment = (e) => {
    e.preventDefault();

    // At least one: description OR image OR pdf
    if (!description && !image && !pdf) {
      alert("Please provide description or upload an image/PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    axios
      .post("http://localhost:8080/assignments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setDeadline("");
        setImage(null);
        setPdf(null);
        setShowForm(false);
        fetchAssignments();
      })
      .catch((error) =>
        console.error("Error uploading assignment:", error)
      );
  };

  return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>Your Assignments</h1>

        {/* Open/Close Form Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: "#2d6a4f",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "10px 25px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {showForm ? "Cancel" : "+ Create New Assignment"}
        </button>

        {showForm && (
          <form onSubmit={handleAddAssignment} style={{ marginBottom: "30px" }}>
            <input
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <br />

            <textarea
              placeholder="Assignment Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "80%",
                height: "100px",
                margin: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                fontFamily: "Poppins",
              }}
            ></textarea>
            <br />

            {/* Upload Image */}
            <label style={{ fontWeight: "600" }}>Upload Image (Optional)</label>
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />
            <br />

            {/* Upload PDF */}
            <label style={{ fontWeight: "600" }}>Upload PDF (Optional)</label>
            <br />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
            />
            <br />
            <br />

            <input
              type="date"
              value={deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <br />

            <button type="submit" style={{ marginTop: "10px" }}>
              Add Assignment
            </button>
          </form>
        )}

        {/* Assignment List */}
        {assignments.length > 0 && (
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

                {/* Image Preview */}
                {a.imagePath && (
                  <img
                    src={`http://localhost:8080/${a.imagePath}`}
                    alt="Assignment"
                    width="200"
                    style={{ borderRadius: "10px", display: "block", marginTop: "10px" }}
                  />
                )}

                {/* PDF Link */}
                {a.pdfPath && (
                  <a
                    href={`http://localhost:8080/${a.pdfPath.replace(/ /g, "%20")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "8px" }}
                  >
                    📄 View PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TeacherAssignments;
