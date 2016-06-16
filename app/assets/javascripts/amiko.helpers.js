/*
This file is part of AmiKoWeb.
Copyright (c) 2016 ML <cybrmx@gmail.com>
*/

/**
 * Moves site to given anchor
 * @param anchor
 */
function move_to_anchor(anchor) {
    /* document.getElementById(anchor).scrollIntoView(true); */
    var id = document.getElementById(anchor).getAttribute('id');
    $(window).scrollTop($('#'+id).offset().top-120);
    /*
    $('html, body').animate({
        scrollTop: $('#'+id).offset().top-120
    }, 1000);
    */
}
/**
 * Slide in of the download links on the right side
 */
function download_links() {
    var options = {direction: 'right'};
    $('#download-links').toggle('slide', options, 250);
}

/**
 * Creates a cookie with a given name and value and expiring in days from now
 */
function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    console.log("setting cookie " + name + " = " + value);
    document.cookie = name + "=" + value + expires + "; path=/";
}

/**
 * Deletes a cookie
 */
function deleteCookie(name) {
    console.log("deleting cookie " + name);
    document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

/**
 *
 * @param it
 * @returns {boolean}
 */
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

/**
 * Sets the initial application specific cookie
 */
function setInitialCookie(url){
    console.log('setting INITIAL cookie for ' + url);
    deleteCookie('PLAY_LANG');
    if (url.contains('amiko')) {
        createCookie('PLAY_LANG', 'de', 1000);
    } else if (url.contains('comed')) {
        createCookie('PLAY_LANG', 'fr', 1000);
    }
}

/**
 * Sets language variable and PLAY_LANG cookie
 */
function setLanguage() {
    var lang = String(localStorage.getItem('language'));
    // If null, then initialize
    if (!lang || !lang.length)
        lang = 'de';
    if (lang=='de' || lang=='fr') {
        // Swap language
        if (lang=='de')
            lang = 'fr';
        else if (lang=='fr')
            lang = 'de';
        // Set local storage and cookie
        localStorage.setItem('language', lang);
        // deleteCookie('PLAY_LANG');
        // createCookie('PLAY_LANG', lang, 1000);
        // Assign location
        /*
        setTimeout(function () {
            if (lang == 'de')
                window.location.assign('https://amiko.oddb.org/');
            else if (lang == 'fr')
                window.location.assign('https://comed.oddb.org/');
        }, 500);
        */
        jsRoutes.controllers.MainController.setLang(lang).ajax({
            success: function(data) {
                if (lang=='de')
                    window.location.assign('https://amiko.oddb.org/');
                else if (lang=='fr')
                    window.location.assign('https://comed.oddb.org/');
            }
        });
    }
}

/**
 * Hide Header on scroll down
 */
var didScroll;
var lastScrollTop = 0;
var delta = 5;

$(window).scroll(function(event) {
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    var headerHeight = $('header').outerHeight();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    if (st > lastScrollTop && st > headerHeight){
        // Scroll Down
        $('header').removeClass('header-down').addClass('header-up');
        $('#flex-aside-two').removeClass('section-ids-down').addClass('section-ids-up');
    } else {
        // Scroll Up
        if (st < 80) {
            $('header').removeClass('header-up').addClass('header-down');
            $('#flex-aside-two').removeClass('section-ids-up').addClass('header-down');
        }
    }

    lastScrollTop = st;
}