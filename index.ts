import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql';
dotenv.config();
const connection:mysql.Connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
connection.connect();
const app:Application = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded());
app.get('/', (req:Request, res:Response) => {
    res.send("Hello world!");
})
export interface post{
    id: Number,
    title: String,
    date: String,
    body: String,
    attachments: String,
}
app.get('/posts/get/:from', (req:Request, res:Response) => {
    connection.query('SELECT * FROM `posts` ORDER BY `id` LIMIT ?,?', [req.params.from,req.params.from+20], function(err, rows, fields) {
        res.json(JSON.stringify(rows))
    });
})
app.get('/post/get/:id', (req:Request, res:Response) => {
    connection.query('SELECT * FROM `posts` WHERE `id`=?', [req.params.id], function(err, rows, fields) {
        res.json(JSON.stringify(rows[0]))
    });
})
app.get('/post/add/:token/:id', (req:Request, res:Response) => {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function(err, rows, fields) {
        if(!rows[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        var now:String = new Date().toLocaleString();
        connection.query('INSERT INTO `posts` (`title`,`date`,`body`,`attachments`) VALUES (?,?,?,?)', [req.body.title,now,req.body.body,req.body.attachments], function(err, rows, fields) {
            res.send('""');
            res.status(201).end();
        });
    });
})
app.get('/post/edit/:token/:id', (req:Request, res:Response) => {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function(err, rows, fields) {
        if(!rows[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        connection.query('UPDATE `posts` SET `title`=?, `date`=?, `body`=?, `attachments`=? WHERE `id`', [req.body.title,now,req.body.body,req.body.attachments], function(err, rows, fields) {
            res.send('""');
            res.status(202).end();
        });
    });
})
app.get('/post/edit/:token/:id', (req:Request, res:Response) => {
    connection.query('SELECT * FROM `users` WHERE `token`=?', [req.params.token], function(err, rows, fields) {
        if(!rows[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        connection.query('DELETE FROM `posts` WHERE `id`=?', [req.params.id], function(err, rows, fields) {
            res.send('""');
            res.status(202).end();
        });
    });
})
app.listen(port, () => {
    console.log(`⚡️The application is listening on port ${port}!⚡️`);
})