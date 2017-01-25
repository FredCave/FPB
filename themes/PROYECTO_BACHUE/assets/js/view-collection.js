var viewCollection = {
	
	passwordInit: function () {

		$("#pword_form .text_input").on("keypress", function( event ) {

			if ( event && event.keyCode == 13 ) {
				controllerCollection.passwordCheck( event );
			}

		});

	},

	onAjaxSuccess: function () {

		var coll = $("#coll_content"),
			collTop = $("#coll_list").offset().top;

		controllerCollection.lettersInit();

		coll.on( "click", "#coll_letters a", function(e){
			e.preventDefault();
			controllerCollection.letterClick( $(this) );
		}).on( "keyup", "#search_input", function () {
			controllerCollection.textSearch( $("#search_input").val() );
		}).on( "change", "#coll_filter select", function(e) {
			e.preventDefault();
			controllerCollection.dropDown( $(this) );
		});

		setTimeout( function(){
        	coll.find(".content_wrapper").fadeIn(2000);
        }, 5000 );
        
        // IF MOBILE SCROLL TO TOP OF COLLECTION
        if ( $("#wrapper").hasClass("mobile") ) {
            $("html,body").animate({
                scrollTop : collTop
            }, 500 );
        }

		coll.on("click", ".image_cell_toggle", function(){
			controllerPage.gridOpen( $(this) );
		});

		coll.on( "click", ".grid_close", function(){
			controllerPage.gridClose( $(this) );
		});

	}

}