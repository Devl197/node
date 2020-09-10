import express from 'express';
import bodyParser from 'body-parser'
import moongose from 'mongoose';


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
moongose.Promise = Promise;
const dbURL = 'mongodb://127.0.0.1/learning-node';

const Message = moongose.model('Message', {
    name: String,
    message: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', async (req, res) => {

    try {
        const message = new Message(req.body);

        const savedMessage = await message.save();

        console.log('saved');

        const censored =  await Message.findOne({message: 'badword'});
    
        if(censored){
            await Message.remove({_id: censored.id});
        } else {
            io.emit('message', req.body);  
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    }    
});



io.on('connection', (socket) => {
    console.log('user connected');
});


moongose.connect(dbURL, { useNewUrlParser: true }, err => {
    console.log('mongo db connection', err);
});
const server = http.listen(3000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});