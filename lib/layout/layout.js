    /*
     * split4Into2();
     * SPLITS ROWS OF 4 COLUMNS INTO 2 ROWS OF 2 COLUMNS WHEN REQUIRED
     * (requires jQuery)
     *
     * If a particuar CSS attribute matches a specific value then split a 4-column row in to 2 rows of 2.
     * This is currently set for .one-fourth to have 'empty-cells:hide' for narrow viewports.
     * Where matched, the function is applied.
     */

  (function () {
    function split4Into2() {
      var cssAttr = "empty-cells", cssVal = "hide", //the trigger css attr and value
        $quarterCells = $(".table .one-fourth, .wasTable .one-fourth"), //all .one-fouth cells
        applyMethod = ($quarterCells.css(cssAttr) === cssVal), i = 0, //should we apply the method? look for a match.
        alreadyApplied = ($(".table .injectedTableRow, .wasTable .injectedTableRow").length > 0); //has it already been applied (we dont want to re-apply it)
      if (applyMethod && !alreadyApplied) {//apply if not already done so
        $quarterCells.parent().removeClass("table").addClass("wasTable");
        for (i = 0; i < $quarterCells.length; i += 2) {
            $quarterCells.slice(i, i+2).wrapAll("<div class='table injectedTableRow'></div>");
        }
        } else if(!applyMethod && alreadyApplied){//unwrap any previously wrapped block whites:
            $(".injectedTableRow > .block").unwrap();
            $quarterCells.parent().addClass("table").removeClass("wasTable");
        }
    }
        //on dom ready call this
        $(function(){split4Into2();});
        //on resize call this
        $(window).resize(function(){split4Into2();});
    }());
/*
 * END split4Into2();
 */