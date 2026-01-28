import React, { useEffect, useState } from "react";
import { Plus, Trash2, Search, AlertCircle, Eye } from "lucide-react";
import { fetchEmployees, deleteEmployee } from "../api";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employee data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        // Optimistic update or reload
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          color: "var(--text-muted)",
        }}
      >
        <div className="spinner"></div>{" "}
        {/* You might want to add a spinner CSS or just text */}
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>
          <AlertCircle size={48} />
        </div>
        <h2>Something went wrong</h2>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
        <button
          onClick={loadEmployees}
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1>Employees</h1>
          <p>Manage your team members and their roles.</p>
        </div>
        <Link to="/add-employee" className="btn btn-primary">
          <Plus size={18} />
          Add Employee
        </Link>
      </div>

      <div className="card">
        <div
          style={{
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1rem",
          }}
        >
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or dept..."
              className="input-field"
              style={{ paddingLeft: "2.5rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{emp.email}</td>
                  <td>{emp.position}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.2rem 0.6rem",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {emp.department}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${emp.is_active ? "status-active" : "status-inactive"}`}
                    >
                      {emp.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        to={`/employees/${emp.id}`}
                        style={{
                          color: "var(--primary)",
                          padding: "6px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        title="View Details"
                        className="hover-bg"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          color: "var(--danger)",
                          padding: "6px",
                          borderRadius: "4px",
                        }}
                        title="Delete Employee"
                        className="hover-danger-bg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <Search size={32} style={{ opacity: 0.3 }} />
                  </div>
                  No employees found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
