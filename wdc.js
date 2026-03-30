var myConnector = tableau.makeConnector();

// Define schema
myConnector.getSchema = function (schemaCallback) {

    var cols = [
        { id: "id", dataType: tableau.dataTypeEnum.string },
        { id: "mag", dataType: tableau.dataTypeEnum.float },
        { id: "place", dataType: tableau.dataTypeEnum.string },
        { id: "time", dataType: tableau.dataTypeEnum.datetime },
        { id: "longitude", dataType: tableau.dataTypeEnum.float },
        { id: "latitude", dataType: tableau.dataTypeEnum.float },
        { id: "depth", dataType: tableau.dataTypeEnum.float }
    ];

    var tableSchema = {
        id: "earthquakes",
        columns: cols
    };

    schemaCallback([tableSchema]);
};

// Get data
myConnector.getData = function (table, doneCallback) {

    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

    fetch(url)
        .then(response => response.json())
        .then(data => {

            var tableData = [];

            data.features.forEach(feature => {
                tableData.push({
                    id: feature.id,
                    mag: feature.properties.mag,
                    place: feature.properties.place,
                    time: new Date(feature.properties.time),
                    longitude: feature.geometry.coordinates[0],
                    latitude: feature.geometry.coordinates[1],
                    depth: feature.geometry.coordinates[2]
                });
            });

            table.appendRows(tableData);
            doneCallback();
        });
};

tableau.registerConnector(myConnector);

// Button click
document.getElementById("getData").addEventListener("click", function () {
    tableau.connectionName = "USGS Earthquake Feed";
    tableau.submitConnector();
});