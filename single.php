<?php

// Kanec.co.uk wordpress theme

get_header(); ?>

<?php if (have_posts()) : ?>

	<?php while (have_posts()) : the_post(); ?>
	
		<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
			<div class="inner">
				<div class="entry">
					<?php if(!in_category(array('blog','banner'))) { ?><h2 class="post-title"><?php the_title(); ?></h2><?php }; // don't show title on sticky post ?>
					<?php the_content('Continue Reading / Screenshots &raquo;'); ?>
					<?php if(in_category('blog')) { comments_template(); }; ?>
					<div class="clear"></div>
				</div>
				
			</div>
		</div>
	
	<?php endwhile; ?>


	<?php else : ?>

		<h2>Not Found</h2>
		<p>Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

<?php endif; ?>

<?php get_footer(); ?>
