// Mapbox API
var mapbox = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWtyeXVrb3YiLCJhIjoiY2ppY2F0NHV0MDNubDNxbWh2eTgzNXQzeiJ9.whXqNaMeiQwhB6ikO4AacQ";

// Creating map object
var map = L.map("map", {
  center: [0, -30],
  zoom: 2
});

// Adding tile layer to the map
L.tileLayer(mapbox).addTo(map);

// setting up json source
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// // Grabbing the data with d3..
d3.json(url, function (response) {
  // console.log(response);

  // Loop through our data...
  for (var i = 0; i < response['features'].length; i++) {
    var feature = response.features[i];
    L.geoJSON(feature).addTo(map);

    // set the data location property to a variable
    // var feature = response.features[i],
    //     location = feature.geometry;
    //   console.log(location);

    // // If the data has a location property...
    // if (location) {
    //   L.marker(location[1],location[0])
    //     .bindPopup("<h1>" + city.name + "</h1> <hr> <h3>Population " + city.population + "</h3>")
    //     .addTo(map);
    // }
  }
});
