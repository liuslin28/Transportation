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

// 交通信息页面一级导航
$('.dataWrapper-menu-li').click(function () {
    let menuListName = $(this).find("a").eq(0).attr('name');
    $(".dataWrapper-list-menu").each(function(index,domEle) {
        $(domEle).hide();
    });
    $('#'+ menuListName).show();
});

// 交通信息页面二级导航
$('.dataWrapper-list-menu-li').click(function () {
    // 修改样式
    $(this).siblings('li').removeClass('dataWrapper-list-menu-li-active');
    $(this).addClass('dataWrapper-list-menu-li-active');

    let menuListName = $(this).find("a").eq(0).attr('name');
    $(".dataWrapper-content-pane").hide();
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

