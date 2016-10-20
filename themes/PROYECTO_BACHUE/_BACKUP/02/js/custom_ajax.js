function collLoad () {
    console.log( "collLoad" );
    // APPEND ANIMATION
    var coll = $("#coll_content"),
        animation = $('<div class="loading"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    coll.append(animation);
    // LOAD CONTENT    
    $.ajax({
        url: myAjax.ajaxurl,
        data: {
            'action': "sections"
        },
        success:function(data) {
            // IF LAST CHARACTER IS 1 OR 0 – REMOVE
            var lastChar = parseInt( data.slice(-1) );
            if ( lastChar === 1 || lastChar === 0 ) {
                data = data.slice(0, -1);
            }
            // HIDE ANIMATION
            coll.find(".loading").hide();
            // ADD DATA + FADE IN
            coll.html( data );
            // RUN FUNCTIONS ON LOAD
            gridManager();
            setTimeout( function(){
                coll.find(".ajax_wrapper").fadeIn(2000);
            }, 5000 );
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }
    }); 

 	
}


