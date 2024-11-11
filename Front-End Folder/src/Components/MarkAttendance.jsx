import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function MarkAttendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [status, setStatus] = useState("present");
    const [date, setDate] = useState("");

    // Fetch employees when the component mounts
    useEffect(() => {
        axios.get("http://localhost:3000/employee/all-employees")
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch employees:", error);
            });
    }, []);

    const handleSubmit = () => {
        if (!selectedEmployee || !date) {
            alert("Please select an employee and date");
            return;
        }
        axios.post("http://localhost:3000/attendance/attendance", {
            employeeId: selectedEmployee,
            date: date,
            status: status,
        })
            .then((response) => {
                alert("Attendance marked successfully");
            })
            .catch((error) => {
                console.error("Failed to mark attendance:", error);
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Mark Attendance</h2>
            <div className="card p-4">
                <div className="form-group mb-3">
                    <label>Select Employee:</label>
                    <select
                        className="form-control"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="">Select an employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Status:</label>
                    <select
                        className="form-control"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                    Mark Attendance
                </button>
            </div>
        </div>
    );
}

export default MarkAttendance;
