// 图层显示切换
$('.layerWrapper-check-input').click(function (e) {
    let inputTarget = e.target;
    let layerName = inputTarget.name;
    let checkValue = inputTarget.checked;
    let value;
    if (checkValue) {
        value = 'visible';
    } else {
        value = 'none';
    }
    layerVisibilityToggle(layerName, value)
});

/*------------------------------*/
// 图层列表显示切换
$('#layer-click').click(function () {
    $('.layerWrapper').slideToggle();
    $('#layer-click').toggleClass("navWrapper-nav-li-active");
});

$('.layerWrapper-angle').click(function () {
    $('.layerWrapper').slideToggle();
    $('#layer-click').toggleClass("navWrapper-nav-li-active");
});
/*------------------------------*/
// navWrapper-nav 导航栏
// 主页
$('#home-click').click(function () {
    $('#simulate-dataWrapper').hide();
    $('#info-dataWrapper').hide();
    $('.infoWrapper').hide();
    // 展示图例展示栏
    $('.legendWrapper').show();
    // 隐藏线路信息展示栏
    $('.routeInfoWrapper').hide();
    closeLayer();
    layerVisibilityToggle("stationLayerB", 'visible');
    layerVisibilityToggle("stationLayerC", 'visible');
    layerVisibilityToggle("stationLayerD", 'visible');
    layerVisibilityToggle("terminalLayer", 'visible');
    changeStationLayer('true');
});

// 交通信息列表显示切换
$('#info-click').click(function () {
    $('#simulate-dataWrapper').hide();
    $('#info-dataWrapper').slideToggle();
});

// 交通仿真列表显示切换
$('#simulate-click').click(function () {
    $('#info-dataWrapper').hide();
    $('#simulate-dataWrapper').slideToggle();
});

/*------------------------------*/
// 点击屏幕，隐藏右侧菜单栏
$('.mapWrapper').click(function () {
    $('.dataWrapper').hide();
});


// 交通信息页面 与 infoWrapper联动
$('.dataWrapper-info-li').click(function (e) {
    $('.dataWrapper').hide();
    // 隐藏线路信息展示栏
    $('.routeInfoWrapper').hide();
    let liTarget = e.target;
    let liId = liTarget.id;
    console.log(liId);
    // let wrapperTargert = $('.infoWrapper');

    // infoWrapper显示
    $('.infoWrapper').show();
    $('.infoWrapper-div').hide();
    $('.' + liId).show();

    // 服务操作
    switch (liId) {
        case 'info-connectivity':
            // bufferGPTool();
            break;
        default:
            break;
    }

    // 关闭其他图层
    closeLayer();
    // 关闭图例
    $('.legendWrapper').hide();
    // 图层显示

    let showLayer = null;
    switch (liId) {
        case 'info-station':
            showLayer = 'stopHeatLayer';
            break;
        case 'info-cover':
            showLayer = 'coverCenterLayer';
            break;
        case 'info-route':
            showLayer = 'busRoutesLayer';
            break;
        case 'info-buslane':
            showLayer = 'busLaneLayer';
            break;
        default:
            break;
    }
    if(showLayer) {
        layerVisibilityToggle(showLayer, 'visible');
    }
    changeStationLayer('false');
});
