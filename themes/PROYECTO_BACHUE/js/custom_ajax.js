function sectionLoad ( last ) {
    console.log( "sectionLoad", last + 1 );
    $.ajax({
        url: myAjax.ajaxurl,
        data: {
            'action': "sections",
            lastLoaded : last 
        },
        success:function(data) {
            // IF LAST CHARACTER IS 1 OR 0 – REMOVE
            var lastChar = parseInt( data.slice(-1) );
            if ( lastChar === 1 || lastChar === 0 ) {
                data = data.slice(0, -1);
            }
            var animation = $('<div class="loading"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            if ( last >= 5 ) {
                // IF LAST SECTION NO ANIMATION
                animation = $("");
                // REDUCE #WRAPPER BOTTOM PADDING
                $("#wrapper").css( "padding-bottom", "200px" );
            }
            // HIDE PREV LOADING ANIMATION
            $( "#section_" + ( last + 1 ) ).prev().find(".loading").hide();
            // ADD DATA + FADE IN
            $( "#section_" + ( last + 1 ) ).html( data ).append( animation ).delay(200).fadeIn(2000);
            // EXTRA FUNCTIONS ON LOAD
                // TO DO: NEED TO WAIT UNITL IMAGES HAVE LOADED
            gridHeight();
            // UPDATE LASTLOADED
            last += 1;
            $("#wrapper").attr( "data-loaded", last );
            // TRIGGER EVENT ONCE DATA HAS LOADED
            $("#wrapper").trigger("ajax_ready");
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }
    }); 

 	
}


