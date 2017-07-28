/*! flexSlider 1.3
 * ==========================
 * @desc - A flexible background-image slider
 * @requires - jQuery 1.7+ | The associated css
 * @notes - 
 */
(function ($) {
   
    $.fn.flexSlider = function (options) {

        // default settings
        var settings = $.extend({
            fillMode: 'flexfill', //other modes dont work!
            transitionSpeed: 600, //ms (should speed should be uniform like MPH or the time taken to do one transition?)
            cycle: 6000, //Should it automatically move to next slide? 0=off, 6000 = every 6 seconds
            startPosition: 0, //startingSlide (zero index)
            loop: true,//loop back to start else stop at end
            complete: null //function callback on complete
        }, options);



        return this.each(function () {

            var slider = $(this),
                parent = slider.parent(),
                cassette = slider.find("ul").first(),
                slides = cassette.find("li"),
                count = slides.length,
                index = settings.startPosition,
                minh = parseInt(parent.css("min-height")),
                frozen=false;   


           
            
            function setHeight(){
                slides.children().each(function(){
                    var c = $(this).attr("class");
                    //remove any animation offsets
                    //$(this).attr("class",c.replace("animate-","xanimate-"));
                    $(this).attr("class",c.replace(/animate-/g,"xanimate-"));
                });
                var slh = slider.height();
                var mh = parent.height();
                //console.log("mh="+mh);
                if(slh>mh){mh=slh;}
                slides.height(mh);
                slides.children().each(function(){
                    var c = $(this).attr("class");
                    //reapply any animation offsets
                    $(this).attr("class",c.replace(/xanimate-/g,"animate-"));
                });
                // console.log(slider.height());
            }
            

            goToSlide(); //ititial slide

            if(count>1){
                //add controls
                var nextbutton = $("<span class='flexSlider-nextButton'>next</span>");
                var prevbutton = $("<span class='flexSlider-prevButton'>prev</span>");
                nextbutton.click(function () {
                    move(+1);
                });
                prevbutton.click(function () {
                    move(-1);
                });
                //append the buttons
                if(settings.fillMode == "fill" || settings.fillMode == "flexfill"){
                    slider.after(prevbutton)
                        .after(nextbutton);
                } else {                
                    slider.append(prevbutton)
                        .append(nextbutton);
                }
                //add dots
                var dot = "<a href='#'>&#8226;</a>",
                    dotWrapper = $("<div class='flexSlider-dots' />"),
                    currentDot = 0;
                    temp = count;
                while(temp--){
                    dotWrapper.append($(dot));
                }; 
                dotWrapper.append(dots);
                parent.append(dotWrapper);
                //var currentDot = dots.eg(index);
                var dots = dotWrapper.find("a");
                dots.on("click",function(){
                    //alert($(this).index());
                    goToSlide(0+$(this).index());
                    return false;                
                });
            } else {//1 or less slides
                freeze();
            }

            //behaviours
            function freeze() {
                 frozen=true;
            };
            function thaw() {
                 frozen=false;
            };
            
            function onResize() {
                 if (settings.fillMode == "flexfill") {
                    slider.removeClass("fill");                    
                    parent.css("min-height","");
                    slides.css("height", "auto");
                    setHeight();
                    var sh = parseInt(slider.height());
                    sh = (sh<minh)?minh:sh;
                    parent.css("min-height",sh);
                    slider.addClass("fill");
                }
                thaw();
            };
            onResize();
            
           /*  not safe for IE8         
                    $(window).resize(function (e) {
                        onResize();
                    });
           */        
            var resized;
            $(window).on('resize orientationChanged', function(e){
                freeze();
                clearTimeout(resized);
                resized = setTimeout(onResize, 50);
            });
            

            var $appended, $prepended;
            
            function move(n) {
                if(!frozen){
                    //alert("n="+n);
                    index = index + n;
                    //console.log("index="+index);
                    if (index < count && index >= 0) {
                        goToSlide();
                    } else if (settings.loop) {
                        //console.log(index+" == "+count);
                        if(index <= 0){
                            $prepended = slides.eq(count-1).clone();
                            $prepended.prependTo(cassette); 
                            cassette.css({left:"-"+100+"%"});
                        }
                        if(index >= count){
                            $appended = slides.eq(0).clone();
                            $appended.appendTo(cassette);                      
                        }
                        //console.log(index);
                        goToSlide();         
                    }
                }
                
            };

            function goToSlide(specificIndex) {             
                if (specificIndex!=undefined && specificIndex !=null) {
                    index = specificIndex;
                }                
                if(index<0){index=0;}
                var slideint = index;
                var currentSlide = slides.eq(slideint); 
                freeze();
                cassette.animate({"left":+ (slideint * -100) + "%"},
                                 settings.transitionSpeed, "linear", 
                                 function(){
                    if($appended && $appended.length > 0){
                        index = 0; //loop
                        slideint = 0;
                        index = 0; //loop
                        $appended.remove();
                        $appended = null;
                    }                    
                    if($prepended && $prepended.length > 0){                        
                        index = count-1; //loop
                        slideint = index;
                        $prepended.remove();
                        $prepended = null;                        
                    }
                    currentSlide = slides.eq(slideint);
                    cassette.css({left:""+(slideint*-100)+"%"});
                    
                    slides.removeClass("current");
                    currentSlide.addClass("current");
                    
                    currentDot = dots.eq(slideint);
                    dots.removeClass("current");
                    currentDot.addClass("current");                 
                    
                    thaw();
                });
                
                
                               
                
                
                
                
                
            };

            if (settings.cycle > settings.transitionSpeed) {
                var step = function () {
                    //console.log("step "+settings.cycle);
                    move(+1);//goToSlide(true);
                    cycle = setTimeout(step, settings.cycle);
                }
                var cycle = setTimeout(step, settings.cycle);
                //pause on hover
                slider.hover(function () {
                    clearTimeout(cycle);
                }, function () {
                    cycle = setTimeout(step, settings.cycle);
                });
                prevbutton.hover(function () {
                    clearTimeout(cycle);
                });
                nextbutton.hover(function () {
                    clearTimeout(cycle);
                });
                dotWrapper.hover(function () {
                    clearTimeout(cycle);
                });
            }


            

            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
            
            
            
            
/*attach touch-listener (/stunnplate/lib/touchListener/touchListener.1.0.js)
ideally this would be added to the li's but they have a -1 z-index and so do not trigger the events, but we can attach the listener to the parent and then move the cassette as required.*/
var l = 0, newl = 0, sw = slides.width(), cw = sw*count, ppm = sw/settings.transitionSpeed, toofar = false;
            slider.touchListener()
.on('touchdown', function(e){   
    l = parseInt(cassette.css("left"));
    sw = slides.width();
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
        //console.log('distx '+newl+', '+l+'<='+(0-(cw-sw))+' drag-'+dir+': '+distx);
        cassette.css("left", newl);
    }   
})
.on('strokeend', function(){
    //not fired if swiped
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
            if(toofar){dd=dd/5};
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
/*$('.flexSlider').flexSlider({
    loop: true,
    cycle:6000,
    complete: function () {
        console.log('Done!')
    }
});*/
$('.flexSlider').flexSlider();