import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })
        
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
  });
  router.get("/all-employees", (req, res) => {
    const sql = "SELECT id, name FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch employees" });
        res.json(result);
    });
});

// EmployeeRoute.js
// EmployeeRoute.js - Fetch attendance records in descending order by date
router.get("/attendance/:id", (req, res) => {
  const employeeId = req.params.id;
  const sql = `
      SELECT date, status 
      FROM attendance 
      WHERE employee_id = ?
      ORDER BY date DESC
  `;
  con.query(sql, [employeeId], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to fetch attendance data" });
      res.json(result);
  });
});

router.get("/salary/:id", (req, res) => {
  const employeeId = req.params.id;
  
  // Query to get the salary for the employee
  const sql = 'SELECT salary FROM employee WHERE id = ?';
  
  con.query(sql, [employeeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const salaryPerDay = parseInt(result[0].salary); 
    // Get the attendance records for the employee
    const attendanceQuery = 'SELECT status FROM attendance WHERE employee_id = ?';
    
    con.query(attendanceQuery, [employeeId], (err, attendanceRecords) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let totalSalary = 0;

      attendanceRecords.forEach(record => {
        if (record.status === 'present') {
          totalSalary += salaryPerDay;
        } else if (record.status === 'half-day') {
          totalSalary += salaryPerDay / 2;
        }
      });
      console.log(totalSalary);

      return res.json({ totalSalary });
    });
  });
});


  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        console.log(result[0].salary);
        return res.json(result)
    })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  export {router as employeeRouter}