import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch all assignments from backend
  const fetchAssignments = () => {
    axios
      .get("http://localhost:8080/assignments")
      .then((response) => setAssignments(response.data))
      .catch((error) => console.error("Error fetching assignments:", error));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle adding a new assignment
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const newAssignment = { title, description, deadline };

    axios
      .post("http://localhost:8080/assignments", newAssignment)
      .then(() => {
        setTitle("");
        setDescription("");
        setDeadline("");
        setShowForm(false);
        fetchAssignments();
      })
      .catch((error) => console.error("Error adding assignment:", error));
  };

    return (
    <div className="dashboard-content">
      <div className="placeholder-box">
        <h1>Your Assignments</h1>

        {/* Button to show/hide create form */}
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

        {/* Assignment creation form */}
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
              required
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
           <input
            type="date"
            value={deadline}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDeadline(e.target.value)}
          />

            <br />
            <button type="submit" style={{ marginTop: "10px" }}>
              Add Assignment
            </button>
          </form>
        )}

        {/* Show assignments only if present */}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

}

export default TeacherAssignments;
