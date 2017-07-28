/*! almostInView 1.0
 * ========================== 
 */  
(function ($) {

    var vph=0;
    function getViewportDimensions(){
        vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        //console.log(vph);
    }
    getViewportDimensions();
    
    //on resize/scroll
    $(window).on('resize orientationChanged', function(){
        getViewportDimensions();
    });
    
    
    
    $.fn.almostInView = function (options) {
        // default settings
        var settings = $.extend({            
            speed: 600, //ms (set to zero to use custom css animation)*
            outOfViewClassName: 'out-of-view', //default classname for if custom css animations are used
            inViewClassName: 'in-view', //default classname for if custom css animations are used
            far: 200, //how far the out-of-view item is pushed away (in px)
            near: 80, //the point at which the item is deemed to be 'almost' in view (in px)
        }, options);
        
        
        
        return this.each(function () {
            var el = $(this);
                        
            //on resize/scroll
            $(window).on('resize orientationChanged scroll', function(){
                checkInView();
            });
            
            var firstrun=true;
            function checkInView(){
                var rect = el[0].getBoundingClientRect(),
                    mt = (firstrun)?parseInt(el.css('margin-top')) : el.data('mt'),                    
                    animate = (settings.speed>0),
                    f = (!firstrun)?settings.far:0;
                    t = (rect.top - (f - settings.near));
                               
                if(!el.done){   
                    el.data('mt', 0+mt);
                    if(firstrun && t>vph){
                        if(animate){
                            el.css("margin-top",settings.far+"px");
                        } else {
                            el.addClass(settings.outOfViewClassName);
                        }
                        firstrun=false;
                    }
                    if(t<vph){
                        if(animate){
                            //console.log(mt,settings.speed);
                            el.animate({marginTop:mt}, settings.speed, function(){$(this).removeAttr("style");});
                        } else {
                            el.addClass(settings.inViewClassName);
                            el.removeClass(settings.outOfViewClassName);
                        }
                        el.done=true;
                    } else if(!animate){
                        el.addClass(settings.outOfViewClassName);
                    }
                }
            }            
            checkInView();
        });
    }
    
    
}(jQuery));
$('.me').almostInView();