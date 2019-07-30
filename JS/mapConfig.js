export class mapConfig {
    map_layer_config = [
        {
            "layer_id": "stationLayer",
            "source_id": "stopsSource",
            "source_path": "conf_station_query",
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
            "layer_filter": null,
        }
    ]
}
