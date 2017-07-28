/*! Accordion 1.0
 * ==========================
 * @desc - Simple accordion
 * @requires - jQuery 1.7+ | The associated css (accordion.css)
 * @notes - 
 */  
(function ($) {
    $.fn.extend({
        accordion: function () {

            function setActive(self, $el) {
                var hash = $el.attr('href');
                var elm = $(hash);

                if (elm.length > 0) {
                    $(self).find(".accordion-open > div").slideUp(200)
                    $(self).find(".accordion-open").removeClass("accordion-open");

                    $(self).find(".accordion-active").removeClass("accordion-active");
                    elm.addClass('accordion-open');
                    elm.find("div:first").slideDown(200);
                    $(self).find('a[href=' + hash + ']').parent().addClass('accordion-active');
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

                //triggers
                $(this).find("a[href^='#']").on("click", function(e) {
                    e.preventDefault();
                    if(!$(this).parent().hasClass("accordion-open")){
                        setActive(self, $(this));
                        return false;    
                    } else {
                        $(this).parent().removeClass("accordion-open");
                        $(this).parent().removeClass("accordion-active");
                        $(this).siblings("div").slideUp(200);
                    }
                });

                //default accordion-active
                var firstActive = ($(this).find('li.accordion-active a').length > 0) ? $(this).find('li.accordion-active a') : $(this).find('li:first a');
                firstActive.click();

                //location hash
                // if (location.hash) {
                //     setActiveViaHash(self, location.hash);
                // }

                // if ("onhashchange" in window) {
                //     window.onhashchange = setActiveViaHash(self, location.hash);
                // }

            });
        }
    });
})(jQuery);


//by default, initialise on elements with the class of .tabbed...
$(document).ready(function () {
    $('.accordion').accordion();
});