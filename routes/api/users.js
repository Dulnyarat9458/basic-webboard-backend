const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secert = 'fullstack-login-2022'
const nodemailer = require('nodemailer');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
    database: "webboard"
})




router.get('/', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
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
    db.query("SELECT * FROM users WHERE id = " + req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    }
    )
})


router.post('/login', (req, res) => {
    const email = req.body.user_email;
    const password = req.body.user_password;
    console.log(email);
    console.log(password);
    db.query(`SELECT * FROM users WHERE user_email = "${email}"`, (err, user) => {
        if (err) { res.send(err); return }
        if (user.length == 0) {
            res.json({
                msg: "not found this user",
                status: "error",
            }); return
        } else {
            bcrypt.compare(password, user[0].user_password, (err, isLogin) => {
                if (isLogin) {
                    var token = jwt.sign({
                        id: user[0].user_id,
                        email: user[0].user_email,
                        name: user[0].user_name,
                        gender: user[0].user_gender,
                        role: user[0].user_role
                    },
                        secert
                    );
                    res.json({
                        msg: "login success",
                        status: "ok",
                        token: token,
                    });

                } else {
                    res.json({
                        msg: "wrong password",
                        status: "error",
                    });
                }
            });
        }
    }
    )
})

router.post('/auth', (req, res) => {
    console.log("=======================");
    console.log(req.headers.authorization);
    console.log("=======================");
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, secert);
        console.log("decoded : " + decoded)
        res.json({ token, decoded, status: "ok" })
    } catch (error) {
        console.log("decoded error : " + decoded)
        console.log("token error : " + token)
        res.json({
            msg: error,
            status: "error",
        });
    }
});

//register user
router.post('/register', (req, res) => {
    const email = req.body.user_email;
    const password = req.body.user_password;
    const name = req.body.user_name;
    const gender = req.body.user_gender;

    bcrypt.hash(password, saltRounds, function (err, hashpassword) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            db.query(`SELECT * FROM users WHERE user_email = "${email}"`, (err, user) => {
                if (user.length == 0) {
                    db.query(
                        `INSERT INTO users ( user_email, user_password, user_name, user_gender, user_role) VALUES ("${email}","${hashpassword}","${name}","${gender}","m")`,
                        (err, result) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.json({
                                    msg: "Register Sucessful, you can use this account now",
                                    status: "ok",
                                });
                            }
                        }
                    );
                } else {
                    res.json({
                        msg: "Email Already in Use",
                        status: "error",
                    }); return
                }
            })
        }
    });
})


router.post('/recovery', (req, res) => {
    const email = req.body.user_email;

    db.query('SELECT * FROM users WHERE user_email ="' + email + '"', (err, user) => {
        if (user.length !== 0) {
            let transporter = nodemailer.createTransport({
                host: 'gmail',
                service: 'Gmail',
                auth: {
                    user: 'dulnyarat.9458@gmail.com',
                    pass: 'exlpqveqtepxweqa',
                },
            });
            const token = jwt.sign({
                id: user[0].user_id,
                email: user[0].user_email,
                name: user[0].user_name,
                gender: user[0].user_gender,
                role: user[0].user_role
            },
                secert
            );
            transporter.sendMail({
                from: 'dulnyarat.9458@gmail.com',
                to: email,
                subject: "Reset your password",
                text: "ตอบรับการร้องขอรีเซ็ตรหัสผ่าน",
                html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3000/newpassword/' + email + '/?token=' + token + '">link</a> to reset your password</p>',
            }, (err, info) => {
                if (err) {
                    res.status(400).json({
                        status: "error",
                        msg: err,
                    });
                } else {
                    res.status(200).json({
                        status: "ok",
                        msg: "The Email is registered with us and we send the recovery email",
                    });
                }
            });
        } else {
            res.json({
                status: "error",
                msg: "The Email isn't registered with us",
            });
        }
    });
})


router.put('/resetpassword', (req, res) => {

    try {
        const password = req.body.new_password;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secert);
        const uid = decoded.id
        console.log("decoded : " + decoded.id)
        console.log(password)
        bcrypt.hash(password, saltRounds, function (err, hashpassword) {
            db.query(
                `UPDATE users SET user_password ="${hashpassword}" WHERE user_id = "${uid}"`,
                (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).json({
                            "status": "ok", "msg": "update complete",
                            "decoded-data": decoded, "new-password": hashpassword,
                        });
                    }
                }
            );
        })
    } catch (err) {
        res.status(400).json({
            "status": "error",
            "msg": err,
        });
    }
})

//update user
router.put('/:id', (req, res) => {
    const name = req.body.name;
    console.log(name)
    db.query(
        `UPDATE member SET name ="${name}" WHERE id = "${req.params.id}"`,
        (err, result) => {
            if (err) {
                console.log(id);
                console.log(name);
                console.log(email);
                res.send(err);
            } else {
                res.send("Values Updated");
            }
        }
    );
})


//update user
router.delete('/:id', (req, res) => {
    db.query(
        `DELETE FROM member WHERE id = "${req.params.id}"`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Values Deleted");
            }
        }
    );
})







module.exports = router; 
