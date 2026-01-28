import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { createEmployee } from "../api";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    position: "",
    department: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createEmployee(formData);
      navigate("/employees");
    } catch (err) {
      console.error(err);
      // Try to parse the error message if possible, otherwise generic
      setError(
        err.message || "Failed to create employee. Please check your inputs.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
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

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem" }}>Add New Employee</h2>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1.5rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Full Name *
              </label>
              <input
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                type="text"
                className="input-field"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Email Address *
              </label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="input-field"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Job Position *
              </label>
              <input
                required
                name="position"
                value={formData.position}
                onChange={handleChange}
                type="text"
                className="input-field"
                placeholder="e.g. Senior Developer"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Department *
              </label>
              <select
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--primary)",
                }}
              />
              <span style={{ fontWeight: 500 }}>Active Employee</span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="btn"
              style={{ border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
