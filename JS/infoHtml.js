// 站点信息
function stationHtml(data) {
    let layerId = data.layer.id;
    let stationHtml = "<span class='popup-station-type'>" + data.properties.stopType + "</span>" + "<span class='popup-station-header'>" + data.properties.stopName + "</span>";

    return stationHtml;
}

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
function routeInfoHtml(routeUrl) {
    $.when(getJson(routeUrl)).then(function (data) {
        let dataProperty = (data.features)[0].geometry.properties;
        let basicHtml;
        let maxIndex = 1;  //站间距 最大阈值
        let minIndex = 0.3;  //站间距  最小阈值

        // 途径公交专用道长度
        // let buslaneLength;
        routeGPTool(data);
        // 平均站间距
        let distanceIndex = (dataProperty.lineLength / dataProperty.stationNum).toFixed(2);
        // 非直线系数,环线不计算
        let nonLinearIndex;
        if(dataProperty.isLoop) {
            $('#index-nonLinear').hide();
            $('#index-nonLinear2').show();
        } else {
            $('#index-nonLinear2').hide();
            nonLinearIndex = nonLinear(data);
            $('#index-nonLinear').text(nonLinearIndex).show();
        }

        // 站间距最大最小阈值
        let stationDistanceIndex = stationDistance(data, maxIndex, minIndex);

        $('.routeInfoWrapper-title').empty().text(dataProperty.lineName + "路公交车");
        basicHtml = "<span class='routeInfoWrapper-title-name'>" + dataProperty.initStation + "---" + dataProperty.finalStation + "</span>" + "<span>" + dataProperty.stationNum + "站" + "</span>" + "<span>" + dataProperty.lineLength + "km" + "</span>";
        $('.routeInfoWrapper-basic').empty().append(basicHtml);

        $('#index-distance').text(distanceIndex);
        // $('#index-nonLinear').text(nonLinearIndex);
        $('#index-maxDis').text(stationDistanceIndex.maxRatio);
        $('#index-minDis').text(stationDistanceIndex.minRatio);
    });
}

// 关闭按钮，移除线路信息框及线路图层
$('.routeInfoWrapper-button').click(function () {
    $('.routeInfoWrapper').hide();
    closeLayer();
    layerVisibilityToggle("stationLayerB", 'visible');
    layerVisibilityToggle("stationLayerC", 'visible');
    layerVisibilityToggle("stationLayerD", 'visible');
    layerVisibilityToggle("terminalLayer", 'visible');
    changeEvent('true');
    // 显示图例
    $('.legendWrapper').show();
});

// 路段重复系数
function frequencyHtml(data) {
    let  frequencyInfoHtml = "<span class='popup-station-header'>" + data.properties.NAME_CHN + "</span>" +"<span class='popup-station-count'>" + "途径路段线路" +  data.properties.FREQUENCY + "条" + "</span>";
    return frequencyInfoHtml;
}
