import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const __dirname = path.resolve();
const PORT = 3000;
const app = express();

let vertex = [];


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "animals",
    password: "root"
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/serverUPDATE', function (req, res) {
    console.log(req.body);
    if (req.body.boolAnswer) {
        connection.query("UPDATE vertex SET answerYes = ? WHERE ID = ?;", [req.body.update, req.body.ID], (err, result, fields) => {
            if (err) {
                console.log(err);
            }
        });
    } else {
        connection.query("UPDATE vertex SET answerNo = ? WHERE ID = ?;", [req.body.update, req.body.ID], (err, result, fields) => {
            if (err) {
                console.log(err);
            }
        });
    }
    res.send();
});
app.post('/serverINSERT', function (req, res) {
    console.log(req.body);
    connection.query("INSERT INTO vertex(ID, name, answerYes, answerNo) VALUES (?,?,?,?);", [req.body.ID, req.body.name, req.body.answerYes, req.body.answerNo], (err, result, fields) => {
        if (err) {
            console.log(err);
        }
    });
    res.send();
});
app.post('/serverTRUNCATE', function (req, res) {
    console.log(req.body);
    connection.query("TRUNCATE TABLE vertex;", (err, result, fields) => {
        if (err) {
            console.log(err);
        }
    });
    res.send();
});

app.use(express.static(__dirname + "/static"));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});
app.get('/getVertex', (req, res) => {
    connection.query("SELECT * FROM vertex", (err, result, fields) => {
        if(err) {
            console.log(err);
        }
        for (let i = 0; i < result.length; i++) {
            vertex[result[i].ID] = {
                name : result[i].name,
                answerYes: result[i].answerYes, 
                answerNo : result[i].answerNo
            };
        }
        //console.log(vertex);
        res.send(vertex);
    });
});

app.listen(PORT, () => {
    console.log(`Server start in port ${PORT}...`);
});