import React, { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./dashboards/StudentDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {role === "STUDENT" && <StudentDashboard />}
      {role === "TEACHER" && <TeacherDashboard />}
    </>
  );
}

export default App;
