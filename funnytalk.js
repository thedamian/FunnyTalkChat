const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');
//const helmet = require('helmet');

// Express App
const app = express();
const port = process.env.PORT || 5014;
//app.use(helmet());
app.enable('trust proxy');

//SocketIO 
const http = require('http').Server(app);
const io = require('socket.io')(http);

// JSON Parser - parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine
app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, `/views`)); 

// For debugging;
app.use(morgan('tiny'));


// Main App
app.get("/",(req,res)=> {
    res.render('./index.ejs',{url:req.headers.host});
});

let NumOfChatters = 0;

// Web Socket 
io.on('connection', (socket) => {

    console.log("New Chatter: " + socket.id);
    NumOfChatters++;

    socket.on('disconnect', (reason) => {
      console.log("disconnect reason:",reason);    
      console.log('& socket.id:',socket.id);
      NumOfChatters--;
    });

    socket.on('newchat',(chatInfo) => {
        io.emit("newchat",chatInfo);
    });
});


// Starting App
http.listen(port, () => {
    console.log(`App is listening on: http://localhost:${port}`);
  });