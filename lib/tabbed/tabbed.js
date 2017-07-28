/*! Tabs 1.0.4
 * ==========================
 * @desc - Coverts html to display as tabbed 'pages' (with a dropdown for overflowed tabs) and switches to a concertina for mobile
 * @requires - jQuery 1.7+ | The associated css (tabs.css)
 * @notes - For responsive styling use https://github.com/tysonmatanich/elementQuery to add element queries (see example.html)
 */  
(function ($) {
    $.fn.extend({
        tabme: function (callback) {

            function setActive(self, $el) {
                //console.log($el);
                var hash = $el.attr('href');
                var elm = $(hash);
                if (elm.length > 0) {
                    $(self).find(".open > div").slideUp(200);
                    $(self).find(".open").removeClass("open");
                    $(self).find(".active").removeClass("active");
                    elm.addClass('open');
                    elm.find("div:first").slideDown(200);
                    $(self).find('a[href=' + hash + ']').parent().addClass('active');
                    //set the overflow tab as active
                    $(self).find('ul ul.overflowTabs li.active').parent().parent().addClass("active");
                }
            }

            function setActiveViaHash(self, hash) {
                var matched = $(self).find("a[href='" + hash + "']");
                if (hash && matched.length > 0) {
                    setActive(matched);
                }
            }


            return this.each(function () {
                var self = this;

                //Set up html for if its viewed as an accordion
                //clone tab links to their accordion sections
                //var $ul = $(self).find('ul').first();
                $(self).find('ul:first > li a').each(function () {
                    var hash = $(this).attr('href');
                    if(hash.indexOf("#")===0 && hash.length > 1){//so long as the href is an achorred link
                        $(this).addClass("tabtrigger");//cuson classname so we dont get mixed up
                        var section = $('section' + hash);
                        section.wrapInner("<div></div>")
                        $(this).clone().prependTo('section' + hash);
                    }
                });

                //triggers
                $(this).find("a.tabtrigger").on("click", function (e) {
                    e.preventDefault();
                    //console.log($(this))
                    // $('.overflowTabs').hide(); //Don't need to hide as it's CSS now
                    if(!$(this).parent().hasClass("active")){
                        setActive(self, $(this));
                    }
                        return false;    
                }); 

                //default active
                var firstActive = ($(this).find('li.active a:visible').length > 0) ? $(this).find('li.active a:visible') : $(this).find('li:first a:visible');
                console.log(firstActive);
                firstActive.parent().removeClass("active");
                firstActive.click();

                //location hash
                if (location.hash) {
                    setActiveViaHash(self, location.hash);
                    
                    if ("onhashchange" in window) {
                        window.onhashchange = setActiveViaHash(self, location.hash);
                    }
                }

                //Delegate overflowTab listener as it's not always there. - Commented this out as not sure if it will work with this version
                // $(".tabbed").off().on('click','.overflowTab',function(e){
                //     e.preventDefault();
                //     //$('.overflowTabs').toggle();
                //     $('.overflowTabsParent').toggleClass("overflowOn");
                // });


                function overflowTabs() {
                    /* get the tabs that are wrapping/beyond the viewport and present them in a dropdown list */
                    var parentW = $(self).find('ul').first().width();
                    var childW = 0; //$(self).find('ul > li').outerWidth(true);
                    var extraSpaceForDropAdded = false;
                    var $ul = $(self).find('ul').first();

                    //uwrap previously wrapped
                    $ul.find('.overflowTabs').unwrap();
                    $ul.find('.overflowTabs li').unwrap();
                    $ul.find('.overflowTab').remove();


                    $(self).find('ul:first > li').each(function () {
                        childW = childW + $(this).outerWidth(true);
                        $(this).removeClass("overflow");
                    })

                    childW = (childW > parentW) ? 91 : 0; //space for the overflow tab else 4 px margin 
                    var overflow = [];

                    $(self).find('ul:first > li').each(function () {
                        childW = childW + $(this).outerWidth(true);
                        if (childW > parentW) {
                            overflow.push($(this));
                            $(this).addClass("overflow");
                        }
                    })

                    //if there are some overflowing

                    if (overflow.length > 0) { //wrap the new ones
                        $ul.find('li.overflow').wrapAll("<ul class='overflowTabs'>");
                        $ul.find('.overflowTabs').wrap("<li class='overflowTabsParent'>").before("<a class='overflowTab' href='#'>+</a>");

                        //set the overflow tab as active
                        $ul.find('.overflowTabs li.active').parent().parent().addClass("active");
                    }

                }
                overflowTabs();
                callback(self);
                $(window).resize(function (e) {
                    overflowTabs();
                });

            });
        }
    });
})(jQuery);


//by default, initialise on elements with the class of .tabbed...
$(document).ready(function () {
    $('.tabbed').tabme(function(s){
        if($(s).parents(".journeyplanner").length > 0){
            if(!$(s).parent().hasClass('populated')){
                $(s).parent().hide();
            }
        }
    });
});