function collLoad () {
    console.log( "collLoad" );
    // APPEND ANIMATION
    var animation = $('<div class="loading"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    $("#coll_content").append(animation);
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
            $("#coll_content").find(".loading").hide();
            controllerCollection.ajaxSuccess( data );
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }
    }); 

 	
}


