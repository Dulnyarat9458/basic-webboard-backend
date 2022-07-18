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






router.get('/:id', (req, res) => {
    db.query("SELECT comments.comment_id,comments.comment_text,users.user_name as content_writer,comments.comment_date FROM comments INNER JOIN users ON comments.comment_writer_id = users.user_id INNER JOIN contents ON comments.comment_content_id = contents.content_id  WHERE content_id = " + req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
            console.log(result);
        }
    }
    )
})



//post content
router.post('/addcomment', (req, res) => {
    const text = req.body.comment_text;
    const writer_id = req.body.comment_writer_id;
    const content_id = req.body.comment_content_id;
    console.log(req.body)
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(
        `INSERT INTO comments ( comment_text,comment_writer_id,comment_content_id,comment_date) VALUES ("${text}","${writer_id}","${content_id}","${datetime}")`,
        (err, result) => {
            if (err) {
                res.json({
                    msg: err,
                    status: "error",
                });
            } else {
                res.json({
                    msg: "Add comment Successful",
                    status: "ok",
                });
            }
        }
    );

})





module.exports = router; 
