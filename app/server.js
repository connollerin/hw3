import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
// at top
import socketio from 'socket.io';
import http from 'http';
import Note from './models/note_model';

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/notes';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);

// add server and io initialization after app
const server = http.createServer(app);
const io = socketio(server);


// change app.listen to server.listen
server.listen(port);

// pushes notes to everybody
const pushNotes = () => {
  Note.getNotes().then(result => {
    // broadcasts to all sockets including ourselves
    io.sockets.emit('notes', result);
  });
};

io.on('connection', (socket) => {
  // on first connection emit notes
  Note.getNotes().then(result => {
    socket.emit('notes', result);
  });

  // creates notes and
  socket.on('createNote', (fields) => {
    Note.createNote(fields).then((result) => {
      pushNotes();
    }).catch(error => {
      console.log(error);
      socket.emit('error', 'create failed');
    });
  });
});
