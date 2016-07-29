function sectionLoad ( last ) {
	console.log( "sectionLoad", last );
    $.ajax({
        url: myAjax.ajaxurl,
        data: {
            'action': "sections",
		 	lastLoaded : last
        },
        success:function(data) {
            // console.log( 10, data[0], data );
            // IF LAST CHARACTER IS 1 OR 0 – REMOVE
            var lastChar = parseInt( data.slice(-1) );
            if ( lastChar === 1 || lastChar === 0 ) {
                data = data.slice(0, -1);
            }
            $("#wrapper").append("<section id='section_" + ( last + 2 ) + "''></section>");
            $("#wrapper").children("section").last().html( data );
            // EXTRA FUNCTIONS ON LOAD
            // NEED TO WAIT UNITL IMAGES HAVE LOADED
            gridHeight();
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }
    });  	
}


