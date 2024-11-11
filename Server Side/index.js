import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { employeeRouter } from "./Routes/EmployeeRoute.js";
import { attendanceRouter } from "./Routes/AttendanceRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', employeeRouter);
app.use('/attendance', attendanceRouter);
app.use(express.static('Public'));

// Middleware to verify user and role
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Invalid Token" });
            if (decoded.role === 'admin') {
                req.id = decoded.id;
                next();
            } else {
                return res.status(403).json({ Status: false, Error: "Unauthorized Access" });
            }
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// Test route for verifying admin
app.get('/verify', verifyAdmin, (req, res) => {
    return res.json({ Status: true, role: 'admin', id: req.id });
});

app.listen(3000, () => {
    console.log("Server is running");
});
