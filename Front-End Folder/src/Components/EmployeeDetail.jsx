import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeDetail.css'; // Importing custom styles
import EmployeeSalary from './EmployeeSalary';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const [attendance, setAttendance] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch employee details
        axios.get(`http://localhost:3000/employee/detail/${id}`)
            .then(result => {
                setEmployee(result.data[0]);
            })
            .catch(err => console.log(err));

        // Fetch employee attendance in descending order
        axios.get(`http://localhost:3000/employee/attendance/${id}`)
            .then(result => {
                setAttendance(result.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleLogout = () => {
        axios.get('http://localhost:3000/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid");
                    navigate('/');
                }
            }).catch(err => console.log(err));
    };

    return (
        <div className="employee-detail-container">
            <header className="header">
                <h4>Employee Management System</h4>
            </header>
            <main className="employee-detail-main">
                <div className="employee-info-card">
                    <img src={`http://localhost:3000/Images/${employee.image}`} className='employee-image' alt="Employee" />
                    <div className='employee-info'>
                        <h3>Name: {employee.name}</h3>
                        <h3>Email: {employee.email}</h3>
                        <EmployeeSalary employeeId={id} />
                    </div>
                    <div className="button-group">
                        <button className='btn btn-primary me-2'>Edit</button>
                        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="attendance-section mt-4">
                    <h4 className="text-center">Attendance Records</h4>
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record, index) => (
                                <tr key={index} className={`attendance-row ${record.status}`}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{record.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default EmployeeDetail;
