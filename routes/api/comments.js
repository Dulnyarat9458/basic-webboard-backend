const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createPool({
    user: process.env.MYSQL_USER,
    host: process.env.DB_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

router.get('/', (req, res) => {
    db.query("SELECT comments.comment_id,comments .comment_text,users.user_name as comment_writer,comments.comment_date,comments.comment_writer_id, contents.content_topic FROM comments INNER JOIN users ON comments.comment_writer_id = users.user_id INNER JOIN contents ON comments.comment_content_id = contents.content_id ", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})

router.get('/:id', (req, res) => {
    db.query("SELECT  comments.comment_id,comments .comment_text,users.user_name as content_writer,comments.comment_date,comments.comment_writer_id ,users.user_name as comment_writer FROM comments INNER JOIN users ON comments.comment_writer_id = users.user_id INNER JOIN contents ON comments.comment_content_id = contents.content_id  WHERE content_id = " + req.params.id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})

router.get('/only/:comment_id', (req, res) => {
    db.query("SELECT * FROM comments  WHERE comment_id = " + req.params.comment_id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})

router.delete('/own/delete/:id/:comment_id', (req, res) => {
    const uid = req.params.id;
    const comment_id = req.params.comment_id;
    db.query(`DELETE FROM comments WHERE comment_id = "${comment_id}" AND  comment_writer_id = "${uid}"`, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json({
                msg: "Delete Comment Successful",
                status: "ok",
                uid: uid,
                comment_id: comment_id
            });
            console.log(result);
        }
    }
    )
})

router.post('/addcomment', (req, res) => {
    const text = req.body.comment_text;
    const writer_id = req.body.comment_writer_id;
    const content_id = req.body.comment_content_id;
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
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

router.put('/own/update/:id/:comment_id', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const uid = req.body.comment_writer_id;
        const cid = req.body.comment_id;
        const text = req.body.comment_text;
        db.query(
            `UPDATE comments SET comment_text ="${text}" WHERE comment_writer_id = "${uid}" AND comment_id = "${cid}"`,
            (err, result) => {
                if (err) {
                    res.send(err);
                    console.log(err)
                } else {
                    console.log(result)
                    res.json({
                        "status": "ok",
                        "msg": "update Content complete",
                    });

                }
            }
        );

    } catch (error) {
        res.json({
            msg: error,
            status: "error",
        });
    }
})
module.exports = router; 
