/* 0.8 */
(function ($) {
        
    $.fn.targetOpener = function (options) {
        var settings = $.extend({
            action: 'toggle',//toggle, open, close
            animation: 'slide', //'slide','fade','drawer','pop','text'
            duration: "normal", //Transition time taken to complete animation regardless of object size (in milliseconds or "slow", "normal", "fast" keyword)
            speed: 0, //if (>0) the transition duration is calculated in based on this speed (in pixels per seconds or "slow", "normal", "fast" keyword)
            easing: "swing", //standard jquery easing - 'swing' or 'linear'
            scrollToTarget: false, //scrolls to target
            ready: null //optional function callback on initialisation
        }, options);
        
        
        
        getCalcDuration = function(_target,_duration,_speed,_easing){
            var durations = {slow:600, fast:200, _default:400};//transition time        
            var speeds = {slow:100, fast:1000, _default:500};//pixels per second
            //duration may be a keyword
                if(parseInt(_duration) >= 0){
                    //
                } else {
                    if(durations.hasOwnProperty(_duration)){
                        _duration = durations[_duration];
                    } else {
                        _duration = durations._default;
                    }
                };
            //speed may be a keyword
                if(parseInt(_speed) >= 0){
                    //
                } else {
                    if(speeds.hasOwnProperty(_speed)){
                        _speed = speeds[_speed];
                    } else {
                        _speed = speeds._default;
                    }
                };
            //if speed is set we want to move at a pixelPerSecond speed:    
                if(_speed > 0){
                    //calculate the time to perform the transition at this speed
                    var _h = parseInt(_target.outerHeight());
                    _duration = Math.floor((_h/_speed)*1000);                    
                    //moving at a pps should have linear easing
                    _easing = "linear";
                };
            //return the calculated duration time and the easing
            return {duration:_duration, easing:_easing, h:_h};        
        }
        
        
        $.fn.targetOpener.destroy = function() {
            //remove ALL events bound to this plugin
            $("[data-target-reveal]").off().removeData();
            $("[data-self-reveal]").off().removeData();
            $("[data-accordion]").off().removeData();
            $("[data-child-toggler]").remove();
            $(".animwraptemp").remove();
            $(".opened .closed").removeClass(".opened .closed");
        }
        
        

        
        return this.each(function () {
            
            //unbind incase on re-initialisation
            $("body").targetOpener.destroy();
            
            var zis = $(this),
                standardTriggers = zis.find("[data-target-reveal]"),//look for linked targets
                childTogglers = zis.find("[data-self-reveal]"),//and self targets
                accordions = zis.find("[data-accordion]"),//and actual bonefide accordions
                cssReset = {height:'',width:'',overflow:'',marginTop:'',marginRight:'',marginBottom:'',marginLeft:'',paddingTop:'',paddingRight:'',paddingBottom:'',paddingLeft:''},//to reset styles afer animation
                open = function(o){
                    var selfRevealer = o.target.data("self-reveal") || o.target.data("child-toggler");
                    switch(o.animation){
                        case 'slide':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            var nextSibMargin = parseInt(o.target.next().css("margin-top"));
                            if (!selfRevealer && o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<div class='animwraptemp' style='position:relative; overflow:hidden; margin-top:-"+prevSibMargin+"px; padding:0!important;'></div>");
                            } 
                            o.target.slideDown({
                                "duration":o.duration,
                                "easing":o.easing,
                                "complete":function(){if(o.target.has(".animwraptemp")){o.target.unwrap();}}
                                });
                            o.target.parent(".animwraptemp").animate(
                                {marginTop:0, marginBottom:0},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'fade':
                            o.target.fadeIn({"duration":o.duration,"easing":o.easing});
                            break;
                        case 'drawer':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            if (o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<div class='animwraptemp' style='position:relative; overflow:hidden; margin-top:-"+prevSibMargin+"px; padding:0!important;'></div>");
                            }
                            var h = parseInt(o.target.outerHeight()*-1)+"px";
                            o.target.css({ height: "", overflow:"hidden", display:"block", "margin-top":h});
                            o.target.animate(
                                {marginTop:0},
                                {"duration":o.duration,
                                 "easing":o.easing,
                                 "complete":function(){o.target.css(cssReset).css("display",""); if(o.target.has(".animwraptemp")){o.target.unwrap();}}
                                });
                            o.target.parent().animate(
                                {marginTop:0, marginBottom:0},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'pop':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            if (o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<div class='animwraptemp' style='position:relative; margin-top:0;overflow:hidden;'></div>");
                            }
                            var h = o.target.outerHeight();
                            var w = o.target.outerWidth();
                            var p = {t:0+o.target.css("padding-top"),r:0+o.target.css("padding-right"),b:0+o.target.css("padding-bottom"),l:0+o.target.css("padding-left")};
                            o.target.css({height:0, width:0, "padding":0, overflow:"hidden", display:"", "margin-left":w/2});
                            o.target.animate(
                                {"margin-left":0, width:w, height:h, "padding-top":p.t, "padding-right":p.r, "padding-bottom":p.b, "padding-left":p.l},
                                {"duration":o.duration,
                                 "easing":o.easing,
                                 "complete":function(){o.target.css(cssReset).css("display",""); if(o.target.has(".animwraptemp")){o.target.unwrap();}}
                                });
                             o.target.parent().animate(
                                {marginTop:0, marginBottom:0},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'text':
                            var t = o.target.data("text") || o.target.text();
                            var n = t.length;
                            var step = n/o.duration;                            
                            o.target.text("");
                            o.target.css("display","");
                            o.target.data("text",t);
                            var i = 0;
                            function text_loop() {
                                o.target.text(t.substring(0,i));
                                setTimeout(function() { i++; if (i <= n) { text_loop(); } }, step);
                            };
                            text_loop();
                            break;
                        default:
                            o.target.show({"duration":o.duration,"easing":o.easing});
                    }
                    /*toggle classnames */
                    o.target.removeClass("closed").addClass("opened");
                    o.triggers.removeClass("closed").addClass("opened");
                },
                close = function(o){
                    var selfRevealer = o.target.data("self-reveal") || o.target.data("child-toggler");
                    switch(o.animation){
                        case 'slide':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            if (!selfRevealer && o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<div class='animwraptemp' style='position:relative; overflow:hidden; margin-top:0px; padding:0!important;'></div>");
                            }
                            o.target.slideUp({
                                "duration":o.duration,
                                "easing":o.easing,
                                "complete":function(){o.target.css({marginTop:"",marginBottom:""}); 
                                                      if(o.target.has(".animwraptemp")){o.target.unwrap();}
                                                     }
                                });
                            o.target.parent(".animwraptemp").animate(
                                {marginTop:-prevSibMargin},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'fade':
                            o.target.fadeOut({"duration":o.duration,"easing":o.easing});
                            break;
                        case 'drawer':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            if (o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<span class='animwraptemp' style='display:block;position:relative; overflow:hidden; margin:0px'></span>");
                            }
                            var mt = o.target.outerHeight() * -1;
                            o.target.css({marginTop:0,marginRight:0,marginLeft:0,height:"", overflow:"hidden", display:"block"});
                            o.target.animate(
                                {marginTop:mt},
                                {"duration":o.duration,
                                 "easing":o.easing,
                                 "complete":function(){o.target.css(cssReset).css("display","none"); if(o.target.has(".animwraptemp")){o.target.unwrap();}}
                                });
                            o.target.parent().animate(
                                {marginTop:-prevSibMargin},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'pop':
                            var prevSibMargin = parseInt(o.target.prev().css("margin-bottom"));
                            if (o.target.parent().not(".animwraptemp")){
                                o.target.wrap("<div class='animwraptemp' style='position:relative; overflow:hidden; margin:0px;'></div>");
                            }
                            var h = o.target.height();
                            var w = o.target.width();                            
                            var p = {t:0+o.target.css("padding-top"),r:0+o.target.css("padding-right"),b:0+o.target.css("padding-bottom"),l:0+o.target.css("padding-left")};
                            o.target.css({ height:h, width:w, "padding-top":p.t, "padding-right":p.r, "padding-bottom":p.b, "padding-left":p.l, overflow:"hidden", display:"block", "margin":0});
                            o.target.animate(
                                {marginTop:0,marginRight:0,marginBottom:0,marginLeft:w/2, width:0, height:0, padding:0},
                                {"duration":o.duration,
                                 "easing":o.easing,
                                 "complete":function(){
                                     o.target.css(cssReset).css("display","none"); 
                                     if(o.target.has(".animwraptemp")){o.target.unwrap();}}
                                });
                            o.target.parent().animate(
                                {marginTop:-prevSibMargin},
                                {"duration":o.duration,
                                 "easing":o.easing
                                });
                            break;
                        case 'text':
                            var t = o.target.data("text");
                            var n = t.length;
                            var step = n/o.duration;
                            o.target.css("display","");
                            var i = n;
                            function text_loop() {
                                o.target.text(t.substring(0,i));
                                setTimeout(function() { i--; if (i >= 0) { text_loop(); } if (i==0){o.target.css("display","none");} }, step);
                            };
                            text_loop();
                            break;
                        default:
                            o.target.hide({"duration":o.duration,"easing":o.easing});
                    }
                    /*toggle classnames */
                    o.target.removeClass("opened").addClass("closed");
                    o.triggers.removeClass("opened").addClass("closed");
                }
            
            
            
            
            
            /* standard triggers - open/closes/toggles matched children by id */
            standardTriggers.each(function(){
                
                var trigger = $(this),
                    triggers = $("[href='"+trigger.attr("href")+"']"),
                    target = $(""+trigger.attr("href")),
                    vdata = trigger.data("target-reveal"),
                    action = vdata.action || settings.action,
                    scrollToTarget = vdata.scrollToTarget || settings.scrollToTarget,
                    animation = vdata.animation || settings.animation,
                    duration = vdata.duration || settings.duration,
                    speed = vdata.speed || settings.speed,
                    easing = settings.easing;
                

                //console.log("speed="+speed+" ("+target.attr('id')+")");
                var calced = getCalcDuration(target,duration,speed,easing);
                duration = calced.duration;
                easing = calced.easing;
                
                
                  

                //set initial state
                //if(vdata.hasOwnProperty("opened")){
                if(vdata.hasOwnProperty("state") && vdata.state == "revealed"){
                    target.show();
                    /*toggle classnames */
                    target.removeClass("closed").addClass("opened");
                   trigger.removeClass("closed").addClass("opened");
                } else {
                    target.hide();
                    /*toggle classnames */
                    target.removeClass("opened").addClass("closed");
                    trigger.removeClass("opened").addClass("closed");
                }
                
                                
                //object to pass to the open/close functions 
                var o = {"trigger":trigger,"triggers":triggers,"target":target,"animation":animation,"duration":duration,"easing":easing};
                
                //console.log(o);
                
                //events
                trigger.off("fire").off("click")
                .on('click', function(){
                    $(this).trigger("fire");
                    return false;
                })
                .on('fire', function(){
                    target.stop(true,true);
                    var opened = target.is(':visible');
                    if(action == "toggle"){
                        if(opened){
                            close(o);
                        } else {
                            open(o);
                        }
                    } else if(action == "open" && !opened){
                        open(o);
                    } else if(action == "close" && opened){
                        close(o);
                    }
                    //scroll to
                    if(scrollToTarget){
                        $('html,body').animate({
                          scrollTop: target.offset().top
                        }, duration);
                    }
                    //return
                    return false;
                })
                
            });
            /* end standard triggers */
            



            
            /* child togglers - prepends a trigger to open/closes/toggle self */
            childTogglers.each(function(){
                var target = $(this),
                    vdata = target.data("self-reveal"),
                    trigger = $("<a href='#' data-child-toggler='true'>...</a>"),
                    triggerType = (vdata.openText && vdata.closeText)?"toggle":(vdata.closeText)?"close":"open",
                    action = (vdata.openText && vdata.closeText)?"toggle":(vdata.closeText)?"close":"open",
                    scrollToTarget = vdata.scrollToTarget || settings.scrollToTarget,
                    animation = vdata.animation || settings.animation,
                    duration = vdata.duration || settings.duration,
                    speed = vdata.speed || settings.speed,
                    easing = settings.easing;
                
                var calced = getCalcDuration(target,duration,speed,easing);
                duration = calced.duration;
                easing = calced.easing;
                
                //inset the trigger
                trigger.insertAfter(target);
                                
                //set initial state
                //if(vdata.hasOwnProperty("opened")){
                if(vdata.hasOwnProperty("state") && vdata.state == "revealed"){
                    target.show();
                    trigger.text(vdata.closeText);
                    /*toggle classnames */
                    target.removeClass("closed").addClass("opened");
                    trigger.removeClass("closed").addClass("opened");
                } else {
                    target.hide();
                    trigger.text(vdata.openText);
                    /*toggle classnames */
                    target.removeClass("opened").addClass("closed");
                    trigger.removeClass("opened").addClass("closed");
                }
                
                //object to pass to the open/close functions 
                var o = {"trigger":trigger,"triggers":trigger,"target":target,"animation":animation,"duration":duration,"easing":easing};
                    
                //events
                trigger.off("fire").off("click")
                .on('click', function(){
                    $(this).trigger("fire");
                    return false;
                })
                .on('fire', function(){
                    target.stop();
                    var opened = target.is(':visible');
                    if(action == "toggle"){
                        if(opened){
                            close(o);
                            trigger.text(vdata.openText);
                        } else {
                            open(o);
                            trigger.text(vdata.closeText);
                        }
                    } else if(action == "open" && !opened){
                        open(o);
                        var oo = o;
                        oo.target=trigger;
                        close(oo);
                    } else if(action == "close" && opened){
                        close(o);
                    }
                    //scroll to
                    if(scrollToTarget){
                        $('html,body').animate({
                          scrollTop: target.offset().top
                        }, duration);
                    }
                    //return
                    return false;
                })
                
            });  
            /* child togglers */
            



            
            /* accordions  */
            accordions.each(function(){
                var accordion = $(this),
                    blocks = accordion.children(),
                    triggers = blocks.children(':first-child'),
                    targets = blocks.children(':first-child').next(),
                    vdata = accordion.data("accordion"),
                    scrollToTarget = vdata.scrollToTarget || settings.scrollToTarget,
                    action = vdata.action || settings.action,
                    animation = vdata.animation || settings.animation,
                    duration = vdata.duration || settings.duration,
                    speed = vdata.speed || settings.speed,
                    easing = settings.easing;
                
               
                
                //for each block
                blocks.each(function(index){
                    var block = $(this),
                        trigger = block.children(':first-child'),
                        target = trigger.next();
                    
                    target.hide();
                    
                    //set initial state
                    //if(vdata.hasOwnProperty("opened")){
                    console.log(index);
                    if(vdata.hasOwnProperty("state") && vdata.state == "revealIndex"+index){
                        target.show();
                        /*toggle classnames */
                        target.removeClass("closed").addClass("opened");
                        trigger.removeClass("closed").addClass("opened");
                    } else {
                        target.hide();
                        /*toggle classnames */
                        target.removeClass("opened").addClass("closed");
                        trigger.removeClass("opened").addClass("closed");
                    }
                    
                    
                    
                    //events
                    trigger.off("fire").off("click")
                    .on('click', function(){
                        $(this).trigger("fire");
                        return false;
                    })
                    .on('fire', function(){
                        var calced = getCalcDuration(target,duration,speed,easing);
                        //console.log(calced);
                        
                        //object to pass to the open/close functions 
                var o = {"trigger":trigger,"triggers":trigger,"target":target,"animation":animation,"duration":calced.duration,"easing":calced.easing};
                        target.stop(false,true);//close all
                        targets.each(function(){ 
                            var trg = $(this),
                                trig = trg.prev(),
                                calc = getCalcDuration(trg,duration,speed,easing),
                                dur = calced.duration,
                                eas = calced.easing,
                                //dur = (speed > 0)?calcDuration(trg,speed):duration,
                                //eas = (speed > 0)?"linear":easing,
                                xo = {"trigger":trig,"triggers":trig,"target":trg,"animation":animation,"duration":dur,"easing":eas};
                            /**/
                            //console.log(trg.text()+"!=="+target.text());
                            //console.log("trg==target="+(trg.text()==target.text())?"yay":"nay");
                            if(trg.is(':visible')){
                                trg.stop(true,false);//close all
                                close(xo);
                            }
                        });
                       // target.stop(false,true);//close all
                        var opened = target.is(':visible');
                        //console.log("opened"+opened);
                        if(action == "toggle"){
                            if(opened){
                                //close(o);
                            } else {
                                open(o);
                            }
                        } else if(action == "open" && !opened){
                            open(o);
                        } else if(action == "close" && opened){
                            //close(o);
                        }
                        //scroll to
                        if(scrollToTarget){
                            $('html,body').animate({
                              scrollTop: target.offset().top
                            }, duration);
                        }
                        //return
                        return false;
                    })
                
                
                });
                
                
            });
             
            /*callback?*/
            if ($.isFunction(settings.ready)) {
                settings.ready.call(this);
            } 
                
            
        });
        
   };

}(jQuery));
$("body").targetOpener();
/* This plugin is automatically invoked with the default setting on all matched elements within the body. If you want to envoke it with custom global settings (rather than change the inline settings for each instance) you can simply invoke the plugin again as follows:

$(function(){
    $("#testWrapper").targetOpener({
        action: 'toggle',//'toggle', 'open', 'close'
        animation: 'pop',//'slide','fade','drawer','pop','text'
        duration: 300,//time taken to complete animation regardless of object size (in milliseconds or "slow", "normal", "fast" keyword)
        speed: "fast", //if >0, the transition duration is calculated in based on this speed (in pixels per seconds or "slow", "normal", "fast" keyword)
        easing: "swing", //standard jquery easing - 'swing' or 'linear'
        scrollToTarget: false, //scrolls to target
        ready: function(){alert("GOO is ready!");} //optional function callback on initialisation
    });
});
 */