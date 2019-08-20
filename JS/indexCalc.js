/*指标计算 */

// 站点密度
function stopDensity() {
    $.when(getJson(conf_station_query)).then(function (data) {
        let stationNum = data['features'].length;
        let stationDensity = stationNum / centerArea;
        console.log(stationDensity);
    })
}

// 网络复杂度
function networkComplex() {
    $.when(getJson(conf_station_query)).then(function (data) {
        let stationLength = data['features'].length;
        let networkComplex = (stationLength - 1) / stationLength;
        console.log(networkComplex)
    });
}

// 线网平均站间距
function networkDistance() {
    let busRouteLength = 0;
    let busRouteStation = 0;
    $.when(getJson(conf_busline_query)).then(function (data) {
        let busRoute = data['features'];
        busRoute.forEach(function (value) {
            if (value['properties'].lineLength === '') {
                // console.log(value['properties'].lineName);
            } else {
                busRouteLength += Number(value['properties'].lineLength);
            }
            if (value['properties'].stationNum) {
                busRouteStation += Number(value['properties'].stationNum);
            }
        });
        networkLength = busRouteLength;
        console.log(networkLength);
        let networkDistance = busRouteLength / busRouteStation;
        console.log(networkDistance);
    })
}

// 非直线系数,引用turf计算, 数据routeSample文件夹下的线数据
function nonLinear(data) {
    let busData = data['features'];
    let busRouteLength = busData[0].geometry.properties.lineLength;
    let busCoordinate = busData[0].geometry.coordinates;

    let coordinateFrom = turf.point(busCoordinate[0]);
    let coordinateTo = turf.point(busCoordinate[busCoordinate.length - 1]);
    let options = {units: 'kilometers'};
    let busRouteDistance = turf.distance(coordinateFrom, coordinateTo, options);
    let nonlinear = (busRouteLength / busRouteDistance).toFixed(2);
    return(nonlinear);
}

// 站间距,引用turf计算,数据routeSample文件夹下的线数据
function stationDistance(data,max,min) {
    let busData = data['features'];
    let busStationList = busData[0].geometry.properties.station;
    let busRoute = busData[0].geometry.coordinates;
    let busRouteTurf = turf.lineString(busRoute);
    let stationDistanceList = [];
    let maxCount = 0;  //大于最大阈值个数
    let minCount = 0;  //小于最小阈值个数

    for (let i = 0; i < busStationList.length - 1; i++) {
        let startCoordinate = busStationList[i];
        let endCoordinate = busStationList[i + 1];
        let start = turf.point(startCoordinate);
        let stop = turf.point(endCoordinate);
        let sliced = turf.lineSlice(start, stop, busRouteTurf);
        let length = Number(turf.length(sliced, {units: 'kilometers'}).toFixed(3));
        stationDistanceList.push(length);
        if(length >= max) {
            maxCount += 1;
        }
        if(length <= min) {
            minCount += 1;
        }
    }
    let maxRatio = ((maxCount / stationDistanceList.length) * 100).toFixed(2) ;
    let minRatio = ((minCount / stationDistanceList.length) * 100).toFixed(2) ;

    let resultData = {
        "stationDistance": stationDistanceList,
        "maxRatio": maxRatio,
        "minRatio": minRatio
    };
    return (resultData);
}
