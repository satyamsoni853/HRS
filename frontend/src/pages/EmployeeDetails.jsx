import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEmployeeById, fetchAttendance } from "../api";
import { ArrowLeft, User, Mail, Briefcase, Calendar } from "lucide-react";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [empData, searchData] = await Promise.all([
          fetchEmployeeById(id),
          fetchAttendance(null, id),
        ]);
        setEmployee(empData);
        // Sort attendance by date descending
        setAttendanceHistory(
          searchData.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } catch (err) {
        setError("Failed to load employee details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div
        style={{ padding: "2rem", textAlign: "center", color: "var(--danger)" }}
      >
        {error}
      </div>
    );
  if (!employee)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Employee not found
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "var(--success)";
      case "Absent":
        return "var(--danger)";
      case "Leave":
        return "#f59e0b";
      default:
        return "var(--text-muted)";
    }
  };

  // Calculate stats
  const totalDays = attendanceHistory.length;
  const presentDays = attendanceHistory.filter(
    (a) => a.status === "Present",
  ).length;
  const attendanceRate =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div>
      <button
        onClick={() => navigate("/employees")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={18} />
        Back to List
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Profile Card */}
        <div className="card">
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#e0e7ff",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto",
              }}
            >
              <User size={40} />
            </div>
            <h2>{employee.full_name}</h2>
            <span
              className={`status-badge ${employee.is_active ? "status-active" : "status-inactive"}`}
              style={{ marginTop: "0.5rem" }}
            >
              {employee.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <Mail size={18} />
              <span>{employee.email}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <Briefcase size={18} />
              <span>
                {employee.position} &bull; {employee.department}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <h4 style={{ marginBottom: "1rem" }}>Attendance Stats</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>
                Attendance Rate
              </span>
              <span style={{ fontWeight: 600 }}>{attendanceRate}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#f1f5f9",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${attendanceRate}%`,
                  height: "100%",
                  background: "var(--primary)",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="card">
          <h3
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Calendar size={20} />
            Attendance History
          </h3>

          {attendanceHistory.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              No attendance records found.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 500 }}>{record.date}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(record.status) + "20",
                          color: getStatusColor(record.status),
                        }}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
