/*! fixedheader 1.3
 * ==========================
 * @desc - 
 * @requires - jQuery 1.7+ | The associated css
 * @notes - 
 */
(function ($) {
    
    
    /*
     * Example function to open/close the menu based on scroll position:
     */
    // var distance = 500,
    //     revealed = false;
    // $(window).on('scroll', function () {
    //     var scrolltop = parseInt($(window).scrollTop());
    //     if(scrolltop>=distance && !revealed){
    //         $(".fixedHeader-menu > ul").trigger("open");
    //         revealed = true;
    //     }
    //     if(scrolltop<distance && revealed){
    //         $(".fixedHeader-menu > ul").trigger("close");
    //         revealed = false;
    //     }
    // });
    
    // /*
    //  * Example of how you might trigger the opening of the revealable content from outside of the function
    //  */
    // $("#test").on("click", function(){
    //     $(".fixedHeader-revealableContent").trigger("open");
    //     return false;
    // });
    
    

    $.fn.fixedHeader = function (options) {

        // default settings
        var settings = $.extend({
            autohide: 0, //auto hide the header on scroll-down then reveal on scroll up. This OVERIDES the CSS derived setting (is if page-break-after:always is set)
            ready: null //optional function callback once initialised
        }, options);

        function getViewportHeight(){
            return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        };



        return this.each(function () {

            
            $(this).show();

            var vph = getViewportHeight();

            console.log(vph)
            var $htmlbody = $("html,body"),
                $fixedHeader = $(this),
                $revealableWidget = $fixedHeader.find(".fixedHeader-revealableWrapper"),
                $revealableContent = $fixedHeader.find(".fixedHeader-revealableContent"),
                $foRevealableContent = $("<div class='fixedHeader-foRevealableContent'> </div>"),
                $revealableTrigger = $fixedHeader.find(".fixedHeader-revealableTrigger"),
                $menu = $fixedHeader.find(".fixedHeader-menu"),
                $menuTrigger = $fixedHeader.find(".fixedHeader-trigger"),
                maxheight = vph - 100,
                revealableHeight = vph; 
            
            var autohide = ($fixedHeader.css("page-break-after")=="always") || settings.autohide;
            
            $fixedHeader.removeClass("no-js");
            
            var scrolltop = parseInt($(window).scrollTop());
            
            var forcedMaxHeight = parseInt($revealableContent.css("max-height"));// if the developer has set a max-height try to honour it: 
            if(forcedMaxHeight>0 && forcedMaxHeight<maxheight){
                maxheight = forcedMaxHeight;
            }
            
            $revealableContent.css("max-height", maxheight + "px");
            var h = $revealableContent.outerHeight();
            var hh = $fixedHeader.outerHeight();



            $fixedHeader.before($foRevealableContent);

            /*$revealableTrigger.on("click", function(e) {
                if (!$revealableContent.open){
                    open();
                } else {
                    close();
                }
            });*/
            $revealableTrigger
                .on("click", function(e) {
                    e.preventDefault();
                    scrolltop = parseInt($(window).scrollTop());
                    if (!$revealableContent.open){
                        $revealableContent.trigger("open");
                    } else {
                        $revealableContent.trigger("close");
                    }
                    return false;
                });
           $revealableContent
               .on("open", function() {
                    open();
                })
                .on("close", function() {
                   close();
                });
            
            
            
            
            $menuTrigger.on("click", function(e) {
                e.preventDefault();
                if (!$menu.open){
                    $menu.trigger("open");
                } else {
                    $menu.trigger("close");
                }
                return false;
            });
            $menu
                .hide()
                .on("open", function() {
                    $menu.open = true;
                    $menu.slideDown({
                        duration: 400,
                        step: function(){
                            sortHeight();
                        }
                    });
                })
                .on("close", function() {
                    $menu.open = false;
                    $menu.slideUp({
                        duration: 400,
                        step: function(){
                            sortHeight();
                        }
                    });
                });

            var scrolltopatreveal=0;
            var open = function (instantOpen) {
                if(!instantOpen){ // COz it doesn't work otherwise !?!?!
                    onResize();
                    sortHeight();
                }
                
                scrolltopatreveal = scrolltop;
                // re-calc max height (iphone browser chrome annoyances) >
                vph = getViewportHeight();
                maxheight = vph;
                if(forcedMaxHeight>0 && forcedMaxHeight<maxheight){
                    maxheight = forcedMaxHeight;
                };
                $revealableContent.css("max-height", maxheight + "px");
                // <
                
                $revealableContent.open = true;
                //$htmlbody.css("overflow","hidden");
                $fixedHeader.css({"position":"absolute","top":scrolltop+"px"});
                $fixedHeader.addClass("fixedHeaderOpen");
                
                if(instantOpen){
                    // console.log("Im Getting here")
                    $revealableContent.css('margin-top', 0);
                    $foRevealableContent.css('margin-top', 0);
                    // $revealableContent.css({marginTop: 0}, 400);
                    // $foRevealableContent.css({marginTop: 0}, 400);    
                } else{
                    $revealableContent.animate({marginTop: 0}, 400);
                    $foRevealableContent.animate({marginTop: 0}, 400);    
                }
                
            }
            var close = function () {
                //$htmlbody.css("overflow","");
                /*$revealableContent.animate({marginTop:-h}, 400, function(){
                    $fixedHeader.css({"position":"fixed","top":0+"px"});
                });*/
                
                $fixedHeader.removeClass("fixedHeaderOpen");

                var hdiff = revealableHeight-(scrolltop-parseInt($fixedHeader.offset().top));                
                 $foRevealableContent.animate({marginTop:0-hdiff});
                 $revealableContent.animate({marginTop:0-hdiff}, 400, function(){
                    instantclose();
                    $(window).scrollTop(scrolltopatreveal);
                });
                //$revealableContent.open = false; /*MG 141114 - instantClose doesn't work properly when you set this here */
                //$revealableContent.animate({marginTop: -h}, 400);
                //$foRevealableContent.animate({marginTop:-h}, 400);
            }
            var instantclose = function () {
                //console.log("Instant Close " + $revealableContent.open)
                if($revealableContent.open){
                    $fixedHeader.removeClass("fixedHeaderOpen");
                    $revealableContent.open = false;
                    $fixedHeader.css({"position":"fixed","top":0+"px"});
                    $revealableContent.css("margin-top",-revealableHeight);
                    $foRevealableContent.css("margin-top",-revealableHeight);
                    $(window).scrollTop(scrolltop-revealableHeight);
                    // console.log(scrolltopatreveal);
                    // $(window).scrollTop(scrolltopatreveal);
                }
            }

            var onResize = function () {
                //console.log('resize ' + $fixedHeader.css("cssText"));//list of all
                autohide = ($fixedHeader.css("page-break-after")=="always") || settings.autohide;
                $fixedHeader.css({"top":0});//make sure the header is visible
                
                vph = getViewportHeight();

                maxheight = revealableHeight;
                if(forcedMaxHeight>0 && forcedMaxHeight<maxheight){
                    maxheight = forcedMaxHeight;
                };
                $revealableContent.css("max-height", maxheight + "px");

                $revealableContent.css("height","auto");
                $foRevealableContent.css("height","auto");
                h = $revealableContent.outerHeight();
                hh = $fixedHeader.outerHeight();
                // hh = (hh > h) ? hh : (hh + h);

                revealableHeight = (vph > h) ? vph : h;
                revealableHeight = revealableHeight; 
                hh = (hh > revealableHeight) ? hh : (hh + revealableHeight);

                //console.log('vph=' + vph + ' hh=' + hh);
                $revealableContent.css({
                    "height": revealableHeight,
                    "margin-top": -revealableHeight
                });
                $foRevealableContent.css({
                    "height": hh,
                    "margin-top": -revealableHeight
                });
                if ($revealableContent.open) {
                    $revealableContent.css({
                        "margin-top": 0
                    });
                    $foRevealableContent.css({
                        "margin-top": 0
                    });
                }
            }

            if($fixedHeader.hasClass("headerOpen")){
               open(true);
            }
            onResize();
            //sortHeight();
            // } else{
            //     onResize();
            // }
            
            
            var sortHeight = function(){
                h = $revealableContent.outerHeight();
                hh = $fixedHeader.outerHeight();
                // hh = (hh > h) ? hh : (hh + h);
                
                //console.log('vph=' + vph + ' hh=' + hh);
                
                revealableHeight = (vph > h) ? vph : h;
                revealableHeight = revealableHeight;
                hh = (hh > revealableHeight) ? hh : (hh + revealableHeight);

                
                $revealableContent.css({
                    "height": revealableHeight,
                    //"margin-top": -h
                });
                $foRevealableContent.css({
                    "height": hh,
                    //"margin-top": -h
                });
            };

            /*  not safe for IE8
            $(window).on('resize orientationChanged', function () {
                onResize();
                instantclose();
            });
           */        
            var resizeListener = function(){
              $(window).one("resize",function(){ //'one' unbinds itself every time it fires
                  onResize();
                  instantclose();
                  sortHeight();
                  setTimeout(resizeListener,50); //rebind listener
              });
            }
            resizeListener(); 
           
            
            var previousScrollTop = 0, diff = 0, prevDiff = 0;                
            var onScroll = function(){
                scrolltop = parseInt($(window).scrollTop());
                //console.log(scrolltop);
                var currentScrollTop = scrolltop,
                    currentDiff = currentScrollTop-previousScrollTop,
                    direction = (currentDiff<prevDiff)?"up":"down",
                    fhh = parseInt($fixedHeader.outerHeight()),
                    fht = parseInt($fixedHeader.css("top")),
                    negFhh = fhh * -1,
                    delaypx = (fhh),
                    dist = currentDiff - diff,
                    newtop = fht,
                    openbutoffscreen = false;
                
                /* scroll away from revealed > */               
                if($revealableContent.open){
                    //console.log('fht('+fht+') scrolltop('+scrolltop+') maxheight('+h+')')
                    if(fht>scrolltop){
                        $fixedHeader.css("top",scrolltop);
                    } else if(fht < scrolltop-h){
                        instantclose();
                    }
                };
                /* < scroll away from revealed */ 
                
                /* autohide > */
                if(autohide && !$revealableContent.open && !$menu.open){
                    if(dist>delaypx && direction=="down" && !$fixedHeader.hidden){
                        $fixedHeader.css("top",0-(dist-delaypx));
                    } else if (direction=="up"){
                        fht = (fht<negFhh)?negFhh:fht;
                        fht = (fht<0)?fht+(prevDiff-currentDiff):0;
                        $fixedHeader.css("top",fht);
                        $fixedHeader.hidden=false;
                    }                
                    clearTimeout($.data(this, 'scrollTimer'));
                    $.data(this, 'scrollTimer', setTimeout(function() {
                        diff = currentDiff;
                        var posTop = parseInt($fixedHeader.css("top"));
                        var halfHeight = (fhh/2);
                        var negHalfHeight = halfHeight * -1;
                        if(direction=="down" && posTop<negHalfHeight){//almost hidden
                            $fixedHeader.animate({"top":negFhh}, 100);
                            $fixedHeader.hidden=true;
                        } else if(posTop>negFhh && !$fixedHeader.hidden){//reveal
                            $fixedHeader.animate({"top":0}, 100);
                            $fixedHeader.hidden=false;
                        }
                    }, 100));                   
                    prevDiff = currentDiff;
                }
                /* < autohide */
                     
            };
            $(window).on('scroll', function () {
                onScroll();
            });
            
            
            /* touch events DEV
            $revealableTrigger.on('touchstart, mousedown', function(e){
                $(this).addClass('touched');
                console.log('touchstart');
            })
            .on('touchmove, mousemove', function(e) {
                e.preventDefault();
                var ev = e.originalEvent;
                console.log(ev.touches);
            })
            .on('touchend, mouseup', function(e){
                e.preventDefault();
                console.log('touchend');
                $(this).removeClass('touched');
            });
            */

            /*callback?*/
            if ($.isFunction(settings.ready)) {
                settings.ready.call(this);
            }
        });
    };


}(jQuery));
$(function(){
    $('.fixedHeader').fixedHeader();
});

