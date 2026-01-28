import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { fetchEmployees, fetchAttendance, markAttendance } from "../api";

const Attendance = () => {
  // Default to today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate]); // Reload when date changes

  const loadData = async () => {
    setLoading(true);
    try {
      const [emps, attn] = await Promise.all([
        fetchEmployees(),
        fetchAttendance(selectedDate),
      ]);
      setEmployees(emps);

      // Convert attendance array to map for easier lookup: { employee_id: status }
      const map = {};
      attn.forEach((record) => {
        map[record.employee_id] = record.status;
      });
      setAttendanceMap(map);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (employeeId, status) => {
    // Optimistic update
    const originalStatus = attendanceMap[employeeId];
    setAttendanceMap((prev) => ({ ...prev, [employeeId]: status }));

    try {
      await markAttendance({
        employee_id: employeeId,
        date: selectedDate,
        status: status,
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      // Revert on error
      setAttendanceMap((prev) => ({ ...prev, [employeeId]: originalStatus }));
      alert("Failed to update attendance");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "var(--success)";
      case "Absent":
        return "var(--danger)";
      case "Leave":
        return "#f59e0b"; // Amber/Orange
      default:
        return "var(--border)";
    }
  };

  // Calculate Summary Stats based on current map
  const presentCount = Object.values(attendanceMap).filter(
    (s) => s === "Present",
  ).length;
  const absentCount = Object.values(attendanceMap).filter(
    (s) => s === "Absent",
  ).length;
  const leaveCount = Object.values(attendanceMap).filter(
    (s) => s === "Leave",
  ).length;

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
          <h1>Daily Attendance</h1>
          <p>
            Track employee presence for{" "}
            {selectedDate === today ? "Today" : selectedDate}
          </p>
        </div>
        <div
          className="card"
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Calendar size={18} color="var(--primary)" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div
          className="card"
          style={{
            flex: 1,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "var(--radius-md)",
            borderLeft: "4px solid var(--success)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            Present
          </span>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--success)",
            }}
          >
            {presentCount}
          </span>
        </div>
        <div
          className="card"
          style={{
            flex: 1,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "var(--radius-md)",
            borderLeft: "4px solid var(--danger)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            Absent
          </span>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--danger)",
            }}
          >
            {absentCount}
          </span>
        </div>
        <div
          className="card"
          style={{
            flex: 1,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "var(--radius-md)",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            On Leave
          </span>
          <span
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f59e0b" }}
          >
            {leaveCount}
          </span>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.2rem 0.6rem",
                        background: "#f8fafc",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {emp.department}
                    </span>
                  </td>
                  <td>{emp.position}</td>
                  <td>
                    {attendanceMap[emp.id] ? (
                      <span
                        className={`status-badge`}
                        style={{
                          backgroundColor:
                            getStatusColor(attendanceMap[emp.id]) + "20",
                          color: getStatusColor(attendanceMap[emp.id]),
                        }}
                      >
                        {attendanceMap[emp.id]}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.875rem",
                        }}
                      >
                        Not Marked
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        title="Mark Present"
                        onClick={() => handleMarkAttendance(emp.id, "Present")}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #dcfce7",
                          background:
                            attendanceMap[emp.id] === "Present"
                              ? "#dcfce7"
                              : "white",
                          color: "#166534",
                          cursor: "pointer",
                        }}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        title="Mark Absent"
                        onClick={() => handleMarkAttendance(emp.id, "Absent")}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #fee2e2",
                          background:
                            attendanceMap[emp.id] === "Absent"
                              ? "#fee2e2"
                              : "white",
                          color: "#991b1b",
                          cursor: "pointer",
                        }}
                      >
                        <XCircle size={18} />
                      </button>
                      <button
                        title="On Leave"
                        onClick={() => handleMarkAttendance(emp.id, "Leave")}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #fef3c7",
                          background:
                            attendanceMap[emp.id] === "Leave"
                              ? "#fef3c7"
                              : "white",
                          color: "#92400e",
                          cursor: "pointer",
                        }}
                      >
                        <Clock size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
