const express = require('express');
const logger = require('./middleware/logger');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const db = mysql.createPool({
    user: process.env.MYSQL_USER,
    host: process.env.DB_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.use(cors());

db.getConnection(function (err) {
    if (err) {
        console.log("not connect")
        console.log(err.message);
        throw err ; 
    }
    console.log("Database Connected");
});

app.get('/', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
            console.log(result)
        }
    }
    )
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use('/api/users', require('./routes/api/users'));
app.use('/api/contents', require('./routes/api/contents'));
app.use('/api/comments', require('./routes/api/comments'));
app.listen(PORT, () => {
    console.log("=======")
    console.log(`Server is running on port ${PORT}`)
    console.log("=======")
});


