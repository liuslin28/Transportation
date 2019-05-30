$(document).ready(function () {
    var secondNav = null;
    var primaryNav = null;
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("menuDisplayed");

    });
    // primary-nav点击
    $(".nav-item-primary").click(function (e) {
            e.preventDefault();
            let targetNav = e.currentTarget.innerText;
            var navTarget = $("#second-nav");
            if (primaryNav) {
                if (targetNav === primaryNav) {
                    navTarget.slideToggle();
                } else {
                    console.log(e);
                }
            } else {
                navTarget.slideToggle();

            }
            primaryNav = targetNav;
        }
    )
    // second-nav点击
    $(".nav-item-second").click(function (e) {
            e.preventDefault();
            let targetNav = e.currentTarget.innerText;
            if (secondNav) {
                if (targetNav === secondNav) {
                    $("#wrapper").toggleClass("menuDisplayed");

                } else {
                    // $("#wrapper").toggleClass("menuDisplayed");
                    console.log(e);
                }
            } else {
                $("#wrapper").toggleClass("menuDisplayed");
            }
            secondNav = targetNav;
        }
    )
});