<?php require_once("02__about_functions.php"); ?>

<div id="bottom_header" class="header">
	<ul>
		<!-- IMAGE -->
		<span id="main_logo">
			<img src="<?php bloginfo( 'template_url' ); ?>/img/logo.png" />
		</span>
		<!-- MENU -->
		<li><a data-id="1" href="#sobre-nosotros">Sobre Nosotros</a></li>
		<li><a data-id="2" href="#publicaciones">Publicaciones</a></li>
		<li><a data-id="3" href="#exposiciones">Exposiciones</a></li>
		<li><a data-id="4" href="#noticias">Noticias</a></li>
		<li><a data-id="5" href="#la-coleccion">La colección</a></li>		
	</ul>
</div>

<div id="sobre-nosotros" class="wrapper">

	<div class="col_1 col">
		<!-- ABOUT -->
		<?php echo pb_get_about(); ?>

		<!-- COLLECTION TEXT -->
		<?php echo pb_get_collection(); ?>

	</div>

	<div class="col_2 col">
		<!-- ABOUT IMAGE -->
		<div id="main_image">
			<?php $img = pb_get_about_img();
			pb_image_object( $img ); ?>
		</div>
		<!-- LINKS -->
		<?php pb_get_links(); ?>
	</div>

</div>