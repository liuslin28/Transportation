/*
    进行坐标转换（WGS84 => GCJ02）,可以适配geojson中的特征集合(点、多点、线、多线、面、多面)

    引入
    <script src="./wgsToGcj.js"></script>

    使用
    需要引用  wgs2mars.min.js
    let result  = wgsToGcj(input);

    API
    wgsToGcj(input)

    参数
    input: GeoJSON(特征集合)
    ________________________________________________________________
    {
        "type": "FeatureCollection",
        "features":
        [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                "properties": {"prop0": "value0"}
            },

            {
                "type": "Feature",
                "geometry": {"type": "MultiPoint", "coordinates": [ [100.0, 0.0], [101.0, 1.0] ],
                "properties": {"prop0": "value0"}
            },
            {
                "type": "Feature",
                "geometry": {
                     "type": "LineString",
                     "coordinates": [
                            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                     ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            },
            {
                "type": "Feature",
                "geometry": {
                     "type": "MultiLineString",
                     "coordinates":  [
                            [ [100.0, 0.0], [101.0, 1.0] ],
                            [ [102.0, 2.0], [103.0, 3.0] ]
                     ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            },
            {
                "type": "Feature",
                "geometry": {
                     "type": "Polygon",
                     "coordinates": [
                       [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0] ]
                       ]
                 },
                "properties": {
                     "prop0": "value0",
                     "prop1": {"this": "that"}
                 }
            },
            {
                "type": "Feature",
                "geometry": {
                     "type": "MultiPolygon",
                     "coordinates":  [
                            [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                            [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                            [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                       ]
                 },
                "properties": {
                     "prop0": "value0",
                     "prop1": {"this": "that"}
                 }
            }
        ]
   }
    ________________________________________________________________

    返回值
    GeoJSON
*/

function wgsToGcj(wgsData) {
    let wgsFeatrueData =  JSON.parse(JSON.stringify(wgsData.features));
    let gcjFeatureData = [];
    wgsFeatrueData.forEach(function (value) {
        let geoType = value.geometry.type;
        let geoData = value.geometry.coordinates;

        let gcjData;
        switch (geoType) {
            case "Point":
                gcjData = pointWgsGcj(geoData);
                break;
            case "MultiPoint":
                gcjData = multipointWgsGcj(geoData);
                break;
            case "LineString":
                gcjData = lineWgsGcj(geoData);
                break;
            case "MultiLineString":
                gcjData = multilineWgsGcj(geoData);
                break;
            case "Polygon":
                gcjData = polyWgsGcj(geoData);
                break;
            case "MultiPolygon":
                gcjData = multipolyWgsGcj(geoData);
                break;
            default:
                console.log("error");
                break;
        }
        value.geometry.coordinates = gcjData;
        gcjFeatureData.push(value);
    });

    let gcjData = {
        "type": "FeatureCollection",
        "features": []
    };
    gcjData.features = gcjFeatureData;
    return gcjData;
}

function pointWgsGcj(geoData) {
    let newData;
    const lngWGS = Number(geoData[0]);  //经度
    const latWGS = Number(geoData[1]);  //纬度
    let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
    newData = [gcjCoordinate.lng, gcjCoordinate.lat];
    return newData;
}

function multipointWgsGcj(geoData) {
    let newData = [];
    geoData.forEach(function (value) {
        const lngWGS = Number(value[0]);  //经度
        const latWGS = Number(value[1]);  //纬度
        let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        newData.push([gcjCoordinate.lng, gcjCoordinate.lat]);
    });
    return newData;
}

function lineWgsGcj(geoData) {
    let newData = [];
    geoData.forEach(function (value) {
        const lngWGS = Number(value[0]);  //经度
        const latWGS = Number(value[1]);  //纬度
        let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        newData.push([gcjCoordinate.lng, gcjCoordinate.lat]);
    });
    return newData;
}

function multilineWgsGcj(geoData) {
    let newData = [];
    geoData.forEach(function (coordinateValue) {
        let tempNewData = [];
        coordinateValue.forEach(function (value) {
            const lngWGS = Number(value[0]);  //经度
            const latWGS = Number(value[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            tempNewData.push([gcjCoordinate.lng, gcjCoordinate.lat]);
        });
        newData.push(tempNewData)
    });
    return newData;
}

function polyWgsGcj(geoData) {
    let newData = [];
    geoData.forEach(function (coordinateValue) {
        let tempNewData = [];
        coordinateValue.forEach(function (value) {
            const lngWGS = Number(value[0]);  //经度
            const latWGS = Number(value[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            tempNewData.push([gcjCoordinate.lng, gcjCoordinate.lat]);
        });
        newData.push(tempNewData)
    });
    return newData;
}

function multipolyWgsGcj(geoData) {
    let newData = [];
    geoData.forEach(function (arrayValue) {
        let tempNewData1 = [];
        arrayValue.forEach(function (listValue) {
            let tempNewData2 = [];
            listValue.forEach(function (value) {
                const lngWGS = Number(value[0]);  //经度
                const latWGS = Number(value[1]);  //纬度
                let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
                tempNewData2.push([gcjCoordinate.lng, gcjCoordinate.lat]);
            });
            tempNewData1.push(tempNewData2);
        });
        newData.push(tempNewData1)
    });
    return newData;
}
