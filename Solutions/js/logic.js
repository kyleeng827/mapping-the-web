// Create a map object
var myMap = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 5
});

// Create a basic tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {  
  //Creating circles
  createFeatures(data.features)
});

// Marker size so that circles are visible
function size(magnitude) {
    return magnitude * 10000;
}

// color based on magnitude
function color(magnitude){
  if (magnitude > -1 && magnitude < 1){
    circle = "#CB9EFF"; // Different variations of purple
  }
  else if (magnitude >= 1 && magnitude < 2){
    circle = "#B576FF"; 
  }
  else if (magnitude >= 2 && magnitude < 3){
    circle = "#A456FF"; 
  }
  else if (magnitude >= 3 && magnitude < 4){
    circle = "#9133FF"; 
  }
  else if (magnitude >= 4 && magnitude < 5){
    circle = "#7600FF"; 
  }
  else {
    circle = "#4B00A3"; 
  }
  return circle;
}

// popup properties for each feature
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.title).addTo(myMap);  
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  L.geoJSON(earthquakeData, {
    // Return circles
    pointToLayer: function(feature, latlng) {
      return L.circle(latlng, {
        fillOpacity: 1,
        // circle gets color and size proprotional to magnitude of earthquake
        color: color(feature.properties.mag),
        radius: size(feature.properties.mag)
        });
    },
    // Run the onEachFeature function once for each piece of data in the array
    onEachFeature: onEachFeature
  }).addTo(myMap);
}

// Create legend, displayed on bottom right
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magnitude = [0,1,2,3,4,5];
    var colors = ["#CB9EFF","#B576FF","#A456FF","#9133FF","#7600FF","#4B00A3"];
    var labels = [];
    var mag = ['0-1','1-2','2-3','3-4','4-5', '5'];

    // COuld not figure out legend
    var legendInfo = "Magnitude";

    div.innerHTML = legendInfo;

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Add legend to map
  legend.addTo(myMap);