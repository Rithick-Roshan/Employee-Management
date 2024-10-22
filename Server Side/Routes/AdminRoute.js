import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
    console.log("Request body:", req.body);

    const sql = "SELECT * FROM admin WHERE email = ?";  // Query only by email
    
    con.query(sql, [req.body.email], (err, result) => {
      if (err) {
        console.log("Query error:", err);
        return res.json({ loginStatus: false, Error: "Query error" });
      }
      
      if (result.length > 0) {
        const hashedPassword = result[0].password;
        console.log("Hashed password from DB:", hashedPassword);
        console.log("Plain text password:", req.body.password);
  
        // Check the password using bcrypt.compare
        bcrypt.compare(req.body.password, hashedPassword, (err, isMatch) => {
          if (err) {
            console.log("Error comparing passwords:", err);
            return res.json({ loginStatus: false, Error: "Error comparing passwords" });
          }
          
          if (isMatch) {
            const email = result[0].email;
            const token = jwt.sign(
              { role: "admin", email: email, id: result[0].id },
              "jwt_secret_key",
              { expiresIn: "1d" }
            );
            res.cookie('token', token);
            return res.json({ loginStatus: true });
          } else {
            console.log("Password does not match");
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
          }
        });
      } else {
        console.log("No user found with this email");
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }
    });
  });
  
router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})
router.post('/mark_attendance', (req, res) => {
    const { employee_id, date, status } = req.body;
    const sql = "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)";
    con.query(sql, [employee_id, date, status], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true });
    });
});
// Calculate Salary based on Attendance
router.get('/calculate_salary/:employee_id', (req, res) => {
    const id = req.params.employee_id;
    const sql = `
        SELECT 
            e.salary,
            COUNT(a.id) AS present_days
        FROM 
            employee e
        LEFT JOIN 
            attendance a ON e.id = a.employee_id AND a.status = 'present'
        WHERE 
            e.id = ?
        GROUP BY 
            e.id
    `;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });

        const salaryPerDay = result[0].salary / 30; // Assuming a monthly salary
        const totalSalary = salaryPerDay * result[0].present_days;

        return res.json({ Status: true, TotalSalary: totalSalary });
    });
});


router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})


export { router as adminRouter };
