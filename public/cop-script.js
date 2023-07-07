
    const socket = io();

    // Fetch userId from the data-atribute of the body tag
    // const userId = document.body.getAttribute("data-userId");

    // Fire a 'join' event and send your userId to the server, to join a room - room-name will be the userId itself!
    socket.emit("join", {userId: userId});

    let requestDetails = {};
    let copDetails = {};
    let map, marker;



    //Sending a get request via axios to fetch cop info/profile
axios.get(`/cops/info?userId=${userId}`)
.then( (response) => {
    copDetails = response.data.copDetails;
    copDetails.location = {
        address: copDetails.location.address,
        longitude: copDetails.location.coordinates[0],
        latitude: copDetails.location.coordinates[1]
    };
    document.getElementById("copDetails").innerHTML =
        `Display Name: ${copDetails.displayName}
        Address: ${copDetails.location.address}
        `;

        L.mapbox.accessToken = "pk.eyJ1IjoiYWR2YWl0YWEiLCJhIjoiY2xqaWZ1czk2MDc2dTNrbzN5NjFmYnR6ZyJ9.Ue0YUW7CXhuJFhWZ_ZYBOg";

        // Load the map and give it a default style
        map = L.mapbox.map("map", "mapbox.streets");
        
        // set it to a cop's lat-lng and zoom level
        map.setView( [copDetails.location.latitude, copDetails.location.longitude ], 9);
        
        // Display a default marker
        marker = L.marker([copDetails.location.latitude, copDetails.location.longitude]).addTo(map);
        
        // This will display an input box
        map.addControl(L.mapbox.geocoderControl("mapbox.places", {
            autocomplete: true, // will suggest for places as you type
        }).on("select", (data) => {
            console.log(data); // data contains the geocoding results
        
            marker.setLatLng([data.feature.center[1], data.feature.center[0]]); // Set the marker to new location
        }));
        



    })
.catch((error) => {
    console.log(error);
});

// Listen for a "request-for-help" event
socket.on("request-for-help", (eventData) => { 
requestDetails = eventData; // Contains info of civilian

// display civilian info
document.getElementById("notification").innerHTML =
`Civilian ${requestDetails.civilianId} is in distress  and needs help!
They're at ${requestDetails.location.address}`;

// Show civilian location on the map
L.marker([
    requestDetails.location.latitude,
    requestDetails.location.longitude
],{
    icon: L.icon({
        iconUrl: "/images/civilian.png",
        iconSize: [50,50]
    })
}).addTo(map);



});

function helpCivilian() {
    //Fire a "request-accepted" event/signal and send relevant info back to server
    socket.emit("request-accepted", {
        requestDetails: requestDetails,
        copDetails: copDetails
    });
}

