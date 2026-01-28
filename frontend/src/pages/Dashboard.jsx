import React, { useEffect, useState } from "react";
import { Users, Briefcase, TrendingUp } from "lucide-react";
import { fetchEmployees } from "../api";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className="card"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      animation: "fadeIn 0.5s ease-out",
    }}
  >
    <div
      style={{
        padding: "1rem",
        borderRadius: "50%",
        background: color + "20",
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: "0.875rem", fontWeight: 500, opacity: 0.7 }}>
        {title}
      </p>
      <h3 style={{ fontSize: "1.75rem", marginTop: "0.25rem" }}>{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calculate unique departments
  const departments = new Set(employees.map((e) => e.department)).size;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1>Dashboard</h1>
        <p>Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <StatCard
          title="Total Employees"
          value={loading ? "..." : employees.length}
          icon={Users}
          color="#4F46E5"
        />
        <StatCard
          title="Departments"
          value={loading ? "..." : departments}
          icon={Briefcase}
          color="#10b981"
        />
        <StatCard
          title="New Joiners"
          value={loading ? "..." : Math.min(employees.length, 3)}
          icon={TrendingUp}
          color="#f59e0b"
        />
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3>Recent Hires</h3>
        </div>

        {loading ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading stats...
          </div>
        ) : employees.length === 0 ? (
          <p style={{ padding: "1rem", color: "var(--text-muted)" }}>
            No employees found.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Show last 5 employees (assuming latest are at the end, usually would sort by date created) */}
              {[...employees]
                .reverse()
                .slice(0, 5)
                .map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span
                        className={`status-badge ${emp.is_active ? "status-active" : "status-inactive"}`}
                      >
                        {emp.is_active ? "Active" : "Inactive"}
                      </span>
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

export default Dashboard;
