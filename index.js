import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const __dirname = path.resolve();
const PORT = 3000;
const app = express();

let animals = [];

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "animals",
    password: "root"
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/server', function(req, res){  
    //now req.body will be populated with the object you sent
    //console.log(req.body.name); //prints john
    res.send();
    });
// connection.connect((err) => {
//     if (err) return console.error(err.message);
//     else return console.log("Подключение к серверу MySQL успешно установлено");
// });
connection.query("SELECT * FROM animal", (err, result, fields) => {
    //console.log(result);
    for(let i =0; i< result.length; i ++){
        animals.push(result[i]);
    } 
    //console.log(animals);
    // console.log(fields);
});

app.use(express.static(__dirname + "/static"));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
    //console.log(req);
});
app.get('/getAnimals', (req, res) => {
    res.send(animals);
});

app.listen(PORT, () => {
    console.log(`Server start in port ${PORT}...`);
});