<?php

// Kanec.co.uk wordpress theme

get_header(); ?>

<?php
if(is_home()) {
	$args = array(
		'posts_per_page' => 4,
		'post__in'  => get_option('sticky_posts')
	);

	query_posts($args);
};
?>

<?php if (have_posts()) : ?>
	
	<?php if(is_category()) : //If we're on a category view, print the name and description ?>
		<div class="description">
			<h2>
				<?php 
					$post_cat = get_the_category(); 
					// foreach ($post_cat as $cat) {
					// 	echo $cat->name;
					// };
					echo $post_cat[0]->name;
				?>
			</h2>
			<h3>
				<?php 
					$bad_tags = array("<p>", "</p>");
					$cat_desc = str_replace($bad_tags, "", category_description());
					echo $cat_desc;
				?>
			</h3>
		</div>
	<?php endif; ?>

	<?php while (have_posts()) : the_post(); ?>
		
		<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
			<div class="inner">
				<div class="entry">
					<?php if(!in_category(array('blog','banner'))) { ?><h2 class="post-title"><?php the_title(); ?></h2><?php }; // don't show title on sticky post ?>
					<?php the_content('<span>More</span>'); ?>
					<?php //comments_template(); ?>
					<div class="clear"></div>
				</div>
				
			</div>
		</div>
		
	<?php endwhile; ?>
	
	<?php if (is_home()) : // show nav link straight to commercial on home page ?>
		<div class="page_nav">
			<a href="/category/commercial/" class="see_more"><span>See More $raquo;</span></a>
		</div>
	<?php endif; ?>
	
	<?php else : ?>

		<h2>Not Found</h2>
		<p>Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

<?php endif; ?>
<?php wp_reset_query(); ?>
<?php get_footer(); ?>