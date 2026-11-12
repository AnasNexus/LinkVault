const mysql = require("mysql2")

const db = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
});

db.getConnection((error , connection) => {
    if (error) {
        console.error("Error In DataBase connection :" , error)
        return;
    };
    connection.release();
});

module.exports = db;