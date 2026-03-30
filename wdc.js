var myConnector = tableau.makeConnector();

myConnector.getSchema = function(schemaCallback) {
    schemaCallback([{
        id: "earthquakes",
        columns: [
            { id: "id", dataType: tableau.dataTypeEnum.string },
            { id: "mag", dataType: tableau.dataTypeEnum.float },
            { id: "place", dataType: tableau.dataTypeEnum.string },
            { id: "time", dataType: tableau.dataTypeEnum.datetime },
            { id: "longitude", dataType: tableau.dataTypeEnum.float },
            { id: "latitude", dataType: tableau.dataTypeEnum.float },
            { id: "depth", dataType: tableau.dataTypeEnum.float }
        ]
    }]);
};

myConnector.getData = function(table, doneCallback) {

    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
        .then(res => res.json())
        .then(data => {

            let tableData = data.features.map(f => ({
                id: f.id,
                mag: f.properties.mag,
                place: f.properties.place,
                time: new Date(f.properties.time),
                longitude: f.geometry.coordinates[0],
                latitude: f.geometry.coordinates[1],
                depth: f.geometry.coordinates[2]
            }));

            table.appendRows(tableData);
            doneCallback();
        });
};

tableau.registerConnector(myConnector);

// 🔥 REQUIRED
document.getElementById("getData").addEventListener("click", function () {
    tableau.connectionName = "USGS Earthquakes";
    tableau.submitConnector();
});
