/**
 *  
 *  Stunnplate Fixed Header JS
 *
 *  Version: 1.0
 *  Last Updated: 26/06/14
 *  By: Mark
 *  
 *  Notes:
 *  JS file for fixing header on scroll
 *
 *  Changelog:
 *  26/06/14
 *  Separated files out for use with Sublime Concat and library structure
 * 
 */

$(document).ready(function() {
    //Fixed header
    $(window).scroll(function(){
        positionHeader();
    });

    $(window).resize(function(){
        positionHeader();
    });

    function positionHeader(){
        var t = $(window).scrollTop();
        var w = $(window).width();
        var header = $(".fixed-header");
        var nav = $("#nav");
        var h = $("body").offset().top;
        var b = $("#banner").height();
        //toggle fixed position
        if(t>h && w>370){header.addClass("fixed");}
        else{header.removeClass("fixed");}
    }
});