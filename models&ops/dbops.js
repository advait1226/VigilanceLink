//db related 
const Cop = require('./cops');
const Request = require('./req');

function findCopsNearMe(coordinates, maxDistance){

   return Cop.find( { location :
        { $near :
          { $geometry :
             { type : "Point" ,
               coordinates : coordinates } ,
            $maxDistance : maxDistance
           }}} )
           .exec()
           .catch(error => {
            console.log(error);
            });
}


function fetchCopDetails(userId)
{
   return Cop.findOne(
      {userId : userId},
      {
         copId: 1,
        displayName: 1,
        phone: 1,
        location: 1
      })
      .exec()
      .catch(error => {
         console.log(error);
      });
}

function saveRequest(requestId, requestTime, location, civilianId, status){
const request = new Request({
   "_id" : requestId,
   requestTime : requestTime,
   location : location,
   civilianId : civilianId,
   status : status

});

return request.save()
.catch(err =>{
   console.log(err);
});

}

function acceptRequest(requestId, copId, status)
{
return Request.findOneAndUpdate(
  { "_id" : requestId},
  {
   status: status,
   copId : copId,
  }).catch(err => {
   console.log(err);
  });
  
}


function fetchRequests() {
   return new Promise( (resolve, reject) => {
       try {
           const requestsData = [];

           const stream = Request.find({}, {
               requestTime: 1,
               status: 1,
               location: 1,
               _id: 0
           }).stream();

           stream.on("data", function (request) {
               requestsData.push(request);
           });

           stream.on("end", function () {
               resolve(requestsData);
           });

       } catch (err) {
           console.log(err);
           reject(err);
       }
   });
}





exports.findCopsNearMe = findCopsNearMe;
exports.fetchCopDetails = fetchCopDetails;
exports.saveRequest = saveRequest;
exports.acceptRequest = acceptRequest;
exports.fetchRequests = fetchRequests;
