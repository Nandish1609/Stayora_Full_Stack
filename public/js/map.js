const lat = listing.geometry.coordinates[1];
const lng = listing.geometry.coordinates[0];
const map = L.map("map").setView([lat, lng], 15); //[0, 0]
const customIcon = L.icon({
    iconUrl: "../3dicons-map-pin-iso-color.png",
    iconSize: [40, 40],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const circle = L.circle([lat, lng], {
    color: "#0077ed",
    fillColor: "#ACE6DD",
    fillOpacity: 0.75,
    radius: 500,
}).addTo(map);

const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
const popup = L.popup()
    .setLatLng([lat, lng])
    .setContent(
        `<b>${listing.location}, ${listing.country}</b><br><p>Exact location provided after booking.</p>`,
    )
    .openOn(map);
