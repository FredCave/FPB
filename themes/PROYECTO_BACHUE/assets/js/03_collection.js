/************************************************

	CONTROLLER

************************************************/


var controllerCollection = {

	// CALL IN HTML
	submitCheck: function ( event ) {
		
		if ( event && event.keyCode == 13 ) {
			controllerCollection.passwordCheck();
		}

	},

	getPassAttempts: function () {

		return controllerPage.passAttempts;

	},

	updatePassAttempts: function () {

		controllerPage.passAttempts++;

	},

	passwordCheck: function ( ) {

		console.log("controllerCollection.passwordCheck");
		
		// HASH STORED IN HTML
		var hash = $("#pword_form").data("hash"),
			value = $.md5( $("#pword_input").val() ),
			maxAttempts = 5;

		if ( this.getPassAttempts() <= maxAttempts ) {

			if ( hash === value ) {
				console.log("Success.");
				// SUCCESS
				$("#coll_password").remove();
				// LOAD COLLECTION CONTENT
				collLoad();
			} else {
				// DISPLAY ERROR MESSAGE
				$("#error_message").text( $("#error_message").attr("data-trad-incorrect-es") );
			}	
			this.updatePassAttempts();	
		} else {
			// DISPLAY ERROR – TOO MANY ATTEMPTS
			$("#error_message").text( $("#error_message").attr("data-trad-too-many-es") );
		}
		// e.preventDefault();
		// return false;

	},

	textSearch: function ( input ) {

		console.log("controllerCollection.textSearch", input);

		// RESET GRID
		controllerSections.gridReset( $("#coll_list") );

		// RESET DROPDOWN FILTERS
		$(".theme").prop('selectedIndex', 0);	
		$(".type").prop('selectedIndex', 0);

		// LOOP THROUGH POSTS
		var listItem = $(".coll_post");
		listItem.each( function () {
			// TEXT INCLUDES TITLE + CONTENT
			var text = $(this).data("info") + $(this).find("h1").text();
			if ( text.toLowerCase().indexOf( input.toLowerCase() ) !== -1 ) { 
				$(this).show().removeClass("hidden");
			} else {
				$(this).hide().addClass("hidden");   	
			}       
		});

		// REDRAW GRID
		controllerSections.gridInit();

	},

	lettersInit: function () {

		console.log("controllerCollection.lettersInit");

		$("#coll_letters li").each( function(){
			var ltr = $(this).find("a").text().toLowerCase();
			// IF CLASS EXISTS
			if ( $("." + ltr).length ) {
				$(this).addClass("active");
			}
		});

	},

	letterClick: function ( click ) {

		console.log("controllerCollection.letterClick", click);

		if ( click.parent().hasClass("active") ) {
			var ltr = click.text().toLowerCase();
			// HIDE ALL POSTS
			$(".coll_post").hide().addClass("hidden");
			// LOOP THROUGH POSTS
			$(".coll_post").each( function(){
				// IF DATA-CLASS CONTAINS VALUE
				if ( $(this).hasClass(ltr) ) {
					$(this).show().removeClass("hidden");	
				}
			});
		}
		// HIGHLIGHT CLICKED LETTER
		$("#coll_letters").find(".clicked").removeClass("clicked");
		click.parent().addClass("clicked");
		
		// REDRAW GRID
		controllerSections.gridInit();
	},

	dropDown: function ( select ) {

		var value = select.val();

		// RESET SIBLING FILTERS
		select.parents(".filter").siblings().find("select").prop('selectedIndex', 0);
		// GRID RESET
		controllerSections.gridReset( $("#coll_list") );

		if ( value === "0" ) {
			console.log("Show all posts.");
			// SHOW ALL POSTS
			$(".coll_post").show().removeClass("hidden");
		} else {
			console.log( "Show only: ", value );
			// HIDE ALL POSTS
			$(".coll_post").hide().addClass("hidden");
			// LOOP THROUGH POSTS
			$(".coll_post").each( function(){
				// IF DATA-CLASS CONTAINS VALUE
				var dataClass = $(this).attr("data-class");
				if ( dataClass.indexOf(value) >= 0 ) {
					$(this).show().removeClass("hidden");	
				}
			});
		}

		// REDRAW GRID
		controllerSections.gridInit();
	},

	ajaxSuccess: function ( data ) {
		    
		console.log("controllerCollection.ajaxSuccess");
		
	    // ADD DATA + FADE IN
        $("#coll_content").html( data );
 
		controllerSections.gridInit();
        
		viewCollection.onAjaxSuccess();

	}

}

/************************************************

	VIEW

************************************************/

var viewCollection = {
	
	passwordInit: function () {

		$("#pword_form .text_input").on("keypress", function( event ) {

			if ( event && event.keyCode == 13 ) {
				controllerCollection.passwordCheck( event );
			}

		});

	},

	onAjaxSuccess: function () {

		console.log("viewCollection.onAjaxSuccess");

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
			controllerSections.gridOpen( $(this) );
		});

		coll.on( "click", ".grid_close", function(){
			controllerSections.gridClose( $(this) );
		});

	}

}


