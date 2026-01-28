const API_URL = "http://localhost:8000";

// --- MOCK DATA CONFIGURATION ---
// Set this to 'false' when your Python backend is running to use the real database.
const USE_MOCK_DATA = false;

const MOCK_DELAY = 600; // Simulate network latency

// Initial Mock Data
const INITIAL_EMPLOYEES = [
  {
    id: 1,
    full_name: "Sarah Connors",
    email: "sarah@company.com",
    position: "Product Manager",
    department: "Product",
    is_active: true,
  },
  {
    id: 2,
    full_name: "John Smith",
    email: "john.smith@company.com",
    position: "Senior Developer",
    department: "IT",
    is_active: true,
  },
  {
    id: 3,
    full_name: "Emily Blunt",
    email: "emily@company.com",
    position: "HR Specialist",
    department: "HR",
    is_active: true,
  },
  {
    id: 4,
    full_name: "Michael Scott",
    email: "michael@company.com",
    position: "Regional Manager",
    department: "Sales",
    is_active: true,
  },
];

// Helper to simulate async delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get/set from localStorage
const getStorage = (key, defaultVal) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// --- API FUNCTIONS ---

export const fetchEmployees = async () => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY);
    return getStorage("hrs_employees", INITIAL_EMPLOYEES);
  }

  const response = await fetch(`${API_URL}/employees/`);
  if (!response.ok) throw new Error("Failed to fetch employees");
  return response.json();
};

export const fetchEmployeeById = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY);
    const employees = getStorage("hrs_employees", INITIAL_EMPLOYEES);
    const emp = employees.find((e) => e.id === parseInt(id));
    if (!emp) throw new Error("Employee not found");
    return emp;
  }

  const response = await fetch(`${API_URL}/employees/${id}`);
  if (!response.ok) throw new Error("Failed to fetch employee");
  return response.json();
};

export const createEmployee = async (employeeData) => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY);
    const employees = getStorage("hrs_employees", INITIAL_EMPLOYEES);

    // SimulateDuplicate Check
    if (employees.some((e) => e.email === employeeData.email)) {
      throw new Error("An employee with this email already exists.");
    }

    const newEmp = { ...employeeData, id: Date.now() }; // Simple ID generation
    employees.push(newEmp);
    setStorage("hrs_employees", employees);
    return newEmp;
  }

  const response = await fetch(`${API_URL}/employees/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData),
  });
  if (!response.ok) {
    let errorMsg = "Failed to create employee";
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (e) {
      /* ignore */
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

export const deleteEmployee = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY);
    const employees = getStorage("hrs_employees", INITIAL_EMPLOYEES);
    const filtered = employees.filter((e) => e.id !== id);
    setStorage("hrs_employees", filtered);
    return { message: "Deleted" };
  }

  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete employee");
  return response.json();
};

export const fetchAttendance = async (date = null, employeeId = null) => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY);
    let attendance = getStorage("hrs_attendance", []);

    if (date) attendance = attendance.filter((r) => r.date === date);
    if (employeeId)
      attendance = attendance.filter(
        (r) => r.employee_id === parseInt(employeeId),
      );

    return attendance;
  }

  let url = `${API_URL}/attendance/?`;
  if (date) url += `date=${date}&`;
  if (employeeId) url += `employee_id=${employeeId}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
};

export const markAttendance = async (data) => {
  if (USE_MOCK_DATA) {
    // await delay(300); // Faster for UI responsiveness
    const attendance = getStorage("hrs_attendance", []);

    // Remove existing record for this user & date
    const filtered = attendance.filter(
      (r) => !(r.employee_id === data.employee_id && r.date === data.date),
    );

    const newRecord = { ...data, id: Date.now() };
    filtered.push(newRecord);
    setStorage("hrs_attendance", filtered);
    return newRecord;
  }

  const response = await fetch(`${API_URL}/attendance/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to mark attendance");
  return response.json();
};
