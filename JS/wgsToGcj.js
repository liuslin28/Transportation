// WGS84 => GCJ02
function wgsToGcj(wgsData) {
    // 获取数据类型
    geometryData = (wgsData.features)[0].geometry;
    geoType = geometryData.type;
    switch (geoType) {
        case "Point":
            coordinateData = wgsData.features;
            coordinateData = pointWgsGcj(coordinateData);
            break;
        case "LineString":
            coordinateData = wgsData.features;
            coordinateData = lineWgsGcj(coordinateData);
            wgsData.features = coordinateData;
            break;
        case "Polygon":
            coordinateData = geometryData.coordinates;
            coordinateData = polyWgsGcj(coordinateData);
            ((wgsData.features)[0].geometry).coordinates = coordinateData;
            break;
        case "MultiPolygon":
            coordinateData = geometryData.coordinates;
            coordinateData = multipolyWgsGcj(coordinateData);
            ((wgsData.features)[0].geometry).coordinates = coordinateData;
            break;
        default:
            console.log("error");
            break;
    }
    return wgsData;
}

function pointWgsGcj(coordinateData) {
    coordinateData.forEach(function (coordinateValue, index) {
        coorWGS = (coordinateValue.geometry).coordinates;
        const lngWGS = Number(coorWGS[0]);  //经度
        const latWGS = Number(coorWGS[1]);  //纬度
        var gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        coorWGS[0] = gcjCoordinate.lng;
        coorWGS[1] = gcjCoordinate.lat;
    });
    return coordinateData;
}

function lineWgsGcj(coordinateData) {
    coordinateData.forEach(function (coordinateValue, index) {
        coorWGS = (coordinateValue.geometry).coordinates
        coorWGS.forEach(function (currentValue) {
            const lngWGS = Number(currentValue[0]);  //经度
            const latWGS = Number(currentValue[1]);  //纬度
            var gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            currentValue[0] = gcjCoordinate.lng;
            currentValue[1] = gcjCoordinate.lat;
        })
    })
    return coordinateData;
}

function polyWgsGcj(coordinateData) {
    coordinateData.forEach(function (coordinateValue, index) {
        coordinateValue.forEach(function (currentValue) {
            const lngWGS = Number(currentValue[0]);  //经度
            const latWGS = Number(currentValue[1]);  //纬度
            var gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            currentValue[0] = gcjCoordinate.lng;
            currentValue[1] = gcjCoordinate.lat;
        })
    });
    return coordinateData;
}

function multipolyWgsGcj(coordinateData) {
    coordinateData.forEach(function (arrayValue, index) {
        arrayValue.forEach(function (listValue, index) {
            listValue.forEach(function (currentValue, index) {
                const lngWGS = Number(currentValue[0]);  //经度
                const latWGS = Number(currentValue[1]);  //纬度
                var gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
                currentValue[0] = gcjCoordinate.lng;
                currentValue[1] = gcjCoordinate.lat;
            })

        })
    });
    return coordinateData;
}
//_____________________________________________________
