var myConnector = tableau.makeConnector();

// SCHEMA
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

    schemaCallback([{
        id: "earthquakes",
        columns: cols
    }]);
};


// FETCH DATA
myConnector.getData = function (table, doneCallback) {

    var url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

    fetch(url)
        .then(response => response.json())
        .then(data => {

            var tableData = [];

            data.features.forEach(feature => {

                if (!feature || !feature.geometry || !feature.properties) return;

                var coords = feature.geometry.coordinates || [];

                tableData.push({
                    id: feature.id,
                    mag: feature.properties.mag,
                    place: feature.properties.place,
                    time: new Date(feature.properties.time),
                    longitude: coords[0],
                    latitude: coords[1],
                    depth: coords[2]
                });
            });

            table.appendRows(tableData);
            doneCallback();
        })
        .catch(err => console.error("WDC error:", err));
};

tableau.registerConnector(myConnector);


// BUTTON CLICK
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("getData").addEventListener("click", function () {

        tableau.connectionName = "USGS Earthquakes";

        // ✅ CORRECT METHOD (NOT submitConnector)
        tableau.submit();

    });

});
