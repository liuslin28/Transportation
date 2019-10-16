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
    return (nonlinear);
}

// 站间距,引用turf计算,数据routeSample文件夹下的线数据
function stationDistance(data, max, min) {
    let busData = data['features'];
    let busStationList = busData[0].geometry.properties.station;
    let busRoute = busData[0].geometry.coordinates;
    let busRouteTurf = turf.lineString(busRoute);
    let stationDistanceList = [];
    let maxCount = 0;  //大于最大阈值个数
    let minCount = 0;  //小于最小阈值个数

    for (let i = 0; i < busStationList.length - 2; i++) {
        let startCoordinate = busStationList[i];
        let endCoordinate = busStationList[i + 1];
        let start = turf.point(startCoordinate);
        let stop = turf.point(endCoordinate);
        let sliced = turf.lineSlice(start, stop, busRouteTurf);
        let length = Number(turf.length(sliced, {units: 'kilometers'}).toFixed(3));
        stationDistanceList.push(length);
        if (length >= max) {
            maxCount += 1;
        }
        if (length <= min) {
            minCount += 1;
        }
    }
    let maxRatio = ((maxCount / stationDistanceList.length) * 100).toFixed(2);
    let minRatio = ((minCount / stationDistanceList.length) * 100).toFixed(2);

    let resultData = {
        "stationDistance": stationDistanceList,
        "maxRatio": maxRatio,
        "minRatio": minRatio
    };
    return (resultData);
}


function directTransferRate() {
    let routeData;
    let stationData;

    let stationList;
    let newStationData;
    let routeList = [];  //所有线路


    $.when(getJson(conf_demo_route_query)).then(function (rdata) {
        routeData = rdata.data;

        // routeData.forEach(function(value) {
        //     routeList.push(value);
        // });
        $.when(getJson(conf_demo_station_query)).then(function (sdata) {
            stationData = sdata.data;

            let tempStationList;
            let tempStationId;
            let tempIndex; //判断站点是否进入tempStationList
            let stationListArr = [];
            // let tempStationArr;

            // 通过stationId=>routeId=>构建新的stationList;
            stationData.forEach(function (stationvalue) {
                tempStationId = stationvalue.stationId;
                tempStationRoute = stationvalue.routeList;
                tempStationList = [];
                //遍历通过该站点的所有线路
                tempStationRoute.forEach(function (routevalue) {
                    for (let i = 0; i < routeData.length; i++) {
                        if (routeData[i].routeId === routevalue) {
                            routeData[i].stationList.forEach(function (linkedvalue) {
                                tempIndex = tempStationList.indexOf(linkedvalue);

                                //存入不重复的与该站点相连通的站点
                                if ((tempIndex < 0) && (tempStationId !== linkedvalue)) {
                                    tempStationList.push(linkedvalue);
                                }
                            });
                        }
                    }
                });
                let tempStationArr = {
                    "stationId": tempStationId,  //站点ID
                    "routeList": tempStationRoute,  //通过该站点的线路列表
                    "linkedStationList": tempStationList  //与该站点可连通的站点
                };
                // console.log(tempStationArr);
                stationListArr.push(tempStationArr);
            });
            // console.log(stationListArr);
            // console.log(stationListArr.length);
            // console.log("-----------------------------");


            let newRouteArr = [];
            let connectList = [];  //   连通线路列表
            let firstStationData = stationListArr.pop();
            let newStationArr;

            let j=0;
            while ((stationListArr.length > 0) && (j < 15)) {
                j=j+1;
                // console.log("j:"+j);
                newStationArr = [];
                newRouteArr = [];
                // console.log(newStationArr);

                directTransferCon2(stationListArr, newStationArr, newRouteArr, firstStationData);
                connectList.push(newRouteArr);
                firstStationData = stationListArr.pop();
                // console.log("--------------------");
                // console.log(newStationArr);
                // console.log("newRouteArr");
                // console.log(newRouteArr);
                stationListArr = removeDuplicate(stationListArr, newStationArr);
                // console.log(stationListArr);
                // console.log("--------------------");

            }
            // console.log("connectList");
            // console.log(connectList);
            // console.log("--------------------");

            let endPointList;
            let endPointNum;
            let connectNameList;

            let directCount = 0;  //直达线路数
            let transferCount = 0;  //换乘线路数
            let tempDirectCount = 0;  //换乘线路数计算使用
            let tempTransferCount = 0;  //换乘线路数计算使用

            for (let i = 0; i < connectList.length; i++) {
                // console.log("connectList[i]");
                // console.log(connectList[i]);
                // console.log("--------------------");

                endPointList = [];
                endPointNum = 0;
                connectNameList = [];
                connectList[i].forEach(function (value) {
                    routeData.forEach(function (rvalue) {
                        if (rvalue.routeId === value) {
                            let tempIndex = connectNameList.indexOf(rvalue.routeName);
                            if (tempIndex < 0) {
                                connectNameList.push(rvalue.routeName);
                                endPointList = isInclude(endPointList, rvalue.stationList[0]);//首站
                                endPointList = isInclude(endPointList, rvalue.stationList[rvalue.stationList.length - 1]);//末站
                            }
                        }
                    })
                });
                endPointNum = endPointList.length;
                tempDirectCount = connectNameList.length * 2;
                directCount += tempDirectCount;

                tempTransferCount = endPointNum * endPointNum - tempDirectCount - endPointNum;
                transferCount += tempTransferCount;
                // console.log("********************");
                // console.log(endPointList);
                // console.log(connectNameList);
            }

            let totalNum = directCount + transferCount;
            let directRate = directCount/totalNum;  //直达率
            let transferRate = transferCount/totalNum; //换乘率

            console.log(directCount);
            console.log(transferCount);

            console.log("end")

        });

    });
}

// 将可以连通的station汇总至一起
function directTransferCon2(data, newStationArr, newRouteArr, stationData) {
    // console.log("&&&&");
    // console.log(newStationArr);
    // console.log(newRouteArr);
    // console.log(stationData.stationId);
    // console.log("&&&&");

    newStationArr = isInclude(newStationArr, stationData.stationId);
    let tempIsPush = 0;

    stationData.routeList.forEach(function (value) {
        newRouteArr = isInclude(newRouteArr, value);

    });

    stationData.linkedStationList.forEach(function (value) {
        for (let i = 0; i < data.length; i++) {
            if (value === data[i].stationId) {
                let stationData = (data.splice(i, 1))[0];
                directTransferCon2(data, newStationArr, newRouteArr, stationData);
                tempIsPush = 1;
            }
        }
        if (tempIsPush === 0) {
            newStationArr = isInclude(newStationArr, value);
        }
    })
}


function removeDuplicate(stationListArr, newStationArr) {
    newStationArr.forEach(function (value) {
        stationListArr = isDelete(stationListArr, value)
    });
    return stationListArr;
}


function isInclude(dataArr, dataId) {
    let tempIndex = dataArr.indexOf(dataId);
    if (tempIndex < 0) {
        dataArr.push(dataId);
    }
    return dataArr;
}


function isDelete(dataArr, dataId) {
    let tempIndex = dataArr.indexOf(dataId);
    if (tempIndex > -1) {
        dataArr.splice(tempIndex, 1);
    }
    return dataArr;
}


