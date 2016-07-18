function sectionLoad ( last ) {
	console.log( "sectionLoad", last );
    $.ajax({
        url: myAjax.ajaxurl,
        data: {
            'action': "sections",
		 	lastLoaded : last
        },
        success:function(data) {
            $("#wrapper").append("<section id='section_" + ( last + 2 ) + "''></section>");
            $("#wrapper").children("section").last().html( data );
        },
        error: function(errorThrown){
            console.log(errorThrown);
        }
    });  	
}


