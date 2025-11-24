import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewAssignment() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/assignments/${id}`)
      .then((response) => setAssignment(response.data))
      .catch((error) => console.error("Error loading assignment:", error));
  }, [id]);

  if (!assignment) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{assignment.title}</h2>
      <p><strong>Deadline:</strong> {assignment.deadline}</p>
      <p>{assignment.description}</p>

      {/* Image Preview */}
      {assignment.imagePath && (
        <div>
          <h3>Image</h3>
          <img
            src={`http://localhost:8080/${assignment.imagePath}`}
            alt="Assignment"
            width="300"
            style={{ borderRadius: "10px", marginBottom: "20px" }}
          />
          <br />
          <a
            href={`http://localhost:8080/${assignment.imagePath}`}
            download
          >
            Download Image
          </a>
        </div>
      )}

      {/* PDF Preview */}
      {assignment.pdfPath && (
        <div style={{ marginTop: "20px" }}>
          <h3>PDF</h3>
          <iframe
            src={`http://localhost:8080/${assignment.pdfPath}`}
            width="100%"
            height="500px"
            title="PDF Preview"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          ></iframe>
          <br />
          <a
            href={`http://localhost:8080/${assignment.pdfPath}`}
            download
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default ViewAssignment;
