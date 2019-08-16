// 站点信息
function stationInfoHtml(data) {
    let layerId = data.layer.id;
    let stationLine = data.properties.stopLine;
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
        stationInfoHtml = "<span class='popup-station-type'>" + data.properties.stopType + "</span>" + "<span class='popup-station-header'>" + data.properties.stopName + "</span>" + lengthHtml + stationHtml;

    } else {
        stationInfoHtml = "<span class='popup-station-type'>" + data.properties.stopType + "</span>" + "<span class='popup-station-header'>" + data.properties.stopName + "</span>" + "<span class='popup-station-count'>" + "暂无线路信息" + "</span>";
    }
    return stationInfoHtml;
}


// 线路信息
function routeInfoHtml(data) {
    let dataProperty = (data.features)[0].geometry.properties;
    let basicHtml;
    let maxIndex = 1;  //站间距 最大阈值
    let minIndex = 0.3;  //站间距  最小阈值

    // 平均站间距
    let distanceIndex = (dataProperty.lineLength / dataProperty.stationNum).toFixed(2);
    // 非直线系数
    let nonLinearIndex = nonLinear(data);
    // 站间距最大最小阈值
    let stationDistanceIndex = stationDistance(data,maxIndex,minIndex);
    // 途径公交专用道长度
    let buslaneLength = 4.68;

    $('.routeInfoWrapper-title').empty().text(dataProperty.lineName + "路公交车");
    basicHtml = "<span class='routeInfoWrapper-title-name'>" + dataProperty.initStation + "---" + dataProperty.finalStation + "</span>" + "<span>" + dataProperty.stationNum + "站" +  "</span>" +  "<span>" + dataProperty.lineLength + "km" +  "</span>";
    $('.routeInfoWrapper-basic').empty().append(basicHtml);

    $('#index-distance').text(distanceIndex);
    $('#index-nonLinear').text(nonLinearIndex);
    $('#index-maxDis').text(stationDistanceIndex.maxRatio);
    $('#index-minDis').text(stationDistanceIndex.minRatio);
    $('#index-laneLength').text(buslaneLength);

    $('.routeInfoWrapper').show();
}

// 关闭按钮，移除线路信息框及线路图层
$('.routeInfoWrapper-button').click(function () {
   $('.routeInfoWrapper').hide();
    closeLayer();
    layerVisibilityToggle("stationLayerB", 'visible');
    layerVisibilityToggle("stationLayerC", 'visible');
    layerVisibilityToggle("stationLayerD", 'visible');
    layerVisibilityToggle("terminalLayer", 'visible');
    changeStationLayer('true');
    // 显示图例
    $('.legendWrapper').show();
});
