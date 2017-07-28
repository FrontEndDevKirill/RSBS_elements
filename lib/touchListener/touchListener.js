/* Simple Touch Library 1.0.2 */
(function ($) {
    
   var ePos = function(e){
       var oe = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : e;
       return {x:oe.pageX, y:oe.pageY};
   };
    
    $.fn.touchListener = function (options) {
        var settings = $.extend({
            swipeSpeedThreshold: 0.6, //drag speed in px per ms before it can be considered a swipe
            swipeDistanceThreshold: 100, //distance stroked in px before it can be considered a swipe
            strokeDistanceThreshold: 4, //minimum distance moved before it can be considered a stroke (so that minor wobbles are not taken as strokes)
            complete: null //function callback on complete
        }, options);
        
        return this.each(function () {
            var el = $(this),
                touchstarted = false,
                ori={x:0,y:0},
                pos={x:0,y:0},
                last={x:0,y:0},
                deg=-1,
                dir='',
                livedir='',
                startTime = 0,
                endTime = 0,
                split = 0,
                dur = 0,
                spd = 0,
                directionDistance = 0,                    
                dist={x:0,y:0,dd:directionDistance},
                touchdata = {state:'listening',
                             origin:ori,
                             position:pos,
                             distance:dist,
                             degrees:deg,
                             direction:dir,
                             relativeDirection:livedir,
                             duration:dur,
                             speed:spd
                            };

            
            
            el.on('touchstart mousedown', function(e){
                touchstarted=true;
                pos = ePos(e);
                ori = pos,
                startTime = new Date().getTime();
                touchdata = {
                    state:'touchstart',
                    origin:ori,
                    position:pos,
                    distance:dist,
                    degrees:deg,
                    direction:dir,
                    relativeDirection:livedir,
                    duration:dur,
                    speed:spd
                };
                $(this).data('touchdata',touchdata);
                $(this).trigger('touchdown');
            })
            .on('touchmove mousemove', function(e) {
                //e.preventDefault();
                if(touchstarted){
                    pos = ePos(e);
                    //endX = pos.x;
                    //endY = pos.y;
                    var distX = (pos.x - ori.x);
                    var distY = (pos.y - ori.y);
                    //direction degree
                    deg = Math.round(Math.atan2(distY,distX)/Math.PI*180)+90;
                    if(deg<0){deg+=360;}
                    //direction keyword
                    var buffer = 2;
                    directionDistance = Math.abs(distX);
                    dir = '';                                        
                    if(distX>buffer){dir = 'right';}
                    if(distX<(0-buffer)){dir = 'left';}
                    if(Math.abs(distY) > Math.abs(distX)){
                        directionDistance = Math.abs(distY);
                        if(distY>buffer){dir = 'down';} else {dir = 'up';}
                    }
                    
                    var distLastX = (pos.x - last.x);
                    var distLastY = (pos.y - last.y);
                    if(distLastX>0){livedir = 'right';}
                    if(distLastX<0){livedir = 'left';}
                    if(Math.abs(distLastY) > Math.abs(distLastX)){
                        if(distLastY>0){livedir = 'down';} else {livedir = 'up';}
                    }
                    last = pos;
                    
                    
                    //distance
                    dist = {x:distX,y:distY,dd:directionDistance};                    
                    //duration
                    //the uses could have paused mid move - in such cases this confuses the swipe detection because the time between touchstart and end includes the time where no actual movement was made. 
                    
                    split = new Date().getTime();
                    
                    var oldduration = dur,
                        newduration = split-startTime,
                        durationdiff = newduration-oldduration;
                    
                    if(durationdiff>200){newduration=0;startTime=split;}
                    dur = newduration;
                    
                    
                                        
                    //speed (pixels per ms)
                    spd = directionDistance/dur;
                    //data
                    touchdata = {
                        state:'touchmove',
                        origin:ori,
                        position:pos,
                        distance:dist,
                        degrees:deg,
                        direction:dir,
                        relativeDirection:livedir,
                        duration:dur,
                        speed:spd
                    };                    
                    $(this).data('touchdata',touchdata);
                    //event
                    if(directionDistance > settings.strokeDistanceThreshold){
                        $(this).trigger('stroke');
                    }
                };
            })
            .on('touchend mouseup mouseout click', function(e){
                if(touchstarted){                  
                    
                    endTime = new Date().getTime();
                    
                    touchdata = {
                        state:'touchend',
                        origin:ori,
                        position:pos,
                        distance:dist,
                        degrees:deg,
                        direction:dir,
                        relativeDirection:livedir,
                        duration:dur,
                        speed:spd
                    };
                    
                    $(this).data('touchdata',touchdata);
                    
                    //was it a swipe or a drag
                    var eventname = (spd>settings.swipeSpeedThreshold && directionDistance > settings.swipeDistanceThreshold)?"swipe":(directionDistance > settings.strokeDistanceThreshold)?"strokeend":"touchup";
                    //$(this).trigger('touchup');
                    $(this).trigger(eventname);
                    
                    //reset
                    touchstarted = false,
                    pos={x:0,y:0},
                    ori={x:0,y:0},
                    deg=-1,
                    dir='',
                    livedir='',
                    startTime = 0,
                    endTime = 0,
                    split = 0,
                    dur = 0,
                    spd = 0,
                    directionDistance = 0,
                    dist={x:0,y:0,dd:directionDistance},
                    touchdata = {state:'listening',
                                 origin:ori,
                                 position:pos,
                                 distance:dist,
                                 degrees:deg,
                                 direction:dir,
                                 relativeDirection:livedir,
                                 duration:dur,
                                 speed:spd
                                };
                   
                    
                }
            })
            /* these are the custom events you can listen for 
                .on('touchdown', function(){
                    //the element is touched
                })
                .on('stroke', function(){
                    //element is being touched and the touchee is moving
                })
                .on('swipe', function(){
                    //element released after being stroked beyond the speed and distance thresholds for a swipe
                })
                .on('strokeend', function(){
                    //element released after being stroked (but not swiped)             
                })
                .on('touchup', function(){
                    //the touched element was released (and not swiped or dragged sufficiently)
                });
            */
            
        });
        
   };

}(jQuery));
/* how to invoke:
touchListener attaches a data-attribute object 'touchdata' to the touched element

$(".myTouchyElement").touchListener();

$(".myTouchyElement")
.on('touchdown', function(e){ 
    //aka touchstart  
    //element is touched (but not moving)
    console.log($(this).data('touchdata'));
})
.on('stroke', function(){
    //aka touchmove
    //the element is touched and moving (stroked)
    //commonly this may be used to mimic dragging
    console.log($(this).data('touchdata'));
})
.on('strokeend', function(){
    //element is released after stroking
    //not fired if swiped
    console.log($(this).data('touchdata'));
})
.on('swipe', function(){ 
    //element was stroked sufficiently fast and far (a swipe)
    //not fired if stroked slowly
    console.log($(this).data('touchdata'));
})
.on('touchup', function(){
    //aka touchend  
    //Touched element is released
    //not fired if swiped or dragged
    var touchdata = $(this).data('touchdata');
    testData.text(JSON.stringify(touchdata));
    testEvent.html("You <em>released</em> without dragging or swiping.");
});
*/
