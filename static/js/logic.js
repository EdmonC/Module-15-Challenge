// Create a map object.
var map = L.map("map").setView([0, 0], 2); // Set initial view and zoom level.

// Add a tile layer (background map).
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a function to calculate marker size based on earthquake magnitude.
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust this factor for marker size.
}

// Define a function to calculate marker color based on earthquake depth.
function getMarkerColor(depth) {
    if (depth < 10) {
        return "green"; // Shallow earthquakes
    } else if (depth < 30) {
        return "yellow"; // Intermediate-depth earthquakes
    } else {
        return "red"; // Deep earthquakes
    }
}

// Fetch earthquake data from the USGS GeoJSON feed.
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
        // Loop through earthquake data and create markers.
        data.features.forEach(feature => {
            var coordinates = feature.geometry.coordinates;
            var properties = feature.properties;
            var magnitude = properties.mag;
            var depth = coordinates[2]; // Depth is the third coordinate.

            // Create a marker with size and color based on magnitude and depth.
            var marker = L.circleMarker([coordinates[1], coordinates[0]], {
                radius: getMarkerSize(magnitude),
                fillColor: getMarkerColor(depth),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Add a popup with earthquake information.
            marker.bindPopup(
                `<strong>Magnitude:</strong> ${magnitude}<br>` +
                `<strong>Depth:</strong> ${depth} km<br>` +
                `<strong>Location:</strong> ${properties.place}`
            );
        });
    });

// Create a legend for earthquake depth.
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [0, 10, 30]; // Define depth categories.
    var labels = [];

    // Loop through depth categories and generate labels.
    for (var i = 0; i < depths.length; i++) {
        var from = depths[i];
        var to = depths[i + 1];

        labels.push(
            `<i style="background:${getMarkerColor(from + 1)}"></i> ` +
            `${from} - ${to} km`
        );
    }

    div.innerHTML = labels.join("<br>");
    return div;
};

legend.addTo(map);