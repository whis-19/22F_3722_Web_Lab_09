document.addEventListener("DOMContentLoaded", function () {
    let map = L.map("map").setView([31.5204, 74.3587], 10); // Default: Lahore
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker;
    let lat, lng;

    map.on("click", function (e) {
        if (marker) map.removeLayer(marker);
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        marker = L.marker([lat, lng]).addTo(map);
    });

    document.getElementById("event-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const eventData = {
            eventName: document.getElementById("eventName").value,
            organizerName: document.getElementById("organizerName").value,
            date: document.getElementById("date").value,
            latitude: lat,
            longitude: lng,
        };

        fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Event registered successfully! Event ID: " + data.eventId);
                document.getElementById("event-form").reset();
                if (marker) map.removeLayer(marker);
            })
            .catch((error) => console.error("Error:", error));
    });
});
