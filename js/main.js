$( document ).ready( function() {
    /*
     * split4Into2();
     * SPLITS ROWS OF 4 COLUMNS INTO 2 ROWS OF 2 COLUMNS WHEN REQUIRED
     * (requires jQuery)
     *
     * If a particuar CSS attribute matches a specific value then split a 4-column row in to 2 rows of 2.
     * This is currently set for .one-fourth to have 'empty-cells:hide' for narrow viewports.
     * Where matched, the function is applied.
     */
    (function(){
        function split4Into2(){
            var cssAttr = "empty-cells", cssVal = "hide", //the trigger css attr and value
                $quarterCells = $(".container .one-fourth, .wasContainer .one-fourth"), //all .one-fouth cells
                applyMethod = ($quarterCells.css(cssAttr)==cssVal), //should we apply the method? look for a match.
                alreadyApplied = ($(".container .injectedTableRow, .wasContainer .injectedTableRow").length>0); //has it already been applied (we dont want to re-apply it)
            if(applyMethod && !alreadyApplied){//apply if not already done so
                $quarterCells.parent().removeClass("container").addClass("wasContainer");
                for(var i = 0; i < $quarterCells.length; i+=2) {
                    $quarterCells.slice(i, i+2).wrapAll("<div class='container injectedTableRow'></div>");
                }
            } else if(!applyMethod && alreadyApplied){//unwrap any previously wrapped block whites:
                $(".injectedTableRow > .block").unwrap();
                $quarterCells.parent().addClass("container").removeClass("wasContainer");
            }
        }
        //on dom ready call this
        $(function(){split4Into2();});
        //on resize call this
        $(window).resize(function(){split4Into2();});
    }());
    /*
     * END split4Into2();
     */


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


// Tabbed Content 
/*! elementQuery | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function(n,t,i){"use strict";var o=n.Sizzle||jQuery.find,r={},u=null,v=function(){t.styleSheets[0]&&(u=t.styleSheets[0].cssRules!==i?"cssRules":"rules")},s=function(n,t,u,f,s){if(n=e(n),n!=""){var h;f||s||(h=/^([0-9]*.?[0-9]+)(px|em)$/.exec(u),h!=null&&(f=Number(h[1]),f+""!="NaN"&&(s=h[2]))),s&&(o.compile&&o.compile(n),r[n]===i&&(r[n]={}),r[n][t]===i&&(r[n][t]={}),r[n][t][u]=[f,s])}},y=function(n,t){var i,r,u;for(i in n)for(r in n[i])if(typeof n[i][r]=="string")s(i,r,n[i][r]);else if(typeof n[i][r]=="object")for(u=0;u<n[i][r].length;u++)s(i,r,n[i][r][u]);t==!0&&f()},c=function(n){if(n)for(var a=/(\[(min\-width|max\-width|min\-height|max\-height)\~\=(\'|\")([0-9]*.?[0-9]+)(px|em)(\'|\")\])(\[(min\-width|max\-width|min\-height|max\-height)\~\=(\'|\")([0-9]*.?[0-9]+)(px|em)(\'|\")\])?/gi,e=n.split(","),u,t,h,c,l,r,o,f=0;f<e.length;f++)for(u=null,c=0,l=0;l==0||t!=null;)t=a.exec(e[f]),t!=null&&(h=Number(t[4]),h+""!="NaN"&&(u==null&&(u=e[f].substring(c,t.index),r=e[f].substring(t.index+t[1].length),r.length>0&&(o=r.indexOf(" "),o!=0&&(o>0&&(r=r.substring(0,o)),r=r.replace(/(\[(min\-width|max\-width|min\-height|max\-height)\~\=(\'|\")([0-9]*.?[0-9]+)(px|em)(\'|\")\])/gi,""),u+=r))),s(u,t[2],t[4]+t[5],h,t[5])),t[7]===i||t[7]==""?(c=t.index+t[1].length,u=null):a.lastIndex=t.index+t[1].length),l++},l=function(n,t){var r,f,e,i;if(u==null&&v(),n[u]&&n[u].length>0&&(r=n.ownerNode||n.owningElement,t||r.getAttribute("data-elementquery-bypass")===null&&r.getAttribute("data-elementquery-processed")===null)){for(f=0;f<n[u].length;f++)if(i=n[u][f],i[u]&&i[u].length>0)for(e=0;e<i[u].length;e++)c(i[u][e].selectorText);else c(i.selectorText);r.setAttribute("data-elementquery-processed","")}},e=function(n){if(n==null)return"";var t="".trim;return t&&!t.call("﻿ ")?t.call(n):(n+"").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")},a=function(n,t){var i=n.getAttribute(t);return i?(" "+i+" ").replace(/[\t\r\n]/g," "):" "},p=function(n,t,i){var r,u;n.nodeType===1&&(r=e(i),r!=""&&(u=a(n,t),u.indexOf(" "+r+" ")<0&&n.setAttribute(t,e(u+r))))},w=function(n,t,i){var u,r,f;if(n.nodeType===1&&(u=e(i),u!="")){for(r=a(n,t),f=!1;r.indexOf(" "+u+" ")>=0;)r=r.replace(" "+u+" "," "),f=!0;f&&n.setAttribute(t,e(r))}},h=function(){for(var n=0;n<t.styleSheets.length;n++)l(t.styleSheets[n]);f()},f=function(){var e,h,i,s,c,u,f,l;for(e in r)if(c=o(e),c.length>0)for(h=0;h<c.length;h++){u=c[h];for(i in r[e])for(s in r[e][i])f=r[e][i][s][0],r[e][i][s][1]=="em"&&(f=f*(n.getEmPixels?getEmPixels(u):16)),i=="min-width"&&u.offsetWidth>=f||i=="max-width"&&u.offsetWidth<=f||i=="min-height"&&u.offsetHeight>=f||i=="max-height"&&u.offsetHeight<=f?p(u,i,s):w(u,i,s)}!n.addEventListener&&n.attachEvent&&(l=t.documentElement.className,t.documentElement.className=" "+l,t.documentElement.className=l)};n.elementQuery=function(n,t){n&&typeof n=="object"?n.cssRules||n.rules?(l(n,!0),t==!0&&f()):y(n,t):n||t||f()},n.elementQuery.selectors=function(){var t={},n,u,f;for(n in r)for(u in r[n])for(f in r[n][u])t[n]===i&&(t[n]={}),t[n][u]===i&&(t[n][u]=[]),t[n][u][t[n][u].length]=f;return t},n.addEventListener?(n.addEventListener("resize",f,!1),n.addEventListener("DOMContentLoaded",h,!1),n.addEventListener("load",h,!1)):n.attachEvent&&(n.attachEvent("onresize",f),n.attachEvent("onload",h))})(this,document,undefined);
/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function(n,t){"use strict";var i="!important;",r="position:absolute"+i+"visibility:hidden"+i+"width:1em"+i+"font-size:1em"+i+"padding:0"+i;window.getEmPixels=function(u){var f,e,o;return u||(u=f=n.createElement("body"),f.style.cssText="font-size:1em"+i,t.insertBefore(f,n.body)),e=n.createElement("i"),e.style.cssText=r,u.appendChild(e),o=e.clientWidth,f?t.removeChild(f):u.removeChild(e),o}})(document,document.documentElement);
// custom.
(function ($) {
    $.fn.extend({
        tabme: function () {

                function setActive(self, $el) {
                    //console.log($el);
                    var hash = $el.attr('href');
                    var elm = $(hash);
                    if(elm.length > 0){
                        $(self).find(".open > div").slideUp(200)
                        $(self).find(".open").removeClass("open");
                        
                        $(self).find(".active").removeClass("active");
                        elm.addClass('open');                        
                        elm.find("div:first").slideDown(200);
                        $(self).find('a[href='+hash+']').parent().addClass('active');
                        //set the overflow tab as active
                        $(self).find('ul ul.overflowTabs li.active').parent().parent().addClass("active");
                        
                        /*$(".overflowTabs").hide();
                        elm.focus(); 
                        $(".overflowTabsParent").blur();
                        $(".overflowTabs").removeAttr("style");*/
                        
                    }
                }

                function setActiveViaHash(self,hash) {
                    var matched = $(self).find("a[href='" + hash + "']");
                    if (hash && matched.length > 0) {
                        setActive(matched);
                    }
                }


            return this.each(function () {
                var self = this;

                //Set up html for if its viewed as an accordion
                //clone tab links to their accordion sections
                $(self).find("li a").each(function () {
                    var hash = $(this).attr('href');
                    var section = $('section'+hash);
                    section.wrapInner("<div></div>")
                    $(this).clone().prependTo('section'+hash);
                });
                
                
                
                
                //triggers
                $(this).find("a[href^='#']").on("click", function () {
                    setActive(self, $(this));
                    return false;
                });

                //default active
                var firstActive = ($(this).find('li.active a').length > 0) ? $(this).find('li.active a') : $(this).find('li:first a');
                firstActive.click();

                //location hash
                if (location.hash) {
                    setActiveViaHash(self, location.hash);
                }

                if ("onhashchange" in window) {
                    window.onhashchange = setActiveViaHash(self, location.hash);
                }
                
                function overflowTabs(){
                    /* get the tabs that are wrapping/beyond the viewport and present them in a dropdown list */
                    var parentW = $(self).find('ul').width();
                    var childW = 0;//$(self).find('ul > li').outerWidth(true);
                    var extraSpaceForDropAdded = false;
                    var $ul = $(self).find('ul');

                    //uwrap previously wrapped
                    $ul.find('.overflowTabs').unwrap();
                    $ul.find('.overflowTabs li').unwrap();
                    $ul.find('.overflowTab').remove();
                    

                    $(self).find('ul > li').each(function(){
                        childW = childW + $(this).outerWidth(true);
                        $(this).removeClass("overflow");
                    })
                    
                    childW = (childW>parentW)?50:4;//space for the overflow tab else 4 px margin 
                    var overflow = [];
                    
                    $(self).find('ul > li').each(function(){
                        childW = childW + $(this).outerWidth(true);
                        if(childW>parentW){
                            overflow.push($(this));
                            $(this).addClass("overflow");
                        }
                    })
                    

                    //if there are some overflowing

                    if(overflow.length > 0){//wrap the new ones
                        $ul.find('li.overflow').wrapAll("<ul class='overflowTabs'>");
                        $ul.find('.overflowTabs').wrap("<li class='overflowTabsParent'>").before("<a class='overflowTab' href='#'>+</a>");
                        //wrapping may not be the best option. may have to clone
                        //set the overflow tab as active
                        $ul.find('.overflowTabs li.active').parent().parent().addClass("active");
                    }

               
                    
                }
                overflowTabs();
                
                function setSectionHeights(){
                    /*    
                    $(self).find("section").each(function(){
                        var d = $(this).find("div:first");
                        d.css({"height":"auto"})
                        .css({"max-height":d.height()});
                        console.log(d.height());                   
                    })  */                
                }
                setSectionHeights();

                $(window).resize(function (e) {
                    overflowTabs();
                    setSectionHeights();
                });


            });
        }
    });
})(jQuery);



$(document).ready(function () {
    $('.tabbed').tabme();
});
