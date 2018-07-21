// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// function to return colors based on magnitude
function getColor(d) {
  return d > 8 ? '#990000' : // great
         d > 7 ? '#d7301f' : // major
         d > 6 ? '#ef6548' : // strong
         d > 5 ? '#fc8d59' : // moderate
         d > 4 ? '#fdbb84' : // light
         d > 3 ? '#fdd49e' : // minor
                 '#fef0d9';
};

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("Place: " + feature.properties.place +
      "<br> Magnitude: " + feature.properties.mag + "<br> Date:" + new Date(feature.properties.time));
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, 
            {
              radius: feature.properties.mag * 5,
              fillColor: "#ff7800",
              color: getColor(feature.properties.mag),
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
          );
      },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWtyeXVrb3YiLCJhIjoiY2ppY2F0NHV0MDNubDNxbWh2eTgzNXQzeiJ9.whXqNaMeiQwhB6ikO4AacQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoieWtyeXVrb3YiLCJhIjoiY2ppY2F0NHV0MDNubDNxbWh2eTgzNXQzeiJ9.whXqNaMeiQwhB6ikO4AacQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [0, -30],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
