// Load Favorite Routes
function loadFavorites() {
  const favorites = document.getElementById("favoritesList");
  favorites.innerHTML = "";

  const routes = JSON.parse(localStorage.getItem("routes") || "[]");
  routes.forEach(route => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = route;

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-secondary";
    btn.textContent = "Use";
    btn.onclick = () => {
      const [start, end] = route.split(" → ");
      document.getElementById("start").value = start;
      document.getElementById("end").value = end;
      checkTraffic();
    };

    li.appendChild(btn);
    favorites.appendChild(li);
  });
}

let map;

function initMap() {
  const defaultLocation = { lat: 18.5204, lng: 73.8567 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
}

// 🚦 Combined Function
function checkTraffic() {
  const startLocation = document.getElementById("start").value;
  const endLocation = document.getElementById("end").value;

  if (!startLocation || !endLocation) {
    showAlert("Please enter both start and destination locations.", "warning");

    return;
  }

  // Convert start address
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${startLocation}&key=AIzaSyCxwiQ1jpSsJnd7B7mLvqScnoZYfbKkq-k`)
    .then(response => response.json())
    .then(startData => {
      const startCoords = startData.results[0].geometry.location;

      // Convert end address
      return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${endLocation}&key=AIzaSyCxwiQ1jpSsJnd7B7mLvqScnoZYfbKkq-k`)
        .then(response => response.json())
        .then(endData => {
          const endCoords = endData.results[0].geometry.location;

          

          // Show route on map
          showRouteOnMap(startCoords, endCoords);
        });
    })
    .catch(error => console.error("Error getting location data:", error));
}

function showRouteOnMap(startCoords, endCoords) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const request = {
    origin: startCoords,
    destination: endCoords,
    travelMode: "DRIVING",
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      alert("Could not find route: " + status);
    }
  });
}
