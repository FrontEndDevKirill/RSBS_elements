/*! Stunnplate Scrollable Div V1.0 */
/*
*   Last Update: 25/07/14
*   By: Mark
*
*   Desc: Creates a div that can be scrolled without scrollbars using nav buttons (up/down) and mousewheel. Needs touch support (not added as not required on Transdev)
* 
*   Changelog:
*   25/07/14
*   Created
*/
$('document').ready( function() {
    $('.scrollable').each(function(){
        var content = $(this).html(),
            contentHeight = $(this).scrollHeight,
            thisHeight = $(this).height(),
            scrollUpTrig = $("<div class='scrollUp frozen'>More <span class='icon-font'>↑</span> Times</div>"),
            scrollDownTrig = $("<div class='scrollDown'>More <span class='icon-font'>↓</span> Times</div>"),
            thisScroller = $(this),
            edge = false;
        
        $(this).before(scrollUpTrig).after(scrollDownTrig).css('overflow','hidden');

        var scrollUp = function() {
            edge= false;
            var currentPos = thisScroller.scrollTop();
            thisScroller.scrollTop(currentPos - 18);
            var newPos = thisScroller.scrollTop();
            if(newPos == currentPos) {edge = true;}
            scrollDownTrig.removeClass("frozen")
            if(edge){scrollUpTrig.addClass("frozen")}
            else {scrollUpTrig.removeClass("frozen")}
        }
        var scrollDown = function() {
            edge= false;
            var currentPos = thisScroller.scrollTop();
            thisScroller.scrollTop(currentPos + 18);
            var newPos = thisScroller.scrollTop();
            if(newPos == currentPos) {edge = true;}
            scrollUpTrig.removeClass("frozen")
            if(edge){scrollDownTrig.addClass("frozen")}
            else {scrollDownTrig.removeClass("frozen")}
        }
              
        /* Continuous scroll on mousedown */
        var scrollTimer = "";
        scrollUpTrig.on('mousedown', function(){
            // set interval
            scrollTimer = setInterval(scrollUp, 50);
        });
        scrollUpTrig.on('mouseup mouseout',function(){
            clearInterval(scrollTimer);

        });
        scrollDownTrig.on('mousedown', function(){
            // set interval
            scrollTimer = setInterval(scrollDown, 50);
        });
        scrollDownTrig.on('mouseup mouseout',function(){
            clearInterval(scrollTimer);
        });
        

        thisScroller.on("DOMMouseScroll MozMousePixelScroll mousewheel", function(e){
            //$('html, body').css('overflow','hidden');
            if(!edge){
                e.preventDefault();    
            }
            

            if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                // e.preventDefault();                
                scrollUp();
            }
            else {
                scrollDown();
            }
        });
        thisScroller.on('mouseout',function(){
            //$('html, body').css('overflow','visisble');
        });
        
    });
}); 