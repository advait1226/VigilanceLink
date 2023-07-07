L.mapbox.accessToken = "pk.eyJ1IjoiYWR2YWl0YWEiLCJhIjoiY2xqaWZ1czk2MDc2dTNrbzN5NjFmYnR6ZyJ9.Ue0YUW7CXhuJFhWZ_ZYBOg";

map = L.mapbox.map("map", "mapbox.streets"); // Load the map and give it a default style
map.setView([12.9718915, 77.64115449999997], 9); // set it to a given lat-lng and zoom level
marker = L.marker([12.9718915, 77.64115449999997]).addTo(map); // Display a default marker

// This will display an input box on the map
map.addControl(L.mapbox.geocoderControl("mapbox.places", {
    autocomplete: true, // will suggest for places as you type
}).on("select", (data) => { // This function runs when a place is selected
    console.log(data); // data contains the geocoding results

    // Extract address and coordinates from the results and save it
    requestDetails.location = {
        address: data.feature["place_name"],
        latitude: data.feature.center[1],
        longitude: data.feature.center[0]
    };

    marker.setLatLng([data.feature.center[1], data.feature.center[0]]); // Set the marker to new location
}));
 