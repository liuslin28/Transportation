var map;
/**
 * 基本地图加载
 * 地图缩放级别限制
 */

var conf_domainUrl; //内部使用已隐藏
var conf_dataDomainUrl = conf_domainUrl;
var conf_spriteUrl = conf_domainUrl + '/minemapapi/v2.0.0/sprite/sprite';
var conf_serviceUrl = conf_domainUrl + '/service';
var conf_accessToken; //内部使用已隐藏
var conf_solution = 4744;
var conf_centerPoint = [120.64, 31.31801];
var conf_style = conf_serviceUrl + '/solu/style/id/' + conf_solution

$(document).ready(function () {
    minemap.domainUrl = conf_domainUrl;
    minemap.dataDomainUrl = conf_dataDomainUrl;
    minemap.spriteUrl = conf_spriteUrl;
    minemap.serviceUrl = conf_serviceUrl;
    minemap.accessToken = conf_accessToken;
    minemap.solution = conf_solution;
    map = new minemap.Map({
        container: 'map',
        // 4745
        style: conf_style, /*底图样式*/
        center: conf_centerPoint, /*地图中心点*/
        zoom: 11, /*地图默认缩放等级*/
        pitch: 0, /*地图俯仰角度*/
        maxZoom: 17, /*地图最大缩放等级*/
        minZoom: 3  /*地图最小缩放等级*/
    });
    map.on("load", function () {
        addCenter();
        addStops();
        addBuslane();
        addBusroute();
    })
})

//_____________________________________________________
// WGS84 => GCJ02
function wgsToGcj(wgsData) {
    // 获取数据类型
    geometryData = (wgsData.features)[0].geometry;
    geoType = geometryData.type;
    switch (geoType) {
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
        case "LineString":
            coordinateData = wgsData.features;
            coordinateData = lineWgsGcj(coordinateData);
            wgsData.features = coordinateData;
            break;
        default:
            console.log("error");
            break;
    }
    return wgsData;
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

//_____________________________________________________
//GP服务

// 公交专用道
function buslaneGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esribusLane.json",
            type: "GET",
            success: function (data) {
                let buslaneData = data;
                var buslaneFeatureSet = new esri.tasks.FeatureSet(buslaneData);
                buslaneFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                $.ajax({
                    url: "./esrijsonData/esriroadLine.json",
                    type: "GET",
                    success: function (data) {
                        let roadData = data;
                        var roadFeatureSet = new esri.tasks.FeatureSet(roadData);
                        roadFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        var gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/routeBuslane");
                        var gpParams = {
                            "road": roadFeatureSet,
                            "buslane": buslaneFeatureSet
                        };
                        console.log(gpParams);
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 面积求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let lineLength = value.value.features[0].attributes['Shape_Length'];
                                // 面积
                                console.log(value);
                                console.log(lineLength);
                            });
                        }
                    }
                })
                // GP服务调用

            }
        })
    });
}

function busrouteGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esribusRoute.json",
            type: "GET",
            success: function (data) {
                let buslaneData = data;
                var buslaneFeatureSet = new esri.tasks.FeatureSet(buslaneData);
                buslaneFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                $.ajax({
                    url: "./esrijsonData/esriroadLine.json",
                    type: "GET",
                    success: function (data) {
                        let roadData = data;
                        var roadFeatureSet = new esri.tasks.FeatureSet(roadData);
                        roadFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        var gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/routeBuslane");
                        var gpParams = {
                            "road": roadFeatureSet,
                            "buslane": buslaneFeatureSet
                        };
                        console.log(gpParams);
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 面积求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let lineLength = value.value.features[0].attributes['Shape_Length'];
                                // 面积
                                console.log(value);
                                console.log(lineLength);
                            });
                        }
                    }
                })
                // GP服务调用

            }
        })
    });
}


// 站点覆盖率
function bufferGPTool() {
    var pointFeatureSet;
    var polygonFeatureSet;
    var aPoint = {
        "displayFieldName": "",
        "fieldAliases": {
            "FID": "FID"
        },
        "geometryType": "esriGeometryPoint",
        "spatialReference": {
            "wkid": 4326,
            "latestWkid": 4326
        },
        "fields": [
            {
                "name": "FID",
                "type": "esriFieldTypeOID",
                "alias": "FID"
            }
        ],
        "features": []
    };

    var Dis = {
        "distance": 500,
        "units": "esriMeters"
    };

    // 设置输入参数(公交点
    // 数据格式要求：小数点6位，经纬度范围
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./geojsonData/stopsPoint.json",
            type: "GET",
            success: function (data) {
                var pointData = data['features'];

                var features = [];
                var i = 0;
                pointData.forEach(function (pointValue) {
                    i += 1;
                    let coordinateValue = (pointValue['geometry'])['coordinates']
                    var point = new esri.geometry.Point([coordinateValue[0], coordinateValue[1]], new SpatialReference({wkid: 4326}));
                    var graphic = new Graphic({
                        geometry: point,
                        attributes: {
                            "FID": i
                        },
                        symbol: {}
                    });
                    features.push(graphic)
                });
                tempPoint = features;
                aPoint['features'] = features;
                pointFeatureSet = new esri.tasks.FeatureSet(aPoint);
                pointFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                // 设置输入参数(中心城区
                $.ajax({
                    url: './esrijsonData/centerPolygon.json',
                    type: 'GET',
                    success: function (data) {
                        centercityfeatures = data;
                        // 设置输入参数（多边形
                        // tempPolygon = data;
                        polygonFeatureSet = new esri.tasks.FeatureSet(centercityfeatures);
                        polygonFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        // GP服务调用
                        var gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/coverArea/GPServer/coverArea");
                        // var gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/test/coverTest/GPServer/coverTest");
                        var gpParams = {
                            "stops": pointFeatureSet,
                            "Dis1": Dis,
                            "Dis2": Dis,
                            "city1": polygonFeatureSet
                            // "city2": polygonFeatureSet
                        };
                        console.log(gpParams);
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            gptask.getResultData(jobInfo.jobId, "bufferOutput").then(function (value) {
                                areaData = value.value.features[0].attributes['Shape_Area'];
                                console.log(areaData)
                            })
                            // 面积求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                // 面积
                                bufferResult = value.value.features;
                                console.log(bufferResult)

                                // 输出格式转换，坐标尚未进行转换
                                bufferJson = transtoJson(bufferResult);
                                // bufferJson = wgsToGcj(bufferJson);
                                if (bufferJson) {
                                    map.addSource('bufferJson', {
                                        'type': 'geojson',
                                        'data': bufferJson
                                    });
                                    map.addLayer({
                                        'id': 'polygonLayer',
                                        'type': 'fill',
                                        'source': 'bufferJson',
                                        'layout': {},
                                        'paint': {
                                            'fill-color': '#83dcf2',
                                            'fill-opacity': 0.2
                                        }
                                    });
                                } else {
                                    console.log("buffer结果加载出错了");
                                }
                            });
                        }
                    },
                    error: function (error) {
                        alert(error)
                    }
                })
            },
            error: function (error) {
                alert(error)
            }
        })
    });
}

//_____________________________________________________

// MultiPolygon的格式转换
function transtoJson(data) {
    var multiPoly = [];
    data.map(function (value) {
        const geoCoordinate = value.geometry['rings'];
        multiPoly.push(geoCoordinate);
    });
    polygonJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": multiPoly
                }
            }
        ]
    };
    transPolyJson = wgsToGcj(polygonJson);
    return transPolyJson;
}

//_____________________________________________________

// 加载数据
function addStops() {
    $.ajax({
        // url: "./geojsonData/centerPolygon.json",
        url: "./geojsonData/stopsPoint.json",
        type: "GET",
        success: function (data) {
            console.log(data['features'].length)
            // var gcjData = wgsToGcj(data);
            map.addSource('stopsSource', {
                'type': 'geojson',
                'data': data
            });
            map.addLayer({
                'id': 'stopsLayer',
                'type': 'circle',
                'source': 'stopsSource',
                'layout': {
                    "visibility": "none"
                },
                'paint': {
                    'circle-radius': {
                        /**
                         * base:圆的半径随zoom级别变化的剧烈程度，
                         *      1：        近似于直线线
                         *      <1:        曲线开口向下
                         *      >1 && <1.9 曲线开口向上
                         * stops：[minzoom,minPixel],[maxzoom,maxPixel]
                         *        对应：最小zoom时的半径pixel像素大小，最大时的半径像素大小
                         * 其他中间zoom级别，根据base规定的线性（1）或曲线曲率，半径大小会相应变化
                         */
                        'base': 1.5,
                        'stops': [[5, 2], [18, 4]]
                    },
                    'circle-color': "#b2cb94",      //填充圆形的颜色
                    'circle-blur': 0.1,              //模糊程度，默认0
                    'circle-opacity': 0.6             //透明度，默认为1
                }
            });
        },
        error: function (error) {
            alert(error)
        }
    })
}

function addCenter() {
    $.ajax({
        url: "./geojsonData/centerPolygon.json",
        type: "GET",
        success: function (data) {
            var gcjData = wgsToGcj(data);
            map.addSource('centerSource', {
                'type': 'geojson',
                'data': gcjData
            });
            map.addLayer({
                'id': 'centerLayer',
                'type': 'fill',
                'source': 'centerSource',
                'layout': {
                    "visibility": "none"
                },
                'paint': {
                    'fill-color': '#79ada9',
                    'fill-opacity': 0.2
                }
            });
        },
        error: function (error) {
            alert(error)
        }
    })
}

function addBuslane() {
    $.ajax({
        url: "./geojsonData/busLane.json",
        type: "GET",
        success: function (data) {
            console.log(data);
            var gcjData = wgsToGcj(data);
            map.addSource('buslaneSource', {
                'type': 'geojson',
                'data': gcjData
            });
            map.addLayer({
                'id': 'buslaneLayer',
                'type': 'line',
                'source': 'buslaneSource',
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    "visibility": "none"
                },
                "paint": {
                    "line-color": "#FFD08F",
                    // "line-color": "rgba(253, 128, 93,1)",
                    "line-width": 2
                }
            });
        },
        error: function (error) {
            alert(error)
        }
    })
}

function addBusroute() {
    $.ajax({
        url: "./geojsonData/busRoute.json",
        type: "GET",
        success: function (data) {
            console.log(data);
            var gcjData = wgsToGcj(data);
            map.addSource('busrouteSource', {
                'type': 'geojson',
                'data': gcjData
            });
            map.addLayer({
                'id': 'busrouteLayer',
                'type': 'line',
                'source': 'busrouteSource',
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    "visibility": "none"
                },
                "paint": {
                    "line-color": "#82B38F",
                    "line-opacity": 0.6,
                    "line-width": 2
                }
            });
        },
        error: function (error) {
            alert(error)
        }
    })
}

/*------------------------------*/

// 图层显示切换
function layerVisibilityToggle(layerName, checkValue) {
    map.setLayoutProperty(layerName, 'visibility', checkValue);
}

/*------------------------------*/

function showTemp() {
    $('.temp-data').show();
    $('.temp-data-none').hide();
}
