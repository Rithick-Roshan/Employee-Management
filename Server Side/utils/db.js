import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "msipc2004",
    database: "employeems"
});

con.connect(function(err) {
    if (err) {
        console.error("Connection error:", err.message);
    } else {
        console.log("Connected to the database");
    }
});

export default con;
