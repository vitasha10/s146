import { Request, Response } from 'express';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2';
import * as cors from 'cors';

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

app.use(cors({
    origin: '*'
}));

app.get('/', (req: Request, res: Response) => {
    res.send("Hello world!");
})

export interface IPost{
    id: number,
    title: string,
    date: string,
    body: string,
    attachments: string,
    titlePicture : string
}

app.get('/static_post/get/:urlRoute', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `static_post` WHERE `urlRoute`=?", [req.params.urlRoute]).then(([rows]) => {
        let log = JSON.parse(JSON.stringify(rows))[0];
        if (typeof log == "undefined") 
            res.json({error: "urlRoute_invalid"});
        res.json(log)
    }).catch(console.log);
});

app.post('/static_post/add/:token/', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
        
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"});
        
        let now : string = new Date().toLocaleString();
        connection.promise().query("INSERT INTO `static_post` (`urlRoute`,`title`,`date`,`body`,`attachments`) VALUES (?,?,?,?,?)", [req.body.urlRoute, req.body.title, now, req.body.body, req.body.attachments]).then(([rows]) => {
            res.status(201).end();
        }).catch(console.log);
    }).catch(console.log);
});

app.post('/static_post/edit/:token/:urlRoute', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
        
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"});
        
            connection.promise().query("UPDATE `static_post` SET `urlRoute`=?, `title`=?, `body`=?, `attachments`=? WHERE `urlRoute`=?", [req.body.urlRoute, req.body.title, req.body.body, req.body.attachments, req.params.urlRoute]).then(([rows]) => {
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})

app.post('/static_post/del/:token/:urlRoute', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
       
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"});
        connection.promise().query("DELETE FROM `static_post` WHERE `urlRoute`=?", [req.params.urlRoute]).then(([rows]) => {
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})


app.get('/posts/get/:from', (req: Request, res: Response) => {
    
    if (!Number.isInteger(Number(req.params.from))) 
        res.json({error: "from_invalid"});
    
    if (Number(req.params.from) < 0) 
        res.json({error: "from_invalid"});
    
    connection.promise().query("SELECT * FROM `posts` ORDER BY `id` LIMIT ?,?", [Number(req.params.from),Number(req.params.from+20)]).then(([rows]) => {
        res.json(rows)
    }).catch(console.log);
})

app.get('/post/get/:id', (req: Request, res: Response) => {
    
    if (!Number.isInteger(Number(req.params.id))) 
        res.json({error: "id_invalid"});

    if (Number(req.params.id) <= 0) 
        res.json({error: "id_invalid"});
        connection.promise().query("SELECT * FROM `posts` WHERE `id`=?", [Number(req.params.id)]).then(([rows]) => {
            let log = JSON.parse(JSON.stringify(rows))[0];
            if (typeof log == "undefined") 
                res.json({error: "id_invalid"});
            res.json(log)
    }).catch(console.log);
});

app.post('/post/add/:token/', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
        
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"}); 
        
        let now : string = new Date().toLocaleString();
        connection.promise().query("INSERT INTO `posts` (`title`,`date`,`body`,`attachments`,`titlePicture`) VALUES (?,?,?,?,?)", [req.body.title, now, req.body.body, req.body.attachments, req.body.titlePicture]).then(([rows]) => {
            res.status(201).end();
        }).catch(console.log);
    }).catch(console.log);
})

app.post('/post/edit/:token/:id', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
        
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"});

        if (!Number.isInteger(Number(req.params.id))) 
            res.json({error: "id_invalid"});
        if (Number(req.params.id) <= 0) 
            res.json({error: "id_invalid"});
        
        connection.promise().query("UPDATE `posts` SET `title`=?, `body`=?, `attachments`=?, `titlePicture`=? WHERE `id`=?", [req.body.title, req.body.body, req.body.attachments, Number(req.params.id), req.body.titlePicture]).then(([rows]) => {
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})

app.post('/post/del/:token/:id', (req: Request, res: Response) => {
    connection.promise().query("SELECT * FROM `users` WHERE `token`=?", [req.params.token]).then(([rows]) => {
       
        if (!JSON.parse(JSON.stringify(rows))[0].hasOwnProperty('token'))
            res.json({error: "token_invalid"});
    
        if (!Number.isInteger(Number(req.params.id))) 
            res.json({error: "id_invalid"});

        if (Number(req.params.id) <= 0) 
            res.json({error: "id_invalid"});

        connection.promise().query("DELETE FROM `posts` WHERE `id`=?", [Number(req.params.id)]).then(([rows]) => {
            res.send('""');
            res.status(202).end();
        }).catch(console.log);
    }).catch(console.log);
})


app.listen(port, () => {
    console.log(`⚡️The application is listening on port ${port}!⚡️`);
})