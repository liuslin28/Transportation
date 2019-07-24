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
    let wgsFeatrueData = wgsData.features;
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
        value.geometry.coordinates = geoData;
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
    const lngWGS = Number(geoData[0]);  //经度
    const latWGS = Number(geoData[1]);  //纬度
    let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
    geoData[0] = gcjCoordinate.lng;
    geoData[1] = gcjCoordinate.lat;
    return geoData;
}

function multipointWgsGcj(geoData) {
    geoData.forEach(function (value) {
        const lngWGS = Number(value[0]);  //经度
        const latWGS = Number(value[1]);  //纬度
        let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        value[0] = gcjCoordinate.lng;
        value[1] = gcjCoordinate.lat;
    });
    return geoData;
}

function lineWgsGcj(geoData) {
    geoData.forEach(function (value) {
        const lngWGS = Number(value[0]);  //经度
        const latWGS = Number(value[1]);  //纬度
        let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        value[0] = gcjCoordinate.lng;
        value[1] = gcjCoordinate.lat;
    });
    return geoData;
}

function multilineWgsGcj(geoData) {
    geoData.forEach(function (coordinateValue) {
        coordinateValue.forEach(function (value) {
            const lngWGS = Number(value[0]);  //经度
            const latWGS = Number(value[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            value[0] = gcjCoordinate.lng;
            value[1] = gcjCoordinate.lat;
        })
    });
    return geoData;
}

function polyWgsGcj(geoData) {
    geoData.forEach(function (coordinateValue) {
        coordinateValue.forEach(function (value) {
            const lngWGS = Number(value[0]);  //经度
            const latWGS = Number(value[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            value[0] = gcjCoordinate.lng;
            value[1] = gcjCoordinate.lat;
        })
    });
    return geoData;
}

function multipolyWgsGcj(geoData) {
    geoData.forEach(function (arrayValue) {
        arrayValue.forEach(function (listValue) {
            listValue.forEach(function (value) {
                const lngWGS = Number(value[0]);  //经度
                const latWGS = Number(value[1]);  //纬度
                let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
                value[0] = gcjCoordinate.lng;
                value[1] = gcjCoordinate.lat;
            })
        })
    });
    return geoData;
}
