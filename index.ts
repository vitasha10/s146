import * as express from 'express';
import {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2';
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
connection.connect();
const app = express();
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
    connection.promise().query('SELECT * FROM `posts` ORDER BY `id` LIMIT ?,?', [req.params.from,req.params.from+20]).then(([rows, fields]) => {
        res.json(JSON.stringify(rows))
    }).catch(console.log);
})
app.get('/post/get/:id', (req:Request, res:Response) => {
    connection.promise().query('SELECT * FROM `posts` WHERE `id`=?', [req.params.id]).then(([rows, fields]) => {
        res.json(JSON.parse(JSON.stringify(rows))[0])
    }).catch(console.log);
})
app.get('/post/add/:token/:id', (req:Request, res:Response) => {
    connection.promise().query('SELECT * FROM `users` WHERE `token`=?', [req.params.token]).then(([rows, fields]) => {
        if(!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        var now:String = new Date().toLocaleString();
        connection.promise().query('INSERT INTO `posts` (`title`,`date`,`body`,`attachments`) VALUES (?,?,?,?)', [req.body.title,now,req.body.body,req.body.attachments]).then(([rows, fields]) => {
            res.send('""');
            res.status(201).end();
        }).catch(console.log);
    }).catch(console.log);
})
app.get('/post/edit/:token/:id', (req:Request, res:Response) => {
    connection.promise().query('SELECT * FROM `users` WHERE `token`=?', [req.params.token]).then(([rows, fields]) => {
        if(!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        connection.promise().query('UPDATE `posts` SET `title`=?, `body`=?, `attachments`=? WHERE `id`', [req.body.title,req.body.body,req.body.attachments]).then(([rows, fields]) => {
            res.send('""');
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})
app.get('/post/edit/:token/:id', (req:Request, res:Response) => {
    connection.promise().query('SELECT * FROM `users` WHERE `token`=?', [req.params.token]).then(([rows, fields]) => {
        if(!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token')){
            res.json({error: "token_invalid"});
        }
        connection.promise().query('DELETE FROM `posts` WHERE `id`=?', [req.params.id]).then(([rows, fields]) => {
            res.send('""');
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})
app.listen(port, () => {
    console.log(`⚡️The application is listening on port ${port}!⚡️`);
})