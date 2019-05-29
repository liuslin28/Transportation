var map;
var drawLayer;  //绘制后图层数据存储
var pointLayer; //点数据图层
var gptask;
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/widgets/Expand",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Compass",
    "esri/widgets/Sketch",
    "esri/tasks/Geoprocessor"], function (Map, MapView, GraphicsLayer, Graphic, Expand, Sketch, BasemapToggle, Compass,Geoprocessor) {
    //图层加载
    // pointLayer = new GraphicsLayer();
    // pointLayer.title = "pointData"
    // 工具栏绘制数据存储图层
    drawLayer = new GraphicsLayer();

    map = new Map({
        basemap: "streets-night-vector",
        // basemap: "osm",
        layers: [drawLayer],
        portalItem: {
            id: "8dda0e7b5e2d4fafa80132d59122268c"  // WGS84 Streets Vector webmap
        }
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 12,
        center: [120.6105, 31.31801] // longitude, latitude
    });

    //--------------------------------------------------------------------------

    view.ui.remove("attribution");//移除底部ESRI logo
    // 以下代码有bug
    // 工具栏Sketch,现在为底图切换
    const mapSketch = new Sketch({
        nextBasemap: "osm", // 待更改
        // layer: drawLayer,
        view: view
    });
    // view.ui.add(mapSketch, "top-right");
    const bgExpand = new Expand({ // 待更改
        view: view,
        content: mapSketch,
        expandIconClass: "esri-icon-collection",
        collapseTooltip: mapSketch
        // autoCollapse: true
    });
    view.ui.add(bgExpand, "top-left");


    //指北针Compass,现在为工具栏
    const mapCompass = new Compass({
        layer: drawLayer,
        view: view
    });
    view.ui.add(mapCompass, "top-right");

    //底图切换BasemapToggle，现在为指北针
    const mapToggle = new BasemapToggle({
        //     // 2 - Set properties
        view: view // view that provides access to the map's 'topo' basemap
        //     nextBasemap: "osm" // allows for toggling to the 'hybrid' basemap
    });
    view.ui.add(mapToggle, "top-left");
    //
    // const bgExpand = new Expand({
    //     view: view,
    //     content: mapmapToggle
    // });
    // view.ui.add(bgExpand, "top-left");

    // mapToggle.on('toggle', function(event){
    //     console.log("current basemap title: ", event.current.title);
    //     console.log("previous basemap title: ", event.previous.title);
    // });
    //--------------------------------------------------------------------------


    gptask = new Geoprocessor("https://localhost:6443/arcgis/rest/services/test/toLineAsynchronous/GPServer/toLineAsynchronous%20");

    gptask.outSpatialReference = {
        // autocasts as new SpatialReference()
        wkid: 4326
    };

});

// 正在测试
function testGPAsynchronous() {
    // 设置输入参数
    var features = [
        { "type":"Feature",
            "id":0,
            "attributes": {
                "FID": 0,
                "stop_id": "b47888e6-edbf-4210-8de2-5851d9578c33",
                "stop_name": "蠡口中学"
            },
            "geometry": {
                "type":"Point",
                "coordinates":[120.61614990234,31.406209945678999]

            },
            "properties":{
                "id":0
            }
        },
        { "type":"Feature",
            "id":1,
            "attributes": {
                "FID": 1,
                "stop_id": "d0d98553-52ff-4335-ae7d-9a7457481eca",
                "stop_name": "蠡口中学"
            },
            "geometry": {
                "type":"Point",
                "coordinates":[120.6192779541,31.406789779663001]

            },
            "properties":{
                "id":1
            }
        }
    ];


    var json={
        "displayFieldName": "",
        "fieldAliases": {
            "FID": "FID",
            "Id": "Id"
        },
        "geometryType": "esriGeometryPoint",
        "spatialReference": {
            "wkid": 4326
        },
        "fields": [
            {
                "name": "FID",
                "type": "esriFieldTypeOID",
                "alias": "FID"
            },
            {
                "name": "Id",
                "type": "esriFieldTypeInteger",
                "alias": "Id"
            }
        ],
        "features": [
            {
                "attributes": {
                    "FID": 0,
                    "Id": 0
                },
                "geometry": {
                    "x": 120.61614990234,
                    "y": 31.406209945678999
                }
            },
            {
                "attributes": {
                    "FID": 1,
                    "Id": 0
                },
                "geometry": {
                    "x": 120.6192779541,
                    "y": 31.406789779663001
                }
            }
        ]
    }


    var inputGraphicContainer = [];
    require(["esri/geometry/Point", "esri/tasks/Geoprocessor", "esri/Graphic", "esri/tasks/support/FeatureSet","esri/layers/MapImageLayer"
    ], function (MapImageLayer, Point, Geoprocessor, Graphic, FeatureSet) {

        var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [255, 0, 0],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2
            }
        };
        for (var i = 0; i < json.features.length; i++) {
            console.log(json.features[i].geometry.x)
            var point = new Point({
                longitude: json.features[i].geometry.x,
                latitude: json.features[i].geometry.y
            });

            var inputGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            inputGraphicContainer.push(inputGraphic);
        }
        var pointFeatureSet = new FeatureSet();
        pointFeatureSet.features = inputGraphicContainer;

        var gpParams = {stops: pointFeatureSet};
        console.log(gpParams)
        console.log(gptask)

        gptask.submitJob(gpParams).then(statusCallback, completeCallback);

        function statusCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
        }

        function completeCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
            lineSymbol = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [226, 119, 40],
                width: 4
            };
            var resultLayer = gptask.getResultMapImageLayer(jobInfo.jobId);
            resultLayer.opacity = 0.7;
            resultLayer.title = "HotspotLayer";

            // add the result layer to the map
            map.layers.add(resultLayer);

        }
    });
}


// 测试中
function bufferGPTool() {
    var pointFeatureSet;
    var polygonFeatureSet;
    var testPointData;
    var aPoint = {
        "displayFieldName" : "",
        "fieldAliases" : {
            "FID" : "FID",
        },
        "geometryType" : "esriGeometryPoint",
        "spatialReference" : {
            "wkid" : 4326,
            "latestWkid" : 4326
        },
        "fields" : [
            {
                "name" : "FID",
                "type" : "esriFieldTypeOID",
                "alias" : "FID"
            }
        ],
        "features" : []
    };

    var Dis = {
        "distance": 500,
        "units": "esriMeters"
    };


    require(["esri/geometry/Point",
        "esri/geometry/SpatialReference",
        "esri/Graphic",
        "esri/tasks/support/FeatureSet",
        "esri/tasks/Geoprocessor",
        "esri/layers/MapImageLayer"], function(SpatialReference, Graphic, FeatureSet, Point, Geoprocessor, MapImageLayer) {

        // 点样式
        var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [255, 0, 0],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2
            }
        };

        // 面样式
        var fillSymbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [227, 139, 79, 0.8],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 1
            }
        };

        // 设置输入参数(公交点
        // 数据格式要求： 小数点6位，经纬度范围
        $.ajax({
            url:"./jsonData/site.json",
            type:"GET",
            success: function (data) {
                var pointData = data['Site'];
                var pointFeatures = [];

                for(var i = 0; i < pointData.length; i++) {
                    var point = new Point({
                        longitude: pointData[i].fslon,
                        latitude: pointData[i].fslat
                    });

                    var inputGraphic = new Graphic({
                        geometry: point,
                        symbol: markerSymbol
                    });
                    pointFeatures.push(inputGraphic);
                }
                var pointFeatureSet = new FeatureSet();
                pointFeatureSet.features = pointFeatures;


                // 设置输入参数(中心城区
                $.ajax({
                    url:'./jsonData/centercity.json',
                    type:'GET',
                    success: function (data) {

                        // 格式转换
                        ringsData = (((data['features'])[0])['geometry'])['rings'];
                        var polygonData = {
                            type: "polygon", // autocasts as new Polygon()
                            rings: ringsData
                        };
                        var polygonGraphic = new Graphic({
                            geometry: polygonData,
                            symbol: fillSymbol
                        });
                        // 设置输入参数（多边形
                        polygonFeatureSet = new FeatureSet();
                        polygonFeatureSet.features = polygonGraphic;
                        // polygonFeatureSet.spatialReference = map.spatialReference;

                        var gptask = new Geoprocessor("https://localhost:6443/arcgis/rest/services/test/coverTest/GPServer/coverTool");
                        gptask.outSpatialReference = {
                            wkid: 4326
                        };

                        var gpParams = {
                            "stops": pointFeatureSet,
                            "Dis": Dis,
                            "city": polygonFeatureSet
                        };
                        console.log(gpParams)

                        gptask.submitJob(gpParams).then(statusCallback)

                        function statusCallback(jobInfo) {
                            console.log(jobInfo.jobStatus);
                            console.log(jobInfo.messages);
                        }
                        function errBack() {
                            console.log("gp error: ", error);
                        }

                        function completeCallback(jobInfo) {
                            // 结果图加载
                            var imageParams = new MapImageLayer();
                            // imageParams.imageSpatialReference = map.spatialReference;
                            gptask.getResultMapImageLayer(jobInfo.jobId, null, null, function (gpLayer) {
                                // gpLayer.setColor(new Color([232,104,80,0.25]))
                                gpLayer.setOpacity(0.5);
                                map.addLayer(gpLayer);
                                console.log(gpLayer)
                            });
                            // 面积求算
                            gptask.getResultData(jobInfo.jobId,"bufferOutput").then(function (value) {
                                areaData = value.value.features[0].attributes['coverArea']
                                alert("面积为："+areaData);
                            })
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
        $.ajax({
            url:'./jsonData/stops.json',
            type:'GET',
            success: function (data) {
                testPointData = data;
                // 设置输入参数（多边形
                pointFeatureSet = new FeatureSet(testPointData);
                // polygonFeatureSet.features = centercityfeatures;
                pointFeatureSet.spatialReference = map.spatialReference;



            },
            error: function (error) {
                alert(error)
            }
        });


    });

}

// 点图层加载
function addPointData() {

    require(["esri/layers/GraphicsLayer","esri/Graphic"],function(GraphicsLayer, Graphic){
        pointLayer = new GraphicsLayer();
        pointLayer.title = "pointData";
        map.layers.add(pointLayer);


        $.ajax({
            url: "./jsonData/site.json",
            type: "GET",
            success: function (data) {
                var pointData = data['Site'];
                // Create a symbol for drawing the point
                var markerSymbol = {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40],
                    size: "2px",
                    outline: {
                        color: [255, 255, 0],
                        width: 0.5  // points
                    }
                };

                for (var i = 0; i < pointData.length; i++) {
                    let point = {
                        type: "point",
                        longitude: pointData[i].fslon,
                        latitude: pointData[i].fslat
                    };
                    let pointGraphic = new Graphic({
                        geometry: point,
                        symbol: markerSymbol
                    });
                    pointLayer.add(pointGraphic);
                }
            },
            error: function (error) {
                alert(error)
            }
        });
    });
}

function addPolygonData() {
    var featureSet = new esri.tasks.FeatureSet(dz);
    var featureCollection = {
        layerDefinition: layerDefinition,
        featureSet: featureSet
    };
    var featurelayer = new esri.layer.FeatureLayer(featureCollection);
}

// 删除地图要素
function cleanup() {
    // remove the geoprocessing result and point layer from the map
    map.layers.forEach(function (layer, i) {
        if (layer.title === "pointData") {
            map.layers.remove(layer);
        }
    });
};
