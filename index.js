const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
// const consolidate = require('consolidate');
const mongoose = require('mongoose');
const routes = require('./routes/main_routes');
const socketHandler = require('./socket-handler');

const app = express();


// Static files and middleware
app.use(express.static('public'));
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json(
    {limit : '5mb'}
));

app.set('views', 'views');
app.set('view engine', 'ejs');
// app.engine('html', consolidate.handlebars); // Use handlebars to parse templates when we do res.render


//connect to mongodb listen for requests

const uri = "mongodb+srv://user1:bskd6969@cluster0.h60sbhc.mongodb.net/Uber_forex?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then((result)=> {
    console.log('connected to mongodb');
    console.log(result.models);
})
.catch((err)=> console.log(err));


app.use('/', routes);





var server = http.Server(app);
var port = 3000;
server.listen(port, ()=>{
    console.log(`app now listening for requests on port ${port}`)
});

socketHandler.initialize(server);