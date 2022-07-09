const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secert = 'fullstack-login-2022'


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
    database: "webboard"
})




router.get('/', (req, res) => {
    db.query("SELECT * FROM contents", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})

//get user
router.get('/:id', (req, res) => {
    db.query("SELECT * FROM contents WHERE id = " + req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})


//post content
router.post('/addcontent', (req, res) => {
    const topic = req.body.content_topic;
    const story = req.body.content_story;
    const author = req.body.content_author;
    const author_id = req.body.content_author_id;

    console.log(req.body)

    db.query(
        `INSERT INTO contents ( content_topic, content_story, content_author, content_author_id) VALUES ("${topic}","${story}","${author}","${author_id}")`,
        (err, result) => {
            if (err) {
                res.json({
                    msg: err,
                    status: "error",
                });
            } else {
                res.json({
                    msg: "Add post Sucessful",
                    status: "ok",
                });
            }
        }
    );

})





module.exports = router; 
