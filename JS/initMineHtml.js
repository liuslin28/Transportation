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
});

/*------------------------------*/
// 图层列表显示切换
$('#layer-click').click(function () {
    $('.layerWrapper').slideToggle()
});

$('.layerWrapper-angle').click(function () {
    $('.layerWrapper').slideToggle()
});
/*------------------------------*/
// 交通信息列表显示切换
$('#info-click').click(function () {
    $('.dataWrapper').slideToggle()
});


$('.dataWrapper-menu-li').click(function (e) {
    let menuList = e.target;
    let menuListName = menuList.name;
    // 获取当前列表名称
    $(".dataWrapper-list-menu").each(function(index,domEle) {
        $(domEle).hide();
    });
    $('#'+ menuListName).show();

    // let currentTarget = $(".dataWrapper-list-menu:visible");
    // let currentTargetName = currentTarget[0].attributes[1].value;
    // if(menuListName === currentTargetName) {
    //     console.log(true)
    // } else {
    //
    //     $('#'+ currentTargetName).toggle();
    // }
    // console.log(dataWrapper-list-menu)
    console.log($(".dataWrapper-list-menu"))
    console.log(menuList.name)

})
