const dbOps = require('./models&ops/dbops');
const mongoose = require('mongoose');
const socket = require('socket.io');
function initialize(server) {
	// Creating a new socket.io instance by passing the HTTP server object
    const io = socket(server);

    io.on('connection', (socket) => { // Listen on the 'connection' event for incoming sockets
        console.log('A user just connected');

        socket.on('join', (data) => { // Listen to any join event from connected users
            socket.join(data.userId); // User joins a unique room/channel that's named after the userId
            console.log(`User joined room: ${data.userId}`);
        });

        socket.on('request-for-help' , async (data)=>{

            //save request in db
            const requestTime = new Date();
            const requestId = mongoose.Types.ObjectId();
            const civilianId = data.civilianId;
            const location = {
                coordinates : [data.location.longitude, data.location.latitude],
                address : data.location.address
            };
            data.requestId = requestId;
            data.requestTime = requestTime;
           await dbOps.saveRequest(requestId, requestTime, location, civilianId, 'waiting');
            
            // fetch nearby cops in the area 

            const obj = await dbOps.findCopsNearMe(location.coordinates, 2000);
    
            //send a ping to nearby cops

            obj.forEach((cop) => {
                io.sockets.in(cop.userId).emit('request-for-help', data);
            });
        });

        socket.on('request-accepted', async (data) => { //Listen to a 'request-accepted' event from connected cops
            console.log('data contains', data);
            //Convert string to MongoDb's ObjectId data-type
            const requestId = mongoose.Types.ObjectId(data.requestDetails.requestId);
        
            //Then update the request in the database with the cop details for given requestId
            await dbOps.acceptRequest(requestId, data.copDetails.copId, 'engaged');
        
            //After updating the request, emit a 'request-accepted' event to the civilian and send cop details
            io.sockets.in(data.requestDetails.civilianId).emit('request-accepted', data.copDetails);
        });
        


    });
}

exports.initialize = initialize;

  

//     //handle video events

//     socket.on('join-room', (roomId, userId)=>{
//         console.log(roomId, userId);

//         socket.join(roomId);
//         socket.broadcast.to(roomId).emit('user-connected', userId);

//         // Handle chat event*************************

//     socket.on('chat', function(data){
//         io.sockets.emit('chat', data);
//     });

//     socket.on('typing', (data)=>{
//         socket.broadcast.emit('typing', data)
//     });
   
//     //whiteboard handler****************************

//     socket.on('draw' , (data) =>{
//                 console.log("draw");
//                 socket.broadcast.emit('ondraw', {x : data.x, y: data.y});
          
    
//     });
    
    
//     socket.on('down', (data)=>{
//         console.log("down");

//     socket.broadcast.emit('ondown', {x : data.x, y: data.y});
        
//     } );
        



//    socket.on('disconnect', ()=>{
//     socket.broadcast.to(roomId).emit('user-disconnected', userId);
//    });
   
//     });










