/* STYLED ALERT
 * ============
 * Replaces JavaScript's native alert() with a custom styled modal alert
 * Self-invoking anonymous function. Requires jQuery so doesnt initialise until dom ready
 * To Use: Just include this script on your page - it replaces the native alert so simply make a normal js alert. EG: alert("I am an alert");
 * Optional: You can use HTML in your message and set the button text if you wish eg: alert("<h1>Woah</h1><p>Keep it minimal - this is an alert after all!</p>","Alrighty!")
 */ 
(function(){
    var customAlert = {
        alertDialog : $("<div id='alertDialog'><div id='dialog-box'><div id='dialog-message'>message</div><div id='dialog-button-row'><a href='#'>Okay</a></div></div></div>"),
        styles : "#alertDialog {display:none;position:fixed;top:0;right:0;bottom:0;left:0;background:#222222;background-color:rgba(0,0,0,.75);text-align:center;z-index:999999;}"
                +"#alertDialog #dialog-box {background-color:#ffffff;width:500px;max-width:80%;margin:auto;display:inline-block;vertical-align:middle;}"
                +"#alertDialog:before {content:'';display:inline-block;height:100%;vertical-align:middle;margin-right:-0.25em;}"
                +"#alertDialog #dialog-message {margin:0;padding:30px;text-align:center;}"
                +"#alertDialog #dialog-button-row {background:none repeat scroll 0 0 rgba(100, 100, 100, 0.1);}"
                +"#alertDialog #dialog-button-row a {background:rgb(192, 11, 23);color:rgb(255, 255, 255);padding:5px 10px;display:inline-block;margin:15px;text-decoration:none;}"
                +"#alertDialog #dialog-button-row a:hover {background:#666;}"
                +"body.alertIsOpen {overflow:hidden;}"
                +"body.alertIsOpen section {filter:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIGlkPSJnYXVzc2lhbl9ibHVyIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjEuNiIgLz4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KPC9zdmc+#gaussian_blur);-webkit-filter:blur(2px);-moz-filter:blur(2px);-ms-filter:blur(2px);-o-filter:blur(2px);filter:blur(2px);}",
        init : function(){
            //attach styles
            customAlert.attachStyle();
            //attach markup
            this.alertDialog.hide();
            $("body").append(customAlert.alertDialog);
            //bind key events
            $(document).bind('keydown', function(e){
                e.preventDefault();
                var key = e.which || e.keyCode || e.charCode;
                switch (key){
                    case 13: //rtn
                    case 27: //esc
                    customAlert.close();
                    break;
                }
            });
            if(customAlert.alertDialog.css("position")=="fixed" || customAlert.alertDialog.css("position")=="absolute"){
                //found some custom style - refactor the native alert to show our custom alert instead      
                window.alert = function(msgText,btnTxt){
                    customAlert.open(msgText,btnTxt);
                }
            } else {                
                console.warn("Unable to find suitable styling for the Styled Alert. Expected #alertDialog{position:[absolute|fixed]}");
            }
        },
        attachStyle : function(){
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style'),
                css = customAlert.styles;
            style.type = 'text/css';
            if (style.styleSheet){//IE
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        },
        open : function(msgTxt,btnTxt){
            var msg = this.alertDialog.find("#dialog-message"),
                btn = this.alertDialog.find("#dialog-button-row a");
            msg.html(msgTxt);
            if(btnTxt){btn.text(btnTxt);}
            btn.off().on("click", function(){
                customAlert.close();
                return false;
            });
            this.alertDialog.show();
            $("body").addClass("alertIsOpen");
        },
        close : function(){
            this.alertDialog.hide();
            $("body").removeClass("alertIsOpen");
        }
    }
    //requires jQuery so we dont initialise until dom ready
    $(function(){
        customAlert.init();
    });
})();
/* end STYLED ALERT */