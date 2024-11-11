import express from 'express';
import con from "../utils/db.js";

const router = express.Router();

// Mark Attendance
router.post("/attendance", (req, res) => {
    const { employeeId, date, status } = req.body;
    const sql = "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?";
    con.query(sql, [employeeId, date, status, status], (err) => {
        if (err) return res.status(500).json({ error: "Failed to record attendance" });
        res.json({ success: true, message: "Attendance marked" });
    });
});

// Get Attendance Summary
router.get("/attendance-summary", (req, res) => {
    const sql = `
        SELECT e.name AS employeeName, a.date, a.status
        FROM attendance a
        JOIN employee e ON a.employee_id = e.id
        ORDER BY e.name, a.date;
    `;
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch summary" });
        res.json(result);
    });
});

export { router as attendanceRouter };
