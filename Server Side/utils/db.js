import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "msipc2004",
    database: "employeems"
});

con.connect(function(err) {
    if (err) {
        console.error("Connection error:", err.message);  // Log the actual error message
    } else {
        console.log("Connected to the database");
    }
});

export default con;
