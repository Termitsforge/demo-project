import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const __dirname = path.resolve();
const PORT = 3000;
const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/static"));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});
app.post('/serverSEND', (req, res) =>{
    let data = JSON.stringify(req.body);
    //fs.writeFileSync('vertices.json', );
    fs.writeFileSync('vertices.json', data);
    console.log(data);
    res.send();
});
app.post('/serverDEL', (req, res) =>{
    fs.writeFileSync('vertices.json', '{}');
    res.send();
});
app.post('/serverGET', (req, res) =>{
    fs.readFile('vertices.json', {encoding: 'utf8'}, function(err,data) {
        res.send(data);
    });
});

  
app.listen(PORT, () => {
    console.log(`Server start in port ${PORT}...`);
});