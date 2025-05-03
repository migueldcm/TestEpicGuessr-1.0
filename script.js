let data = [];
let currentPhoto = null;
let guessMarker;
let map;

// Load photo + coordinates
fetch("data.json")
  .then((res) => res.json())
  .then((photos) => {
    data = photos;
    startNewRound();
  });

function startNewRound() {
  const randomIndex = Math.floor(Math.random() * data.length);
  currentPhoto = data[randomIndex];

  document.getElementById("photo").src = `photos/${currentPhoto.file}`;
  document.getElementById("results").textContent = "";

  initMap();
}

function initMap() {
  if (map) {
    map.remove(); // reset for new round
  }

  map = L.map("map").setView([20, 0], 2); // world view

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.on("click", function (e) {
    if (guessMarker) {
      map.removeLayer(guessMarker);
    }

    guessMarker = L.marker(e.latlng).addTo(map);
  });

  document.getElementById("guess-btn").onclick = () => {
    if (!guessMarker) {
      alert("Click on the map to make a guess!");
      return;
    }

    const guessedLatLng = guessMarker.getLatLng();
    const actualLatLng = { lat: currentPhoto.lat, lng: currentPhoto.lng };

    const distance = getDistanceInKm(
      guessedLatLng.lat,
      guessedLatLng.lng,
      actualLatLng.lat,
      actualLatLng.lng
    );

    document.getElementById("results").innerHTML = `
      📍 Your guess: ${guessedLatLng.lat.toFixed(4)}, ${guessedLatLng.lng.toFixed(4)}<br>
      🗺️ Actual: ${actualLatLng.lat.toFixed(4)}, ${actualLatLng.lng.toFixed(4)}<br>
      📏 Distance: ${distance.toFixed(2)} km
    `;
  };
}

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
