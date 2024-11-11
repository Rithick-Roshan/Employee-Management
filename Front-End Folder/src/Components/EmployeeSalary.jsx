import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeSalary = ({ employeeId }) => {
    const [salary, setSalary] = useState(0);
// EmployeeSalary.jsx
useEffect(() => {
    axios.get(`http://localhost:3000/employee/salary/${employeeId}`)
        .then(response => {
            setSalary(parseInt(response.data.totalSalary));
        })
        .catch(err => {
            console.log(err);
        });
}, [employeeId]);


    return (
        <div>
            <h4>Total Salary: ${salary.toFixed(2)}</h4>
        </div>
    );
};

export default EmployeeSalary;
