// WGS84 => GCJ02
/*
{
    "type": "FeatureCollection",
    "features": []
}*/

function wgsToGcj(wgsData) {
    let wgsFeatrueData = wgsData.features;
    let gcjFeatureData = [];
    wgsFeatrueData.forEach(function (value) {
        geoType = value.geometry.type;
        geoData = value.geometry.coordinates;

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
//_____________________________________________________
