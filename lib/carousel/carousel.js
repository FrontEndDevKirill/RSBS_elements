/*! Carousel 1.0.6
 * ==========================
 * @desc -
 * @requires - jQuery 1.7+ | The associated css
 * @notes - Added IE fixes from transdev
 */
(function ($) {
"use strict";
    $.fn.carousel = function (options) {

        // default settings
        var settings = $.extend({
            step: "all-in-view", //int else defaults to all-in-view
            disableautoheight: 0, //resize height to fit deppest in view
            ready: null //optional function callback once initialised
        }, options);

        //browser duck-typing (only needed because Safari is terrible):
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;// At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = !!window.chrome && !isOpera;// Chrome 1+
        var isIE = /*@cc_on!@*/false || !!document.documentMode;// At least IE6

        return this.each(function () {

            var carousel = $(this),
                ul = carousel.find("ul"),
                items = carousel.find("li"),
                count = items.length,
                firstItem = items.eq(0),
                lastItem = items.last(),
                step = carousel.data("step") || settings.step,
                autoheightdisabled = carousel.data("disable-auto-height") || settings.disableautoheight,
                index = 0,
                itemWidthInPercent = getItemWidthInPercent(),
                itemsInView = Math.floor(100/itemWidthInPercent),
                buttonholder = $("<div class='carousel-button-wrapper'/>"),
                nextbutton = $("<a href='#carousel-button-next'>→</a>"),
                prevbutton = $("<a href='#carousel-button-prev'>←</a>");



            //step (step may be an int as passed or equal to number of items in view (default)
            function getStep(reversing){
                //itemWidthInPercent = getItemWidthInPercent();
                itemsInView = Math.floor(100/itemWidthInPercent);
                //at(index);
                var stp = carousel.data("step") || settings.step;
                if(!$.isNumeric(stp) || stp > itemsInView){//NaN or greater than max.. step is equal to number of items in view
                    stp = itemsInView;
                }
                var s = stp;
                var remaining = count-index;
                //console.log(remaining - s);
                if(!reversing && remaining - s < s){s=remaining - s;}
                if(!reversing && s > remaining-itemsInView){s=remaining-itemsInView;}
                if(reversing && index - s < 0){s=index;}
                if(reversing && s===0){s=stp;}
                //console.log("s="+s);
                return s;
            }
            step = getStep();


            //controls
            nextbutton.click(function(){
                if(!frozen){
                    step=getStep();
                    move(step);
                }
                return false;
            });
            prevbutton.click(function(){
                if(!frozen){
                    step=getStep(1);
                    move(0-step);
                }
                return false;
            });

            //append the buttons
            buttonholder
                .append(prevbutton)
                .append(nextbutton);
            carousel.prepend(buttonholder);

            /*MG This bit doesn't seem to detect a swipe :( */
            carousel.on('swipe', function(){ 
                //console.log("swipe")
                //not fired if dragged
                //element was swiped
                //get the direction
                var touchdata = $(this).data('touchdata');
                //console.log(touchdata.direction)
            })

            //size
            function getItemWidthInPercent(){
                /* jQuery returns the width as calculated by the browser. This hack gets us the real attribute value */
                //ensure this is display block (sometimes when used in the table-based template it becomes 'table-cell' if the class is)
                //carousel.css("display","block");
                carousel.hide();
                var widthPercentage = firstItem.css('width');
                carousel.show();
                
                if($('.modern').length == 0){ /*MG Dirty IE8 fix as it's too stupid to get percentages from CSS */
                    var firstItemWidth = firstItem.css('width');
                    var carouselWidth = carousel.find('ul').width();

                    widthPercentage = (parseInt(firstItemWidth, 10) / parseInt(carouselWidth, 10)) * 100;
                }

                return parseFloat(widthPercentage);
            }

            //behaviours
            function move(n) {

                var w = lastItem.offset().left - carousel.width();//last item in view?
                //very weird... if i remove the above the transition no longer animates!
               //console.log(w);
                //if(n >= 0 && w < -10 ){//needs a little buffer incase the width [ex/in]cludes borders
                //use itemsInView instead
                var endItem = count-itemsInView;
                if(n>=0 && index>=endItem){
                    index=0;
                    //console.log("go to start "+index);
                } else if (index + n < count && index + n >= 0) {
                    index = index + n;
                    //console.log("go to index "+index);
                } else {
                    index = count + n;
                    //console.log("go to end "+index);
                }
                goToItem();

            }
            function goToItem(forceIndex) {
                //Chrome and Firefox need percentages (can flicker between correct and 1px out if using pixels)
                //Safari is juddery and shit with both but particularly when using percentages.
                //Have not yet tried mobile safari.
                if(forceIndex!==undefined){index=forceIndex;}
                at(index);
                if(isSafari){
                    //console.log("Safari!");
                    var itemWidthInPixels = firstItem.outerWidth();//pixels
                    firstItem.css("margin-left", "-" + (index * itemWidthInPixels) + "px");
                } else {//working browsers
                    firstItem.css("margin-left", "-" + (index * itemWidthInPercent).toFixed(3) + "%");
                }
                setHeight();
                setActives();
            }
            carousel.on("showMe", function( event, newpos ) {
                //is this item visible?
                //var $visibleItems = items.filter(":visible");
                //console.log(newpos,itemsInView,getStep());

                if(newpos>index && newpos <= (count-itemsInView)){
                    move(+1);
                } else if(newpos<index){
                    //console.log(newpos % itemsInView);
                    goToItem(newpos);
                    if(newpos % itemsInView===0){
                        //step=getStep(1);
                        //move(0-step);
                        //step=getStep(1);
                        //console.log("step",step,(newpos % count),((newpos % count)/itemsInView));
                        //move(0-(step+1));
                        //move(0-(((newpos % count)/itemsInView)-step));
                        move(-1);
                    }
                }

                if(newpos<=0 || newpos==(count-1)){
                    goToItem(newpos);
                    if(newpos==(count-1)){
                        step=getStep();
                        move(step);
                    }
                }

            });



            function setHeight() {
                if(!autoheightdisabled){
                    //console.log("setHeight()")
                    // Get an array of all element heights
                    var allHeights = items.map(function() {
                        return $(this).height();
                    }).get();
                    var visibleHeights = allHeights.slice(index, index+itemsInView);
                    // Math.max takes a variable number of arguments
                    // `apply` is equivalent to passing each height as an argument
                    var maxHeight = Math.max.apply(null, visibleHeights);
                    ul.height(maxHeight);
                    ul.css("overflow","hidden");
                }
            }
            setHeight();

            function setActives() {
                $("a[href^='#"+carousel.attr("id")+"']").removeClass("active");
                $("a[href='#"+carousel.attr("id")+":"+(index+1)+"']").each(function(){
                    $(this).addClass("active");
                    if($(this).parents(".carousel")){//if there's a link WITHIN another carousel trigger scroll that one to the selected item
                        $(this).parents(".carousel").trigger("showMe", [ index ] );
                    }
                });
            }
            setActives();

            var frozen = false;
            function freeze(){
                prevbutton.addClass("frozen");
                nextbutton.addClass("frozen");
                carousel.addClass("resizing");
                frozen=true;
            }
            function thaw(){
                prevbutton.removeClass("frozen");
                nextbutton.removeClass("frozen");
                carousel.removeClass("resizing");
                frozen=false;
            }

            function at(pos){
                //console.log(pos);
                var endItem = count-itemsInView;
                prevbutton.removeClass("frozen");
                nextbutton.removeClass("frozen");
                if(pos===0){
                    prevbutton.addClass("frozen");
                } else if (pos===endItem){
                    nextbutton.addClass("frozen");
                }
            }
            at(index);

            var resized;
            $(window).on('resize orientationChanged', function(){
                if(!isIE){onResize();}/* if not IE we can safely resize often without triggering infinite resize events*/
                clearTimeout(resized);
                resized = setTimeout(onResizeEnd, 100);
            });
            function onResize(){
                freeze();
                //the scale may have changed so goToItem to ensure the margins are correct
                itemWidthInPercent = getItemWidthInPercent();
                var s = carousel.data("step") || settings.step;
                var st = getStep();
                var fit = Math.floor(100/itemWidthInPercent);
                if(st<fit && count-index < fit){
                    index = count-fit;
                }
                goToItem();
            }
            function onResizeEnd(){
                onResize();
                thaw();
                at(index);
            }

            //auto-height is off if the carousel contains images
            //listen for the image's load events and trigger the setHeight() method
            //thanks: http://stackoverflow.com/questions/3877027/jquery-callback-on-image-load-even-when-the-image-is-cached for images loaded js
            if(!autoheightdisabled){
                items.find("img").one("load", function() {
                    setHeight();
                }).each(function() {
                    if(this.complete){$(this).load();}
                });
            }

            carousel.touchListener()
            .on('swipe', function(){ 
                var touchdata = $(this).data('touchdata');
                
                //console.log(touchdata.direction)
                if(touchdata.direction == "left"){
                    nextbutton.trigger("click");
                } else if(touchdata.direction == "right"){
                    prevbutton.trigger("click");
                }
            });

            /*callback?*/
            if ($.isFunction(settings.ready)) {
                settings.ready.call(this);
            }


            /* Add the ability to link to a specific item externally. EG, from a second carousel of thumbs elsewhere on the page */
            (function(){
                var $externalLinks = $("a[href^='#"+carousel.attr("id")+"']");
                $("body").on("click","a[href^='#"+carousel.attr("id")+"']",function(e){
                    e.preventDefault();
                    var h = $(this).attr("href");
                    var i = h.split(":")[1];
                    if(i!==undefined){
                        i = parseInt(i)-1;//zero indexed
                        if(i>=0){
                            goToItem(i);
                        }
                    }
                });
            })();


            /*optionally attach touch-listener (/stunnplate/lib/touchListener/touchListener.1.0.js)
            ideally this would be added to the li's but they have a -1 z-index and so do not trigger the events, but we can attach the listener to the parent and then move the firstItem as required.*/
            var l = 0, newl = 0, sw = ul.width(), cw = sw*count, ppm = sw/settings.transitionSpeed, toofar = false;
            carousel.touchListener()
            .on('touchdown', function(e){
                l = parseInt(firstItem.css("left"));
                sw = ul.width();
                cw = sw*count;
                newl = 0;
                ppm = sw/settings.transitionSpeed;
                toofar = false;
                //console.log('cw:'+cw+', sw:'+sw);
            })
            .on('stroke', function(){
                //console.log('drag');
                var touchdata = $(this).data('touchdata');
                var dir = touchdata.direction;
                if(dir=='left' || dir=='right'){
                    var distx = touchdata.distance.x;
                    newl = l+distx;
                    if(l>=0 && distx>0 || l<=(0-(cw-sw)) && distx<0){//trying to drag too far
                        newl = l+(distx/5);
                        toofar = true;
                    }
                    console.log('distx '+newl+', '+l+'<='+(0-(cw-sw))+' drag-'+dir+': '+distx);
                    firstItem.css("left", newl);
                }
            })
            .on('strokeend', function(){
                /**///not fired if swiped
                //move or reset slide depending on how far dragged
                var touchdata = $(this).data('touchdata');
                var dir = touchdata.direction;
                var dx = touchdata.distance.x;
                var dd = touchdata.distance.dd;
                if(dd>2){//only move if the dragdistance > x
                    //console.log("toofar = "+toofar);
                    if(dir=='left' && dd>(sw/3) && !toofar){
                        move(+1);
                    } else if(dir=='right' && dd>(sw/3) && !toofar){
                        move(-1);
                    } else {//bounce back
                        if(toofar){dd=dd/5;}
                        var mem = settings.transitionSpeed;//remember
                        settings.transitionSpeed = dd*ppm;
                        //console.log(settings.transitionSpeed);
                        move(0);
                        settings.transitionSpeed = mem;//reinstate
                    }
                }

            })
            .on('swipe', function(){
                //not fired if dragged
                //element was swiped
                //get the direction
                var touchdata = $(this).data('touchdata');
                var dir = touchdata.direction;
                var dd = touchdata.distance.dd;
                //console.log('swiped '+dir);
                    var mem = settings.transitionSpeed;//remember
                    settings.transitionSpeed = (dd*ppm < mem)?dd*ppm:mem;
                //(when it comes to transition spped bigger is slower)


                //console.log("settings.transitionSpeed "+settings.transitionSpeed);
                    if(dir=='left'){
                        move(+1);
                    } else if(dir=='right'){
                        move(-1);
                    }
                    //console.log(settings.transitionSpeed);
                    settings.transitionSpeed = mem;//reinstate

            })
            .on('touchup', function(){
                //not fired if swiped or dragged
                //the touched element was released
                //console.log("touchup!");
                $(this).trigger("dragend");
            });






        });

    };

}(jQuery));

/*$('.carousel').carousel({
    step: 4,
    disableautoheight: 0,
    ready: function () {
        console.log('ready!')
    }
});*/
$('.carousel').carousel();