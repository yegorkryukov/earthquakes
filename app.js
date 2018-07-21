// store geojson API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create map
var map = L.map("map").setView([0, -30],2);

// add tile layer with map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWtyeXVrb3YiLCJhIjoiY2ppY2F0NHV0MDNubDNxbWh2eTgzNXQzeiJ9.whXqNaMeiQwhB6ikO4AacQ").addTo(map);

// control showing additional info on mouseover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
};

// method to update the control based on feature properties passed
info.update = function (feature) {
    this._div.innerHTML = "<h4>Earhquakes in last 7 days</h4>" +
    (feature ?
      "Place: " + feature.place
      + "<br> Magnitude: " + feature.mag 
      + "<br> Date: " + new Date(feature.time)
      : "Hover over circles");
};

info.addTo(map);

// function to return colors based on magnitude
function getColor(d) {
  return d > 8 ? '#99000d' : // great
         d > 7 ? '#cb181d' : // major
         d > 6 ? '#ef3b2c' : // strong
         d > 5 ? '#fb6a4a' : // moderate
         d > 4 ? '#fc9272' : // light
         d > 3 ? '#fcbba1' : // minor
                 '#fee5d9';
};

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

var earthquakes;

// create event listener to highlight markers on mouseover
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 3,
      color: '#fee5d9',
      dashArray: '',
      fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  };
  info.update(layer.feature.properties);
}

// define function on mouseout
function resetHighlight(e) {
  earthquakes.resetStyle(e.target);
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, 
            {
              radius: feature.properties.mag * 3,
              color: "#ff7800",
              fillColor: getColor(feature.properties.mag),
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
          );
      },
    onEachFeature: onEachFeature
  }).addTo(map);
}

// add legend
var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 3, 4, 5, 6, 7, 8],
			labels = [],
			from, to;
		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];
			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}
		div.innerHTML = labels.join('<br>');
		return div;
	};

  legend.addTo(map);
  
  map.attributionControl.addAttribution('Earthquake data: <a href="https://earthquake.usgs.gov">United States Geological Survey</a>');

  map.attributionControl.addAttribution('Created by <a href="https://mindthatdata.com">Yegor Kryukov</a>');

