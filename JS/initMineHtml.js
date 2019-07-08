/*------------------------------*/
// 图层显示切换
$('.layerWrapper-check-input').click(function (e) {
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
    $('#simulate-dataWrapper').hide();
    $('#info-dataWrapper').slideToggle();
});

// 交通仿真列表显示切换
$('#simulate-click').click(function () {
    $('#info-dataWrapper').hide();
    $('#simulate-dataWrapper').slideToggle();
});

$('.dataWrapper-menu-li-a').click(function (e) {
    let menuList = e.target;
    let menuListName = menuList.name;
    $(".dataWrapper-list-menu").each(function(index,domEle) {
        $(domEle).hide();
    });
    $('#'+ menuListName).show();
});

/*------------------------------*/
// 列表切换样式
// 导航栏列表
// 有bug待改
$('.navWrapper-nav-li').click(function () {
    // let _this = this;
    let navId = this.id;
    if (navId === 'layer-click') {
        $('#layer-click').toggleClass("navWrapper-nav-li-active");
    } else {
        $('#layer-click').siblings('li').removeClass('navWrapper-nav-li-active');
        $('#'+navId).addClass('navWrapper-nav-li-active');
    }
    console.log(this.id);
});
// 侧边栏列表
$('.dataWrapper-list-menu-li').click(function () {
    $(this).siblings('li').removeClass('dataWrapper-list-menu-li-active');
    $(this).addClass('dataWrapper-list-menu-li-active');
});

