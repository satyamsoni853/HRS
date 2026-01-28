import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetails from "./pages/EmployeeDetails";
import AddEmployee from "./pages/AddEmployee";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
