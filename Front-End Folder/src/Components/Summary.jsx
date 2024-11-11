import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Summary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/attendance/attendance-summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error("Failed to fetch attendance summary", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Attendance Summary</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((record, index) => (
            <tr key={index}>
              <td>{record.employeeName}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Summary;
