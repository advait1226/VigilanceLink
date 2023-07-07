
    const socket = io();

    // Fetch userId from the data-atribute of the body tag
    // const userId = document.body.getAttribute("data-userId");

    // Fire a 'join' event and send your userId to the server, to join a room - room-name will be the userId itself!
    socket.emit("join", {userId: userId});

    // Declare variables, this will be used later
    let requestDetails = {};
    let copDetails = {};
    let map, marker;

    requestDetails = {
        civilianId: userId,
        location: {
            address: "Indiranagar, Bengaluru, Karnataka 560038, India",
            latitude: 12.9718915,
            longitude: 77.64115449999997
        }
    }

    function requestForHelp() { // When button is clicked, emit an event
        socket.emit("request-for-help", requestDetails);
    }

    // Listen for a 'request-accepted' event
    socket.on("request-accepted", (eventData) => {
        copDetails = eventData; // Save cop details
    //extract cop info

    document.getElementById("notification").innerHTML =
    `${copDetails.displayName} is near ${copDetails.location.address} and will be arriving at your location shortly.
    You can reach them at their mobile ${copDetails.phone}`;
    
        // Show cop location on the map
        L.marker([
            copDetails.location.latitude,
            copDetails.location.longitude
        ],{
            icon: L.icon({
                iconUrl: "/images/cop.png", // image path
                iconSize: [60, 28] // in pixels
            })
        }).addTo(map);


    });
    

