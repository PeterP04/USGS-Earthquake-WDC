async function previewData() {

    const output = document.getElementById("output");
    output.textContent = "Loading data...";

    const url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

    try {
        const response = await fetch(url);
        const data = await response.json();

        const earthquakes = data.features.map(f => ({
            id: f.id,
            mag: f.properties.mag,
            place: f.properties.place,
            time: new Date(f.properties.time).toLocaleString(),
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
            depth: f.geometry.coordinates[2]
        }));

        output.textContent = JSON.stringify(earthquakes.slice(0, 15), null, 2);

    } catch (err) {
        output.textContent = "Error: " + err;
    }
}


// Button click (for webpage preview)
window.onload = function () {
    document.getElementById("getData").addEventListener("click", function () {
        previewData();
        console.log("Preview mode triggered");
    });
};
