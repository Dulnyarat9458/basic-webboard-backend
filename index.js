const express = require('express');
const logger = require('./middleware/logger');
const app = express();
const cors = require('cors');
const mysql = require('mysql');


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
    database: "webboard"
})



app.use(cors());



db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected");
});

//Homepage route

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

//Body parse middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use('/api/users', require('./routes/api/users'));
app.use('/api/contents', require('./routes/api/contents'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


