var map, stationInfoPopup, stationPopup, frePopup, marker;//地图Map，地图POPUP框，地图中marker点
var edit;
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
let mousemoveIs = true; //地图鼠标移动实现是否开启

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

    stationInfoPopup = new minemap.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: [0, 0]
    });
    frePopup = new minemap.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: [0, 0]
    });
    stationPopup = new minemap.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: [0, 0]
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

                    // 图例
                    $('#legendWrapper-station').show();
                    $('#legendWrapper-connectivity').hide();
                    $('.legendWrapper').show();

                    map.resize();
                    mapFly();
                }
            } else {
                clearInterval(t);
            }
        }, 1000);
        addMapIcon();
        addMapSource();
    });

    setTimeout(function () {
        // directTransferRate();
        // stopDensity();
        // networkComplex();
        // networkDistance();
        // nonLinear();
        // buslaneGPTool();
        // bufferGPTool();
        // busrouteGPTool();
        // stationDistance();
        // stationCheck();
    }, 10000);

    map.on("edit.undo", onEditUndo);
    map.on("edit.redo", onEditRedo);

    changeEvent('true');
    mapStationPop();
});

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
// 加载数据
function addMapIcon() {
    icon_config.forEach(function (value) {
        map.loadImage(value.icon_path, function (error, image) {
            if (error) throw error;
            map.addImage(value.icon_id, image);
        });
    });
}

function addMapSource() {
    source_layer_config.forEach(function (value) {
        $.when(getJson(value.source_path)).then(function (data) {
            let gcjData = wgsToGcj(data);
            map.addSource(value.source_id, {
                'type': value.source_type,
                'data': gcjData
            });
            addMapLayer(value.source_id);
        });
    });
}

function addMapLayer(sourceId) {
    map_layer_config.forEach(function (value) {
        if (value.source_id === sourceId) {
            if (map.getLayer(value.layer_id)) {
            } else {
                if (value.layer_filter) {
                    map.addLayer({
                        'id': value.layer_id,
                        'type': value.layer_type,
                        'source': value.source_id,
                        "layout": value.layer_layout,
                        "paint": value.layer_paint,
                        filter: value.layer_filter
                    });
                } else {
                    map.addLayer({
                        'id': value.layer_id,
                        'type': value.layer_type,
                        'source': value.source_id,
                        "layout": value.layer_layout,
                        "paint": value.layer_paint
                    });
                }
            }
        } else {
            return false;
        }
    })
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

    routeInfoHtml(routeUrl);
    // 测试用公交线路图层（自行处理的样例数据）
    $.when(getJson(routeUrl)).then(function (data) {
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
            addMapLayer("busSingleRouteSource");
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
            addMapLayer('busSingleStationSource');
        }
    });
}

//_____________________________________________________
// 站点图层hover事件，弹出框
function mapStationHover(e) {
    if (e) {

        let features = map.queryRenderedFeatures([[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]], {layers: ['stationLayerB', 'stationLayerC', 'stationLayerD', 'stationLayerBL', 'stationLayerCL', 'stationLayerDL', 'terminalLayer']});
        if (features.length === 0) {
            stationPopup.remove();
        } else {
            let feature = features[0];
            let popupLatLng = [Number(feature.geometry.coordinates[0]), Number(feature.geometry.coordinates[1])];
            let infoHtml = stationHtml(feature);

            stationPopup.setLngLat(popupLatLng)
                .setHTML(infoHtml)
                .addTo(map);
        }
    }
}

// 站点图层点击事件，弹出框
function mapStationPop(e) {
    if (e) {
        // 点击地图，同步清除marker
        if (marker) {
            map.removeMarkers();
        }
        stationPopup.remove();

        let features = map.queryRenderedFeatures([[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]], {layers: ['stationLayerB', 'stationLayerC', 'stationLayerD', 'stationLayerBL', 'stationLayerCL', 'stationLayerDL', 'terminalLayer']});
        if (features.length === 0) {
            stationInfoPopup.remove();
            if (!mousemoveIs) {
                map.on("mousemove", mapStationHover);
                mousemoveIs = true;
            }

        } else {
            map.off("mousemove", mapStationHover);
            mousemoveIs = false;

            /**
             * 如果在点击的位置有多个响应类型的点或者线，会获取一个feature的数组,取第一个要素显示
             */
            let feature = features[0];
            let popupLatLng = [Number(feature.geometry.coordinates[0]), Number(feature.geometry.coordinates[1])];
            let infoHtml = stationInfoHtml(feature);

            getDynamicIcon(feature, pointApertureColors[1]);
            stationInfoPopup.setLngLat(popupLatLng)
                .setHTML(infoHtml)
                .addTo(map);
            pointCenterFly(feature.geometry.coordinates);
            listenStationInfo();
        }
    }
}

// 监听popup弹出框的click事件
function listenStationInfo() {
    $('.popup-station-list').on('click', function (e) {
        // 关闭其他图层
        closeLayer();
        changeEvent('false');

        // 关闭图例
        $('.legendWrapper').hide();

        let inputTarget = e.target;
        let busLineName = inputTarget.innerText;
        console.log(busLineName);
        addSingleRoute(busLineName);
    });
    $('.minemap-popup-close-button').on('click', function () {
        if (marker) {
            map.removeMarkers();
        }
        if (!mousemoveIs) {
            map.on("mousemove", mapStationHover);
            mousemoveIs = true;
        }
    });
}

// 线网连通性图层点击事件，弹出框
function mapFrePop(e) {
    if (e) {
        let features = map.queryRenderedFeatures([[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]], {layers: ['roadFrequencyLayer1', 'roadFrequencyLayer2', 'roadFrequencyLayer3', 'roadFrequencyLayer4']});

        if (!features.length) {
            frePopup.remove();
            return;
        }

        let feature = features[0];
        let popupLatLng = feature.geometry.coordinates[0];
        let infoHtml = frequencyHtml(feature);
        frePopup.setLngLat(popupLatLng)
            .setHTML(infoHtml)
            .addTo(map);
        pointCenterFly(feature.geometry.coordinates[0]);
    }
}

//_____________________________________________________

// 根据缩放级别显示站点图层
function changeZoom() {
    let mapZoom = map.getZoom();
    if (mapZoom > 13) {
        layerVisibilityToggle("stationLayerB", "none");
        layerVisibilityToggle("stationLayerC", "none");
        layerVisibilityToggle("stationLayerD", "none");
        layerVisibilityToggle("stationLayerBL", "visible");
        layerVisibilityToggle("stationLayerCL", "visible");
        layerVisibilityToggle("stationLayerDL", "visible");
    } else {
        layerVisibilityToggle("stationLayerB", "visible");
        layerVisibilityToggle("stationLayerC", "visible");
        layerVisibilityToggle("stationLayerD", "visible");
        layerVisibilityToggle("stationLayerBL", "none");
        layerVisibilityToggle("stationLayerCL", "none");
        layerVisibilityToggle("stationLayerDL", "none");
    }
}

// 图层事件
function changeEvent(layerChange) {
    if (layerChange === 'true') {
        // 开启首页地图事件
        map.on("zoomend", changeZoom);
        map.on("click", mapStationPop);
        map.on("mousemove", mapStationHover)
        mousemoveIs = true;

    } else {
        // 关闭所有地图绑定事件
        map.off("zoomend", changeZoom);
        map.off("click", mapStationPop);
        map.off("click", mapFrePop);
        map.off("mousemove", mapStationHover);
        mousemoveIs = false;
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
                    url: "./esrijsonData/esriroadOldcityUnp.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);
                        buslaneFeatureSet.spatialReference = new SpatialReference({wkid: 4326});

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/lineLength");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "line": buslaneFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output_length").then(function (value) {
                                let lineLength = (value.value.features)[0].attributes.SUM_Shape_Length;
                                // 米=>千米
                                busLaneLength = (lineLength / 1000).toFixed(2);
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
            url: "./esrijsonData/esriroutesOldcityUnp.json",
            type: "GET",
            success: function (data) {
                let buslineFeatureSet = new esri.tasks.FeatureSet(data);
                buslineFeatureSet.spatialReference = new SpatialReference({wkid: 4326});
                $.ajax({
                    url: "./esrijsonData/esriroadOldcityUnp.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/lineLength/GPServer/lineLength");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "line": buslineFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output_length").then(function (value) {
                                let lineLength = (value.value.features)[0].attributes.SUM_Shape_Length;
                                // 米=>千米
                                busLineLength = (lineLength / 1000).toFixed(2);
                                console.log(busLineLength);
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
function routeGPTool(data) {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        let linePath = (data.features)[0].geometry.coordinates;
        let lineFeature = {
            "displayFieldName": "",
            "fieldAliases": {
                "FID": "FID"
            },
            "geometryType": "esriGeometryPolyline",
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
            "features": [
                {
                    "attributes": {
                        "FID": 0
                    },
                    "geometry": {
                        "paths": [
                            linePath
                        ]
                    }
                }
            ]
        };
        let buslineFeatureSet = new esri.tasks.FeatureSet(lineFeature);
        buslineFeatureSet.spatialReference = new SpatialReference({wkid: 4326});
        $.ajax({
            url: "./esrijsonData/esribusLaneSUnp.json",
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
                gptask.on("get-result-data-complete", displayResults);

                // 结果图加载
                function completeCallback(jobInfo) {
                    // 长度求算
                    gptask.getResultData(jobInfo.jobId, "output_length").then(function (value) {
                        let lineLength = (value.value.features)[0].attributes.SUM_Shape_Length;
                        // 米=>千米,保留2位小数
                        lineLength = (lineLength / 1000).toFixed(2);

                        $('#index-laneLength').text(lineLength);
                        $('.routeInfoWrapper').show();
                    });
                }
            }
        })
    });
}

// 路段重复系数
function roadFrequencyGPTool() {
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor"], function (SpatialReference, Graphic, Geoprocessor) {
        $.ajax({
            url: "./esrijsonData/esriroutesOldcityUnp.json",
            type: "GET",
            success: function (data) {
                let buslineFeatureSet = new esri.tasks.FeatureSet(data);
                buslineFeatureSet.spatialReference = new SpatialReference({wkid: 4326});
                $.ajax({
                    url: "./esrijsonData/esriroadOldcityP.json",
                    type: "GET",
                    success: function (data) {
                        let roadFeatureSet = new esri.tasks.FeatureSet(data);

                        let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/roadFrequency/GPServer/roadFrequency");
                        let gpParams = {
                            "road": roadFeatureSet,
                            "road2": roadFeatureSet,
                            "routes": buslineFeatureSet
                        };
                        gptask.submitJob(gpParams, completeCallback, statusCallback);

                        // 结果图加载
                        function completeCallback(jobInfo) {
                            // 长度求算
                            gptask.getResultData(jobInfo.jobId, "output").then(function (value) {
                                let frequencyResult = value.value.features;
                                let frequencyJson = transLineJson(frequencyResult);
                                connectivityChart(frequencyJson);
                                let gcjData = wgsToGcj(frequencyJson);
                                if (gcjData) {
                                    if (map.getLayer('roadFrequencyLayer1')) {
                                        map.getSource('roadFrequencySource').setData(gcjData);
                                        layerVisibilityToggle("roadFrequencyLayer0", "visible");
                                        layerVisibilityToggle("roadFrequencyLayer1", "visible");
                                        layerVisibilityToggle("roadFrequencyLayer2", "visible");
                                        layerVisibilityToggle("roadFrequencyLayer3", "visible");
                                        layerVisibilityToggle("roadFrequencyLayer4", "visible");
                                    } else {
                                        map.addSource('roadFrequencySource', {
                                            'type': 'geojson',
                                            'data': gcjData
                                        });
                                        addMapLayer('roadFrequencySource');
                                    }
                                    map.on("click", mapFrePop);
                                    // 图层加载完成后加载图例
                                    $('#legendWrapper-station').hide();
                                    $('#legendWrapper-connectivity').show();
                                    $('.legendWrapper').show();
                                } else {
                                    console.log("结果加载出错了")
                                }
                            });
                        }
                    }
                })
            }
        })
    });
}

// 站点覆盖率
function stopBufferGP() {
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


    // 设置输入参数(公交点
    // 数据格式要求：小数点6位，经纬度范围
    require(["esri/SpatialReference", "esri/graphic", "esri/tasks/Geoprocessor" ,"esri/tasks/LinearUnit"], function (SpatialReference, Graphic, Geoprocessor, LinearUnit) {

        // gp参数
        let Dis = new LinearUnit();
        Dis.distance = 500;
        Dis.units = "esriMeters";

        $.ajax({
            url: "./geojsonData/stopsPoint.json",
            type: "GET",
            success: function (data) {
                let pointData = data['features'];

                let features = [];
                let i = 0;
                pointData.forEach(function (pointValue) {
                    i += 1;
                    let coordinateValue = (pointValue['geometry'])['coordinates'];
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

                // GP服务调用
                let gptask = new Geoprocessor("https://192.168.207.165:6443/arcgis/rest/services/GPTool/coverArea/GPServer/coverArea");
                let gpParams = {
                    "stops": pointFeatureSet,
                    "Dis1": Dis,
                    "Dis2": Dis,
                };
                gptask.submitJob(gpParams, completeCallback, statusCallback);

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
                        let outputData = ArcgisToGeojsonUtils.arcgisToGeoJSON(value.value);
                        let gcjData = wgsToGcj(outputData);

                        if (gcjData) {
                            // 切换数据源
                            map.getSource('coverCenterSource').setData(gcjData);
                            layerVisibilityToggle('coverCenterLayer', 'visible');
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
    });
}

function displayResults() {
    console.log(1)
}

// 运行状态显示
function statusCallback(jobInfo) {
    console.log(jobInfo.jobStatus);
    statusModel(jobInfo.jobStatus);
}

function statusModel(status) {
    switch (status) {
        case 'esriJobSubmitted':
            maskLayer('visible');
            $('.gpWaitWrapper').show();
            break;
        case 'esriJobSucceeded':
            maskLayer('none');
            $('.gpWaitWrapper').hide();
            break;
        case 'esriJobFailed':
            maskLayer('none');
            $('.gpWaitWrapper').hide();
            break;
        default:
            break;
    }
}

// 地图遮罩图层
function maskLayer(checkValue) {
    if (map.getLayer('maskLayer')) {
        layerVisibilityToggle('maskLayer', checkValue);
    } else {
        map.addLayer({
            type: 'background',
            id: 'maskLayer',
            paint: {
                'background-color': '#000000',
                'background-opacity': 0.5
            }
        });
    }
}

//_____________________________________________________
// Line的格式转换
function transLineJson(data) {
    let lineJson = {
        "type": "FeatureCollection",
        "features": []
    };
    data.map(function (value) {
        let lineCoordinate = (value.geometry.paths)[0];
        let lineAttribute = setFrequency(value.attributes);
        let lineFeature = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": lineCoordinate
            },
            "properties": lineAttribute
        };
        lineJson.features.push(lineFeature)
    });
    return lineJson;
}

//_____________________________________________________

function setFrequency(data) {
    if (data.FREQUENCY) {
        return data
    } else {
        data.FREQUENCY = 0;
        return data
    }
}

//_____________________________________________________

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

// 关闭图层,移除popup/marker
function closeLayer() {
    map_layer_config.forEach(function (value) {
        if (map.getLayer(value.layer_id)) {
            layerVisibilityToggle(value.layer_id, 'none');
        }
    });
    if (stationPopup) {
        stationPopup.remove();
    }
    if (frePopup) {
        frePopup.remove();
    }
    if (stationInfoPopup) {
        stationInfoPopup.remove();
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

