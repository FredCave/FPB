<?php require_once("01__home_functions.php"); ?>

<div id="home" class="wrapper">
	<?php pb_get_home(); ?>
</div>

<div id="bottom_header_unfixed">
	<div id="bottom_header" class="header">
		<!-- IMAGE -->
		<span id="main_logo" class="">
			<a href="" data-id="1"><img src="<?php bloginfo( 'template_url' ); ?>/img/logo.svg" /></a>
		</span>
		<ul>
			<!-- MENU -->
			<li><a data-id="2" href="#sobre-nosotros">Sobre Nosotros</a></li>
			<li><a data-id="3" href="#publicaciones">Publicaciones</a></li>
			<li><a data-id="4" href="#exposiciones">Exposiciones</a></li>
			<li><a data-id="5" href="#noticias">Noticias</a></li>
			<li><a data-id="6" href="#la-coleccion">La colección</a></li>		
		</ul>
	</div>
</div>
