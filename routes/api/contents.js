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
    db.query("SELECT contents.content_id,contents.content_topic,contents.content_story,users.user_name as content_writer,contents.content_post_time FROM contents INNER JOIN users ON contents.content_author_id = users.user_id ORDER BY contents.content_post_time DESC", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(result);
            res.send(result);
        }
    }
    )
})

//get user
router.get('/own/:id', (req, res) => {
    db.query("SELECT * FROM contents  WHERE content_author_id = " + req.params.id + "  ORDER BY contents.content_post_time DESC", (err, result) => {
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

router.put('/own/update/:id/:content_id', (req, res) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        const uid = req.body.content_author_id;
        const cid = req.body.content_id;
        const topic = req.body.content_topic;
        const story = req.body.content_story;

        console.log(req.body)

        var decoded = jwt.verify(token, secert);
        console.log("decoded : " + decoded)



        console.log(uid)
        console.log(cid)
        console.log(topic)
        console.log(story)
        // res.json({
        //     msg: "ok",
        //     status: "ok",
        // });
        db.query(
            `UPDATE contents SET content_topic ="${topic}",content_story ="${story}" WHERE content_author_id = "${uid}" AND content_id = "${cid}"`,
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
        console.log("decoded error : " + decoded)
        console.log("token error : " + token)
        res.json({
            msg: error,
            status: "error",
        });
    }
})


router.delete('/own/delete/:id/:content_id', (req, res) => {
    const uid = req.params.id;
    const content_id = req.params.content_id;
    console.log(uid);
    console.log(content_id);
    db.query(`DELETE contents.*,comments.* FROM contents LEFT JOIN comments ON contents.content_id = comments.comment_content_id WHERE content_id = "${content_id}" AND  content_author_id = "${uid}"`, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json({
                msg: "Delete Content Successful",
                status: "ok",
            });
            console.log(result);
        }
    }
    )
})

router.get('/:id', (req, res) => {
    db.query("SELECT contents.content_id,contents.content_topic,contents.content_author_id,contents.content_story,users.user_name as content_writer,contents.content_post_time FROM contents INNER JOIN users ON contents.content_author_id = users.user_id  WHERE content_id = " + req.params.id, (err, result) => {
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
router.post('/addcontent', (req, res) => {
    const topic = req.body.content_topic;
    const story = req.body.content_story;
    const author_id = req.body.content_author_id;
    console.log(req.body)
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(
        `INSERT INTO contents ( content_topic, content_story, content_author_id,content_post_time) VALUES ("${topic}","${story}","${author_id}","${datetime}")`,
        (err, result) => {
            if (err) {
                res.json({
                    msg: err,
                    status: "error",
                });
            } else {
                res.json({
                    msg: "Add post Successful",
                    status: "ok",
                });
            }
        }
    );

})





module.exports = router; 
