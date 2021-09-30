"use strict";
exports.__esModule = true;
var express = require("express");
var dotenv = require("dotenv");
var mysql = require("mysql");
dotenv.config();
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
connection.connect();
var app = express();
var port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded());
app.get('/', function (req, res) {
    res.send("Hello world!");
});
app.get('/posts/get/:from', function (req, res) {
    connection.query('SELECT * FROM `posts` ORDER BY `id` LIMIT ?,?', [req.params.from, req.params.from + 20], function (err, rows, fields) {
        res.json(JSON.stringify(rows));
    });
});
app.get('/post/get/:id', function (req, res) {
    connection.query('SELECT * FROM `posts` WHERE `id`=?', [req.params.id], function (err, rows, fields) {
        res.json(JSON.stringify(rows[0]));
    });
});
app.get('/post/add/:token/:id', function (req, res) {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function (err, rows, fields) {
        if (!rows[0].hasOwnProperty('token')) {
            res.json({ error: "token_invalid" });
        }
        var now = new Date().toLocaleString();
        connection.query('INSERT INTO `posts` (`title`,`date`,`body`,`attachments`) VALUES (?,?,?,?)', [req.body.title, now, req.body.body, req.body.attachments], function (err, rows, fields) {
            res.send('""');
            res.status(201).end();
        });
    });
});
app.get('/post/edit/:token/:id', function (req, res) {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function (err, rows, fields) {
        if (!rows[0].hasOwnProperty('token')) {
            res.json({ error: "token_invalid" });
        }
        connection.query('UPDATE `posts` SET `title`=?, `body`=?, `attachments`=? WHERE `id`', [req.body.title, req.body.body, req.body.attachments], function (err, rows, fields) {
            res.send('""');
            res.status(202).end();
        });
    });
});
app.get('/post/edit/:token/:id', function (req, res) {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function (err, rows, fields) {
        if (!rows[0].hasOwnProperty('token')) {
            res.json({ error: "token_invalid" });
        }
        connection.query('DELETE FROM `posts` WHERE `id`=?', [req.params.id], function (err, rows, fields) {
            res.send('""');
            res.status(202).end();
        });
    });
});
app.listen(port, function () {
    console.log("\u26A1\uFE0FThe application is listening on port " + port + "!\u26A1\uFE0F");
});
