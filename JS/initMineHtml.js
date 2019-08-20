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
    $('#simulate-menuWrapper').hide();
    $('#info-menuWrapper').hide();
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
    $('#simulate-menuWrapper').hide();
    $('#info-menuWrapper').slideToggle();
});

// 交通仿真列表显示切换
$('#simulate-click').click(function () {
    $('#info-menuWrapper').hide();
    $('#simulate-menuWrapper').slideToggle();
});

/*------------------------------*/
// 点击屏幕，隐藏右侧菜单栏
$('.mapWrapper').click(function () {
    $('.menuWrapper').hide();
});


// 交通信息页面 与 infoWrapper联动
$('.menuWrapper-info-li').click(function (e) {
    // 隐藏菜单栏
    $('.menuWrapper').hide();
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

    // 关闭其他图层
    closeLayer();
    changeStationLayer('false');

    // 关闭图例
    $('.legendWrapper').hide();

    // 页面切换的操作
    switch (liId) {
        case 'info-station':
            layerVisibilityToggle('stationHeatLayer', 'visible');
            break;
        case 'info-cover':
            layerVisibilityToggle('coverCenterLayer', 'visible');
            break;
        case 'info-route':
            layerVisibilityToggle('busRoutesLayer', 'visible');
            break;
        case 'info-buslane':
            layerVisibilityToggle('busLaneLayer', 'visible');
            break;
        case 'info-connectivity':
            roadFrequencyGPTool();
            break;
        case 'info-metro':
            bufferGPTool();
            break;
        default:
            break;
    }
});
