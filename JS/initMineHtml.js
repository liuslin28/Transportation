/*------------------------------*/
// 图层显示切换
$('input').click(function (e) {
    let inputTarget = e.target;
    let layerName = inputTarget.name;
    let checkValue = inputTarget.checked;
    var value;
    if (checkValue) {
        value = 'visible';
    } else {
        value = 'none';
    }
    layerVisibilityToggle(layerName, value)
})

/*------------------------------*/
// 图层列表显示切换
$('#layer-click').click(function () {
    $('.layerWrapper').slideToggle()
})

$('.layerWrapper-angle').click(function () {
    $('.layerWrapper').slideToggle()
})
