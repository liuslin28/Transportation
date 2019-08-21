let icon_config = [
    {
        "icon_path": './CSS/svg/bus-stationA.png',
        "icon_id": 'terminal-icon'
    },
    {
        "icon_path": './CSS/svg/bus-stationB.png',
        "icon_id": 'staion-iconB'
    },
    {
        "icon_path": './CSS/svg/bus-stationC.png',
        "icon_id": 'staion-iconC'
    },
    {
        "icon_path": './CSS/svg/bus-stationD.png',
        "icon_id": 'staion-iconD'
    },
    {
        "icon_path": './CSS/svg/bus-stationE.png',
        "icon_id": 'route-station'
    }
];


let source_layer_config = [
    {
        "source_id": "stationSource",
        "source_path": "./geojsonData/stopsPoint2.json",
        "source_title": "公交站点",
        "source_type": "geojson"
    },
    {
        "source_id": "centerSource",
        "source_path": "./geojsonData/centerPolygon.json",
        "source_title": "中心建成区",
        "source_type": "geojson"
    },
    {
        "source_id": "busLaneSource",
        "source_path": "./geojsonData/busLane.json",
        "source_title": "公交专用道",
        "source_type": "geojson"
    },
    {
        "source_id": "busRouteSource",
        "source_path": "./geojsonData/busRoute.json",
        "source_title": "古城区公交线路",
        "source_type": "geojson"
    },
    {
        "source_id": "citySource",
        "source_path": "./geojsonData/suzhouDistrict.json",
        "source_title": "苏州市城区面",
        "source_type": "geojson"
    },
    {
        "source_id": "oldCitySource",
        "source_path": "./geojsonData/oldCity.json",
        "source_title": "古城区面",
        "source_type": "geojson"
    },
    {
        "source_id": "busRoutesSource",
        "source_path": "./geojsonData/busRoutes.json",
        "source_title": "展示用公交线网图层",
        "source_type": "geojson"
    },
    {
        "source_id": "coverCenterSource",
        "source_path": "./geojsonData/cover/centercity_C_unP.json",
        "source_title": "中心城区面，站点覆盖",
        "source_type": "geojson"
    },
    {
        "source_id": "uncoverCenterSource",
        "source_path": "./geojsonData/cover/centercity_E_unP.json",
        "source_title": "中心城区面，站点未覆盖情况",
        "source_type": "geojson"
    },
    {
        "source_id": "busSingleRouteSource",
        "source_path": "",
        "source_title": "单条公交线路",
        "source_type": "geojson"
    },
    {
        "source_id": "busSingleStationSource",
        "source_path": "",
        "source_title": "单条公交线路站点",
        "source_type": "geojson"
    },
    {
        "source_id": "roadFrequencySource",
        "source_path": "",
        "source_title": "线网连通性图层",
        "source_type": "geojson"
    }
];


let map_layer_config = [
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayer",
        "source_id": "stationSource",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
            'circle-radius': {
                'base': 1.5,
                'stops': [[5, 2], [18, 4]]
            },
            'circle-color': "#00A2D9",
            'circle-blur': 0.1,
            'circle-opacity': 0.6
        },
        "layer_filter": ["in", "stopType", "一般停靠站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerA",
        "source_id": "stationSource",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
            'circle-radius': {
                'base': 1.5,
                'stops': [[5, 2], [18, 4]]
            },
            'circle-color': "rgb(226, 83, 101)",
            'circle-blur': 0.1,
            'circle-opacity': 0.6
        },
        "layer_filter": ["in", "stopType", "首末站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerB",
        "source_id": "stationSource",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "visible"
        },
        "layer_paint": {
            'circle-radius': {
                'base': 1.5,
                'stops': [[5, 2], [18, 4]]
            },
            'circle-color': "#00A2D9",      //填充圆形的颜色
            'circle-blur': 0.1,              //模糊程度，默认0
            'circle-opacity': 0.6           //透明度，默认为1
        },
        "layer_filter": ["in", "stopType", "一般停靠站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerC",
        "source_id": "stationSource",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "visible"
        },
        "layer_paint": {
            'circle-radius': {
                'base': 1.5,
                'stops': [[5, 2], [18, 4]]
            },
            'circle-color': "#E2AF32",
            'circle-blur': 0.1,
            'circle-opacity': 0.6
        },
        "layer_filter": ["in", "stopType", "换乘站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerD",
        "source_id": "stationSource",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "visible"
        },
        "layer_paint": {
            'circle-radius': {
                'base': 1.5,
                'stops': [[5, 2], [18, 4]]
            },
            'circle-color': "#25a982",
            'circle-blur': 0.1,
            'circle-opacity': 0.6
        },
        "layer_filter": ["in", "stopType", "枢纽站", "集散站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "terminalLayer",
        "source_id": "stationSource",
        "layer_type": "symbol",
        "layer_layout": {
            "icon-image": "terminal-icon",
            "icon-size": 0.5
        },
        "layer_paint": {},
        "layer_filter": ["in", "stopType", "首末站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerBL",
        "source_id": "stationSource",
        "layer_type": "symbol",
        "layer_layout": {
            "icon-image": "staion-iconB",
            "icon-size": 0.5,
            "visibility": "none"
        },
        "layer_paint": {},
        "layer_filter": ["in", "stopType", "一般停靠站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerCL",
        "source_id": "stationSource",
        "layer_type": "symbol",
        "layer_layout": {
            "icon-image": "staion-iconC",
            "icon-size": 0.5,
            "visibility": "none"
        },
        "layer_paint": {},
        "layer_filter": ["in", "stopType", "换乘站"]
    },
    {
        "layer_title": "公交站点",
        "layer_id": "stationLayerDL",
        "source_id": "stationSource",
        "layer_type": "symbol",
        "layer_layout": {
            "icon-image": "staion-iconD",
            "icon-size": 0.5,
            "visibility": "none"
        },
        "layer_paint": {},
        "layer_filter": ["in", "stopType", "枢纽站", "集散站"]
    },
    {
        "layer_title": "公交站点热力图",
        "layer_id": "stationHeatLayer",
        "source_id": "stationSource",
        "layer_type": "heatmap",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
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
        },
        "layer_filter": null
    },
    {
        "layer_title": "中心城区面",
        "layer_id": "centerLayer",
        "source_id": "centerSource",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
            'fill-color': '#79ada9',
            'fill-opacity': 0.2
        },
        "layer_filter": null
    },
    {
        "layer_title": "公交专用道",
        "layer_id": "busLaneLayer",
        "source_id": "busLaneSource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "none"
        },
        "layer_paint": {
            "line-color": "#F9F871",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": null
    },
    {
        "layer_title": "古城区公交线路",
        "layer_id": "busRouteLayer",
        "source_id": "busRouteSource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "none"
        },
        "layer_paint": {
            "line-color": "#7BE99E",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": null
    },
    {
        "layer_title": "苏州市城区面",
        "layer_id": "cityLayer",
        "source_id": "citySource",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"

        },
        "layer_paint": {
            'fill-color': '#8cb58c',
            'fill-opacity': 0.4
        },
        "layer_filter": null
    },
    {
        "layer_title": "古城区面",
        "layer_id": "oldCityLayer",
        "source_id": "oldCitySource",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"

        },
        "layer_paint": {
            'fill-color': '#79ada9',
            'fill-opacity': 0.4
        },
        "layer_filter": null
    },
    {
        "layer_title": "中心城区面，站点覆盖",
        "layer_id": "coverCenterLayer",
        "source_id": "coverCenterSource",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"

        },
        "layer_paint": {
            'fill-color': '#79ada9',
            'fill-opacity': 0.4
        },
        "layer_filter": null
    },
    {
        "layer_title": "中心城区面，站点未覆盖情况",
        "layer_id": "uncoverCenterLayer",
        "source_id": "uncoverCenterSource",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"

        },
        "layer_paint": {
            'fill-color': '#79ada9',
            'fill-opacity': 0.4
        },
        "layer_filter": null
    },
    {
        "layer_title": "展示用公交线网图层",
        "layer_id": "busRoutesLayer",
        "source_id": "busRoutesSource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "none"
        },
        "layer_paint": {
            "line-color": "#00A2D9",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": null
    },
    {
        "layer_title": "单条公交线路",
        "layer_id": "busSingleRouteLayer",
        "source_id": "busSingleRouteSource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            "line-color": "#00A2D9",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": null
    },
    {
        "layer_title": "单条公交线路站点",
        "layer_id": "busSingleStationLayer",
        "source_id": "busSingleStationSource",
        "layer_type": "symbol",
        "layer_layout": {
            "icon-image": "route-station",
            "icon-size": 0.5,
            "visibility": "visible"
        },
        "layer_paint": {},
        "layer_filter": null
    },
    {
        "layer_title": "线网连通性图层",
        "layer_id": "roadFrequencyLayer0",
        "source_id": "roadFrequencySource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            "line-color": "#474747",
            // "line-color": "#7E5887",
            "line-opacity": 1,
            "line-width": 2.5
        },
        "layer_filter": ["==", "FREQUENCY", 0]
    },
    {
        "layer_title": "线网连通性图层",
        "layer_id": "roadFrequencyLayer1",
        "source_id": "roadFrequencySource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            // "line-color": "#6C5B7B",
            "line-color": "#1575A8",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": ["all", [">", "FREQUENCY", 0], ["<=", "FREQUENCY", 1]]
    },
    {
        "layer_title": "线网连通性图层",
        "layer_id": "roadFrequencyLayer2",
        "source_id": "roadFrequencySource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            // "line-color": "#C06C84",
            "line-color": "#25A982",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": ["all", [">", "FREQUENCY", 1], ["<=", "FREQUENCY", 2]]
    },
    {
        "layer_title": "线网连通性图层",
        "layer_id": "roadFrequencyLayer3",
        "source_id": "roadFrequencySource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            // "line-color": "#F67280",
            "line-color": "#E2AF32",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": ["all", [">", "FREQUENCY", 2], ["<=", "FREQUENCY", 5]]
    },
    {
        "layer_title": "线网连通性图层",
        "layer_id": "roadFrequencyLayer4",
        "source_id": "roadFrequencySource",
        "layer_type": "line",
        "layer_layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "layer_paint": {
            // "line-color": "#F8B195",
            "line-color": "#E25365",
            "line-opacity": 1,
            "line-width": 2
        },
        "layer_filter": [">", "FREQUENCY", 5]
    },
    {
        "layer_title": "遮罩层",
        "layer_id": "maskLayer",
        "source_id": "",
        "layer_type": "background",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
            'background-color': '#000000',
            'background-opacity': 0.5
        },
        "layer_filter": null
    }
];

