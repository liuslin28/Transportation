// WGS84 => GCJ02
function wgsToGcj(wgsData) {
    // 获取数据类型
    let geometryData = (wgsData.features)[0].geometry;
    let geoType = geometryData.type;
    let coordinateData;
    switch (geoType) {
        case "Point":
            coordinateData = wgsData.features;
            wgsData.features = pointWgsGcj(coordinateData);
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
    coordinateData.forEach(function (coordinateValue) {
        let coorWGS = (coordinateValue.geometry).coordinates;
        const lngWGS = Number(coorWGS[0]);  //经度
        const latWGS = Number(coorWGS[1]);  //纬度
        let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
        coorWGS[0] = gcjCoordinate.lng;
        coorWGS[1] = gcjCoordinate.lat;
    });
    return coordinateData;
}

function lineWgsGcj(coordinateData) {
    coordinateData.forEach(function (coordinateValue) {
        let coorWGS = (coordinateValue.geometry).coordinates;
        coorWGS.forEach(function (currentValue) {
            const lngWGS = Number(currentValue[0]);  //经度
            const latWGS = Number(currentValue[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            currentValue[0] = gcjCoordinate.lng;
            currentValue[1] = gcjCoordinate.lat;
        })
    });
    return coordinateData;
}

function polyWgsGcj(coordinateData) {
    coordinateData.forEach(function (coordinateValue) {
        coordinateValue.forEach(function (currentValue) {
            const lngWGS = Number(currentValue[0]);  //经度
            const latWGS = Number(currentValue[1]);  //纬度
            let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
            currentValue[0] = gcjCoordinate.lng;
            currentValue[1] = gcjCoordinate.lat;
        })
    });
    return coordinateData;
}

function multipolyWgsGcj(coordinateData) {
    coordinateData.forEach(function (arrayValue) {
        arrayValue.forEach(function (listValue) {
            listValue.forEach(function (currentValue) {
                const lngWGS = Number(currentValue[0]);  //经度
                const latWGS = Number(currentValue[1]);  //纬度
                let gcjCoordinate = transformFromWGSToGCJ(lngWGS, latWGS);
                currentValue[0] = gcjCoordinate.lng;
                currentValue[1] = gcjCoordinate.lat;
            })

        })
    });
    return coordinateData;
}
//_____________________________________________________
