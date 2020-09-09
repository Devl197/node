import express from 'express';
import bodyParser from 'body-parser'
import { Socket } from 'dgram';


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const messages = [
    {name: 'Alex', message: 'Hi there'},
    {name: 'Sandra', message: 'Hello'}
];


app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/messages', (req, res) => {
    messages.push(req.body);
    io.emit('message', req.body);
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    console.log('user connected');
});

const server = http.listen(3000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});