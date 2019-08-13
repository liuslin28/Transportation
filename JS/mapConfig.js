let map_layer_config = [
    {
        "layer_title": "站点信息",
        "layer_id": "stationLayer",
        "source_id": "stopsSource",
        "source_path": "./geojsonData/stopsPoint.json",
        "layer_type": "circle",
        "layer_layout": {
            "visibility": "visible"
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
        "layer_filter": null,
        "zoom": 13,
        "pitch": 90,
        "center": [120.60, 31.30]
    },
    {
        "layer_title": "中心城区面",
        "layer_id": "centerLayer",
        "source_id": "centerSource",
        "source_path": "./geojsonData/centerPolygon.json",
        "layer_type": "fill",
        "layer_layout": {
            "visibility": "none"
        },
        "layer_paint": {
            'fill-color': '#79ada9',
            'fill-opacity': 0.2
        },
        "layer_filter": null,
        "zoom": 13,
        "pitch": 90,
        "center": [120.60, 31.30]
    }
];

