import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const __dirname = path.resolve();
const PORT = 3000;
const app = express();

let vertex = {};
let answerYES = {};
let answerNO = {};

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "animals_job",
    password: "root"
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.post('/server', function (req, res) {
    console.log(req);
    res.send();
});
connection.query("SELECT * FROM vertex", (err, result, fields) => {
    for (let i = 0; i < result.length; i++) {
        vertex[result[i].ID] = result[i].name;
    }
});
connection.query("SELECT * FROM answerYes", (err, result, fields) => {
    for (let i = 0; i < result.length; i++) {
        answerYES[result[i].IDstart] = result[i].IDnext;
    }
});
connection.query("SELECT * FROM answerNo", (err, result, fields) => {
    for (let i = 0; i < result.length; i++) {
        answerNO[result[i].IDstart] = result[i].IDnext;
    }
});
app.use(express.static(__dirname + "/static"));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});
app.get('/getVertex', (req, res) => {
    res.send(vertex);
});
app.get('/getAnswerYES', (req, res) => {
    res.send(answerYES);
});
app.get('/getAnswerNO', (req, res) => {
    res.send(answerNO);
});

app.listen(PORT, () => {
    console.log(`Server start in port ${PORT}...`);
});