var map, popup, marker;//地图Map，地图POPUP框，地图中marker点
var edit;
var layerList = ['stationLayer', 'stationLayerL', 'stationLayerB', 'stationLayerC', 'stationLayerD', 'stationLayerBL', 'stationLayerCL', 'stationLayerDL', 'terminalLayer', 'stopHeatLayer', 'centerLayer', 'busLaneLayer', 'busRouteLayer', 'oldCityLayer', 'busRoutesLayer', 'busSingleRouteLayer', 'busSingleStationLayer', 'coverCenterLayer', 'uncoverCenterLayer'];
var networkLength; //各线路长度之和
var networkLengthTemp = 201537.800148 / 1000; //各线路长度之和(古城区)
var busLaneLength; //公交专用道长度
var busLaneRatio; //公交专用道设置比率
var busLineLength; //公交线网长度
var busLineDensity; //公交线网密度
var networkRepeat; //线网重复系数
var centerArea = 411.56; //中央建成区面积
var oldcityArea = 16.373766; //古城区面积
var coverArea;  //中央建成区站点覆盖面积
var coverAreaRatio;  //中央建成区站点覆盖比率
var pointApertureColors = ['red', 'blue', 'orange', 'green']; //目前只提供地图上点击点（ICON）展示的四色光晕

/**
 * 基本地图加载
 * 地图缩放级别限制
 */

$(document).ready(function () {
    minemap.domainUrl = conf_domainUrl;
    minemap.dataDomainUrl = conf_dataDomainUrl;
    minemap.spriteUrl = conf_spriteUrl;
    minemap.serviceUrl = conf_serviceUrl;
    minemap.accessToken = conf_accessToken;
    minemap.solution = conf_solution;
    map = new minemap.Map({
        container: 'map',
        style: conf_style, /*底图样式*/
        center: conf_centerPoint, /*地图中心点*/
        zoom: 11, /*地图默认缩放等级*/
        pitch: 90, /*地图俯仰角度*/
        maxZoom: 17, /*地图最大缩放等级*/
        minZoom: 3, /*地图最小缩放等级*/
        trackResize: true, /*地图会自动匹配浏览器窗口大小*/
        logoControl: false  /*logo控件是否显示，不加该参数时默认显示*/
    });

    popup = new minemap.Popup({
        closeButton: true,
        closeOnClick: false
    });

    edit = new minemap.edit.init(map, {
        boxSelect: true,
        touchEnabled: true,
        displayControlsDefault: true,
        showButtons: false
    });

    map.on("load", function () {
        let t = setInterval(function () {
            //if (map && 其它业务判断) {
            if (map) {
                if (map.isStyleLoaded()) {
                    //加载成功后 loading 隐藏 , 加载其它数据
                    clearInterval(t);
                    $('.loading').hide();
                    $('.legendWrapper').show();
                    map.resize();
                    mapFly();

                    setTimeout(function () {
                        addCoverCenter();
                        addunCoverCenter();
                        addSuzhoucity();

                        addBuslane();
                        addBusroute();
                        addBusroutes();
                        addCenter();
                        addOldcity();

                    }, 5000);

                }
            } else {
                clearInterval(t);
            }
        }, 1000);
        addStation();
    });

    setTimeout(function () {
        // stopDensity();
        // networkComplex();
        // networkDistance();
        // nonLinear();
        // buslaneGPTool();
        // bufferGPTool();
        // busrouteGPTool();
        // stationDistance();
    }, 5000);

    map.on("edit.undo", onEditUndo);
    map.on("edit.redo", onEditRedo);

    changeStationLayer('true');
    mapPopup();
});

function mapPopup() {
    map.on('click', function (e) {
        // 点击地图，同步清除marker
        if (marker) {
            map.removeMarkers();
        }

        // let features = map.queryRenderedFeatures([[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]], {layers: ['stationLayer', 'stationLayerL','terminalLayer']});
        let features = map.queryRenderedFeatures([[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]], {layers: ['stationLayerB', 'stationLayerC', 'stationLayerD', 'stationLayerBL', 'stationLayerCL', 'stationLayerDL', 'terminalLayer']});
        if (!features.length) {
            popup.remove();
            return;
        }
        /**
         * 如果在点击的位置有多个响应类型的点或者线，会获取一个feature的数组,取第一个要素显示
         */
        let feature = features[0];
        let layerId = feature.layer.id;
        let stationLine = feature.properties.stopLine;
        let stationHtml = [];
        let lengthHtml;
        let stationInfoHtml;
        if (stationLine) {
            let stationList = stationLine.split(',');
            let stationLineCount = stationList.length;
            lengthHtml = "<span class='popup-station-count'>" + "途径站点线路" + stationLineCount + "条" + "</span>";
            let stationDiv;
            stationList.forEach(function (value) {
                stationDiv = "<span class='popup-station-list'>" + value + "</span>";
                stationHtml += stationDiv;
            });
            stationInfoHtml = "<span class='popup-station-type'>" + feature.properties.stopType + "</span>" + "<span class='popup-station-header'>" + feature.properties.stopName + "</span>" + lengthHtml + stationHtml;

        } else {
            stationInfoHtml = "<span class='popup-station-type'>" + feature.properties.stopType + "</span>" + "<span class='popup-station-header'>" + feature.properties.stopName + "</span>" + "<span class='popup-station-count'>" + "暂无线路信息" + "</span>";
        }

        getDynamicIcon(feature, pointApertureColors[1]);
        popup.setLngLat(e.lngLat)
            .setHTML(stationInfoHtml)
            .addTo(map);
        pointCenterFly(feature.geometry.coordinates);
        listenStationInfo();
        // switch(layerId) {
        //     case 'stationLayer':
        //         getDynamicIcon(feature,pointApertureColors[1]);
        //         popup.setLngLat(feature.geometry.coordinates)
        //             .setHTML(stationInfoHtml)
        //             .addTo(map);
        //         pointCenterFly(feature.geometry.coordinates);
        //         break;
        //     case 'stationLayerL':
        //         getDynamicIcon(feature,pointApertureColors[1]);
        //         popup.setLngLat(e.lngLat)
        //             .setHTML(stationInfoHtml)
        //             .addTo(map);
        //         pointCenterFly(feature.geometry.coordinates);
        //         break;
        //     case 'terminalLayer':
        //         getDynamicIcon(feature,pointApertureColors[1]);
        //         popup.setLngLat(e.lngLat)
        //             .setHTML(stationInfoHtml)
        //             .addTo(map);
        //         pointCenterFly(feature.geometry.coordinates);
        //         break;
        //     default:
        //         break;
        // }
    });
}

// 监听popup弹出框的click事件
function listenStationInfo() {
    $('.popup-station-list').on('click', function (e) {
        // 关闭其他图层
        closeLayer();
        changeStationLayer('false');

        // 关闭图例
        $('.legendWrapper').hide();

        let inputTarget = e.target;
        let busLineName = inputTarget.innerText;
        console.log(busLineName);
        addSingleRoute(busLineName);
    });
    $('.minemap-popup-close-button').on('click',function () {
        if (marker) {
            map.removeMarkers();
        }
    });
}

//_____________________________________________________

// 地图飞入动画
function mapFly() {
    map.flyTo({
        center: [120.60, 31.30],
        zoom: 11,
        speed: 0.1,
        curve: 1
    });
}

// 站点坐标移至地图中心
function pointCenterFly(coordinates) {
    let mapZoom = map.getZoom();
    if (mapZoom > 13) {
        map.flyTo({
            center: coordinates,
            zoom: mapZoom
        })
    } else {
        map.flyTo({
            center: coordinates,
            zoom: 13
        })
    }
}

//_____________________________________________________

// 切换点坐标图层
function changeZoom() {
    let mapZoom = map.getZoom();
    if (mapZoom > 13) {
        // layerVisibilityToggle("stationLayer", "none");
        layerVisibilityToggle("stationLayerB", "none");
        layerVisibilityToggle("stationLayerC", "none");
        layerVisibilityToggle("stationLayerD", "none");
        // layerVisibilityToggle("stationLayerL", "visible");
        layerVisibilityToggle("stationLayerBL", "visible");
        layerVisibilityToggle("stationLayerCL", "visible");
        layerVisibilityToggle("stationLayerDL", "visible");
    } else {
        // layerVisibilityToggle("stationLayer", "visible");
        layerVisibilityToggle("stationLayerB", "visible");
        layerVisibilityToggle("stationLayerC", "visible");
        layerVisibilityToggle("stationLayerD", "visible");
        // layerVisibilityToggle("stationLayerL", "none");
        layerVisibilityToggle("stationLayerBL", "none");
        layerVisibilityToggle("stationLayerCL", "none");
        layerVisibilityToggle("stationLayerDL", "none");
    }
}

function changeStationLayer(layerChange) {
    if (layerChange === 'true') {
        // 地图缩放,改变站点图层显示
        map.on("zoomend", changeZoom);
    } else {
        map.off("zoomend", changeZoom);
    }
}

//_____________________________________________________

function onEditMapClick(mode) {
    if (edit && mode) {
        edit.onBtnCtrlActive(mode);
    }
}

function onEditUndo(e) {
    e.record
}

function onEditRedo(e) {
    e.record
}

//_____________________________________________________
//GP服务
// 公交专用道
function buslaneGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esribusLaneC.json",
            type: "GET",
            success: function (data) {
                let buslaneFeatureSet = new esri.tasks.FeatureSet(data);
                buslaneFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                $.ajax({
                    url: "./esrijsonData/esriroadLine.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);
                        roadFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/lineLength");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "line": buslaneFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let lineLength = value.value.features[0].attributes['Shape_Length'];
                                // 米=>千米
                                busLaneLength = lineLength / 1000;
                                busLaneRatio = busLaneLength / networkLength;
                                console.log(busLaneLength);
                                // console.log(busLaneRatio);

                            });
                        }
                    }
                })
            }
        })
    });
}

// 线网长度
function busrouteGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esribusRoute.json",
            type: "GET",
            success: function (data) {
                let buslineFeatureSet = new esri.tasks.FeatureSet(data);
                buslineFeatureSet.spatialReference = new SpatialReference({wkid: 4326});
                $.ajax({
                    url: "./esrijsonData/esriroadLine.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);
                        roadFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/lineLength");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "line": buslineFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let lineLength = value.value.features[0].attributes['Shape_Length'];
                                // 米=>千米
                                busLineLength = lineLength / 1000;
                                console.log(lineLength);
                                // 全市为例的计算
                                // networkRepeat = networkLength/busLineLength;
                                // busLineDensity = busLineLength/centerArea;
                                // 古城区为例的计算
                                networkRepeat = networkLengthTemp / busLineLength;
                                busLineDensity = busLineLength / oldcityArea;
                                console.log(busLineDensity);

                            });
                        }
                    }
                })
            }
        })
    });
}

// 公交线路通过公交专用道的长度
function routeGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esrirouteSample.json",
            type: "GET",
            success: function (data) {
                let buslineFeatureSet = new esri.tasks.FeatureSet(data);
                buslineFeatureSet.spatialReference = new SpatialReference({wkid: 4326});
                $.ajax({
                    url: "./esrijsonData/esribusLane.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);
                        roadFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/lineLength");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "line": buslineFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let lineLength = value.value.features[0].attributes['Shape_Length'];
                                // 米=>千米,保留2位小数
                                lineLength = (lineLength / 1000).toFixed(2);
                                console.log(lineLength);

                            });
                        }
                    }
                })
            }
        })
    });
}

// 站点覆盖率
function bufferGPTool() {
    let pointFeatureSet;
    let polygonFeatureSet;
    let aPoint = {
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

    let Dis = {
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
                let pointData = data['features'];

                let features = [];
                let i = 0;
                pointData.forEach(function (pointValue) {
                    i += 1;
                    let coordinateValue = (pointValue['geometry'])['coordinates']
                    let point = new esri.geometry.Point([coordinateValue[0], coordinateValue[1]], new SpatialReference({wkid: 4326}));
                    let graphic = new Graphic({
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
                    url: './esrijsonData/esricenterPolygon.json',
                    type: 'GET',
                    success: function (data) {
                        // 设置输入参数（多边形
                        polygonFeatureSet = new esri.tasks.FeatureSet(data);
                        polygonFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        // GP服务调用
                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/coverArea/GPServer/coverArea");
                        let gpParams = {
                            "stops": pointFeatureSet,
                            "Dis1": Dis,
                            "Dis2": Dis,
                            "city1": polygonFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 运行状态显示
                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                        }

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 面积求算
                            gptask.getResultData(jobInfo.jobId, "bufferOutput").then(function (value) {
                                // 面积
                                areaData = value.value.features[0].attributes['Shape_Area'];
                                // 米=>千米
                                coverArea = areaData / (1000 * 1000);
                                console.log(coverArea);
                                coverAreaRatio = coverArea / centerArea;
                                console.log(coverAreaRatio);
                            });
                            // 地图展示
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let bufferResult = value.value.features;
                                // 输出格式转换，坐标尚未进行转换
                                bufferJson = transtoJson(bufferResult);
                                if (bufferJson) {
                                    // 切换数据源
                                    map.getSource('coverCenterSource').setData(bufferJson);
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
    let multiPoly = [];
    data.map(function (value) {
        const geoCoordinate = value.geometry['rings'];
        multiPoly.push(geoCoordinate);
    });
    let polygonJson = {
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
// 站点数据
function addStation() {
    $.when(getJson(conf_station_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('stopsSource', {
            'type': 'geojson',
            'data': gcjData
        });

        map.addLayer({
            'id': 'stationLayer',
            'type': 'circle',
            'source': 'stopsSource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'circle-radius': {
                    'base': 1.5,
                    'stops': [[5, 2], [18, 4]]
                },
                'circle-color': "#00A2D9",      //填充圆形的颜色
                'circle-blur': 0.1,              //模糊程度，默认0
                'circle-opacity': 0.6           //透明度，默认为1
            },
            filter: ["in", "stopType", "一般停靠站"]
        });
        map.addLayer({
            'id': 'stationLayerA',
            'type': 'circle',
            'source': 'stopsSource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'circle-radius': {
                    'base': 1.5,
                    'stops': [[5, 2], [18, 4]]
                },
                'circle-color': "rgb(226, 83, 101)",      //填充圆形的颜色 红色
                'circle-blur': 0.1,              //模糊程度，默认0
                'circle-opacity': 0.6           //透明度，默认为1
            },
            filter: ["in", "stopType", "首末站"]

        });
        map.addLayer({
            'id': 'stationLayerB',
            'type': 'circle',
            'source': 'stopsSource',
            'layout': {
                "visibility": "visible"
            },
            'paint': {
                'circle-radius': {
                    'base': 1.5,
                    'stops': [[5, 2], [18, 4]]
                },
                'circle-color': "#00A2D9",      //填充圆形的颜色
                'circle-blur': 0.1,              //模糊程度，默认0
                'circle-opacity': 0.6           //透明度，默认为1
            },
            filter: ["in", "stopType", "一般停靠站"]
        });
        map.addLayer({
            'id': 'stationLayerC',
            'type': 'circle',
            'source': 'stopsSource',
            'layout': {
                "visibility": "visible"
            },
            'paint': {
                'circle-radius': {
                    'base': 1.5,
                    'stops': [[5, 2], [18, 4]]
                },
                'circle-color': "#E2AF32",      //填充圆形的颜色 黄色
                'circle-blur': 0.1,              //模糊程度，默认0
                'circle-opacity': 0.6           //透明度，默认为1
            },
            filter: ["in", "stopType", "换乘站"]

        });
        map.addLayer({
            'id': 'stationLayerD',
            'type': 'circle',
            'source': 'stopsSource',
            'layout': {
                "visibility": "visible"
            },
            'paint': {
                'circle-radius': {
                    'base': 1.5,
                    'stops': [[5, 2], [18, 4]]
                },
                // 'circle-color': "#7E5887",      //填充圆形的颜色 紫色
                'circle-color': "#25a982",      //填充圆形的颜色 绿色
                'circle-blur': 0.1,              //模糊程度，默认0
                'circle-opacity': 0.6           //透明度，默认为1
            },
            filter: ["in", "stopType", "枢纽站", "集散站"]

        });

        map.loadImage('./CSS/svg/bus-stationA.png', function (error, image) {
            if (error) throw error;
            map.addImage('terminal-icon', image);
            map.addLayer({
                "id": "terminalLayer",
                "type": "symbol",
                "source": 'stopsSource',
                "layout": {
                    "icon-image": "terminal-icon",
                    "icon-size": 0.5
                },
                filter: ["in", "stopType", "首末站"]
            });
        });

        map.loadImage('./CSS/svg/bus-stationB.png', function (error, image) {
            if (error) throw error;
            map.addImage('staion-iconB', image);
            map.addLayer({
                "id": "stationLayerBL",
                "type": "symbol",
                "source": 'stopsSource',
                "layout": {
                    "icon-image": "staion-iconB",
                    "icon-size": 0.5,
                    "visibility": "none"
                },
                // filter: ["in", "stopType", "一般停靠站", "换乘站", "枢纽站","集散站"]
                filter: ["in", "stopType", "一般停靠站"]
            });
        });

        map.loadImage('./CSS/svg/bus-stationC.png', function (error, image) {
            if (error) throw error;
            map.addImage('staion-iconC', image);
            map.addLayer({
                "id": "stationLayerCL",
                "type": "symbol",
                "source": 'stopsSource',
                "layout": {
                    "icon-image": "staion-iconC",
                    "icon-size": 0.5,
                    "visibility": "none"
                },
                filter: ["in", "stopType", "换乘站"]
            });
        });

        map.loadImage('./CSS/svg/bus-stationF.png', function (error, image) {
            if (error) throw error;
            map.addImage('staion-iconD', image);
            map.addLayer({
                // "id": "stationLayerL",
                "id": "stationLayerDL",
                "type": "symbol",
                "source": 'stopsSource',
                "layout": {
                    "icon-image": "staion-iconD",
                    "icon-size": 0.5,
                    "visibility": "none"
                },
                filter: ["in", "stopType", "枢纽站", "集散站"]
            });
        });

        // 热力图
        map.addLayer({
            "id": "stopHeatLayer",
            "type": "heatmap",
            "source": "stopsSource",
            "layout": {
                "visibility": "none"
            },
            "paint": {
                "heatmap-radius": 30,
                "heatmap-weight": {
                    "property": "mag",
                    "stops": [[0, 0], [10, 1]]
                },
                "heatmap-intensity": 0.2,
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(0, 0, 255, 0)", 0.1, "#6184ec", 0.3, "#1ee2e2", 0.5, "#55f155", 0.7, "#f7f71a", 1, "#f93a3a"
                ],
                "heatmap-opacity": 0.7
            }
        });
    })
}

// 中心城区面
function addCenter() {
    $.when(getJson(conf_center_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
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
    })
}

// 公交专用道
function addBuslane() {
    $.when(getJson(conf_buslane_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('busLaneSource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'busLaneLayer',
            'type': 'line',
            'source': 'busLaneSource',
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": "#F9F871",
                "line-opacity": 1,
                "line-width": 2
            }
        });
    });
}

// 古城区公交线路
function addBusroute() {
    $.when(getJson(conf_busroute_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('busRouteSource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'busRouteLayer',
            'type': 'line',
            'source': 'busRouteSource',
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": "#7BE99E",
                "line-opacity": 1,
                "line-width": 2
            }
        });
    });
}

// 苏州市城区面
function addSuzhoucity() {
    $.when(getJson(conf_district_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('citySource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'cityLayer',
            'type': 'fill',
            'source': 'citySource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'fill-color': '#8cb58c',
                'fill-opacity': 0.4
            }
        });
    })
}

// 古城区面
function addOldcity() {
    $.when(getJson(conf_oldcity_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('oldCitySource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'oldCityLayer',
            'type': 'fill',
            'source': 'oldCitySource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'fill-color': '#79ada9',
                'fill-opacity': 0.4
            }
        });
    })
}

// 中心城区面，站点覆盖
function addCoverCenter() {
    $.when(getJson(conf_cover_center_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('coverCenterSource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'coverCenterLayer',
            'type': 'fill',
            'source': 'coverCenterSource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'fill-color': '#79ada9',
                'fill-opacity': 0.4
            }
        });
    })
}

// 中心城区面，站点未覆盖情况
function addunCoverCenter() {
    $.when(getJson(conf_uncover_center_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('uncoverCenterSource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'uncoverCenterLayer',
            'type': 'fill',
            'source': 'uncoverCenterSource',
            'layout': {
                "visibility": "none"
            },
            'paint': {
                'fill-color': '#79ada9',
                'fill-opacity': 0.4
            }
        });
    })
}

// 展示用公交线网图层
function addBusroutes() {
    $.when(getJson(conf_busroutes_query)).then(function (data) {
        let gcjData = wgsToGcj(data);
        map.addSource('busRoutesSource', {
            'type': 'geojson',
            'data': gcjData
        });
        map.addLayer({
            'id': 'busRoutesLayer',
            'type': 'line',
            'source': 'busRoutesSource',
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": "#00A2D9",
                // "line-color": "#00B6D0",
                "line-opacity": 1,
                "line-width": 2
            }
        });
    });
}

// 请求公交线路数据，站点数据
function addSingleRoute(busLineName) {
    let routeUrl;
    let stationUrl;

    if (busLineName === "40") {
        routeUrl = './geojsonData/routeSample/40.json';
        stationUrl = './geojsonData/routeSample/40Station.json'
    } else {
        routeUrl = './geojsonData/routeSample/1.json';
        stationUrl = './geojsonData/routeSample/1Station.json'
    }

    // 测试用公交线路图层（自行处理的样例数据）
    $.when(getJson(routeUrl)).then(function (data) {
        routeInfoHtml(data);
        let gcjData = wgsToGcj(data);
        setBoundry(gcjData);

        if (map.getLayer("busSingleRouteLayer")) {
            map.getSource("busSingleRouteSource").setData(gcjData);
            layerVisibilityToggle('busSingleRouteLayer', 'visible');
        } else {
            map.addSource('busSingleRouteSource', {
                'type': 'geojson',
                'data': gcjData
            });
            map.addLayer({
                'id': 'busSingleRouteLayer',
                'type': 'line',
                'source': 'busSingleRouteSource',
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#00A2D9",
                    "line-opacity": 1,
                    "line-width": 2
                }
            });
        }

    });

    $.when(getJson(stationUrl)).then(function (data) {
        let gcjData = wgsToGcj(data);
        if (map.getLayer("busSingleStationLayer")) {
            map.getSource("busSingleStationSource").setData(gcjData);
            layerVisibilityToggle('busSingleStationLayer', 'visible');
        } else {
            map.addSource('busSingleStationSource', {
                'type': 'geojson',
                'data': gcjData
            });
            map.loadImage('./CSS/svg/bus-stationE.png', function (error, image) {
                if (error) throw error;
                map.addImage('route-station', image);
                map.addLayer({
                    "id": "busSingleStationLayer",
                    "type": "symbol",
                    "source": 'busSingleStationSource',
                    "layout": {
                        "icon-image": "route-station",
                        "icon-size": 0.5,
                        "visibility": "visible"
                    }
                });
            });
        }
    });
}

/*------------------------------*/

// 图层显示切换
function layerVisibilityToggle(layerName, checkValue) {
    if (map.getLayer(layerName)) {
        map.setLayoutProperty(layerName, 'visibility', checkValue);
    } else {
    }
}

//得到Json数据
function getJson(url) {
    return $.ajax({
        type: "get",
        url: url,
        async: false,
        dataType: "json",
        success: function (data) {
        }, error: function () {
        }
    });
}

// 关闭图层
function closeLayer() {
    layerList.forEach(function (value) {
        if (map.getLayer(value)) {
            layerVisibilityToggle(value, 'none');
        }
    });
    if (popup) {
        popup.remove();
    }
    if (marker) {
        map.removeMarkers();
    }
}

//marker光晕，目前只提供地图上点击点（ICON）展示的四色光晕[red,blue,orange,green]
function getDynamicIcon(feature, color) {
    map.removeMarkers();
    let el = document.createElement('div');
    el.style.zIndex = 120;
    let p = document.createElement('div');
    p.className = 'ring-point-marker';
    let p1 = document.createElement('div');
    p1.className = color + '-ring-point-inner1';
    let p2 = document.createElement('div');
    p2.className = color + '-ring-point-inner2';
    let p3 = document.createElement('div');
    p3.className = color + '-ring-point-inner3';
    p.appendChild(p1);
    p.appendChild(p2);
    p.appendChild(p3);
    el.appendChild(p);
    marker = new minemap.Marker(el, {offset: [-30, -30]})
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
}


// 缩放至要素所在区域
function setBoundry(data) {
    map.setPitch(0);
    map.setZoom(13);
    let bbox = turf.bbox(data);
    let minX = bbox[0];
    let minY = bbox[1];
    let maxX = bbox[2];
    let maxY = bbox[3];
    let center = turf.center(data);
    let centerPoint = turf.getCoord(center);
    let arr = [[minX - 0.015, minY - 0.015], [maxX + 0.015, maxY + 0.015]];
    map.fitBounds(minemap.LngLatBounds.convert(arr));
    map.flyTo({
        center: [centerPoint[0] + 0.01, centerPoint[1]]
    })
}


