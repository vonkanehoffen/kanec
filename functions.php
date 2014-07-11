<?php

// functions for Kanec

// SHORTCODES

function sc_clear($atts) {
	return '<div class="clear"></div>';
}
add_shortcode('clear', 'sc_clear');

function sc_gallery( $atts, $content = null ) {
   extract( shortcode_atts( array(
      'class' => '',
      ), $atts ) );
 
   return '<div class="clear"></div><div class="gallery ' . esc_attr($class) . '">' . $content . '<div class="clear"></div></div>';
}
add_shortcode('kgallery', 'sc_gallery');

function sc_box( $atts, $content = null ) {
   extract( shortcode_atts( array(
      'class' => '',
      ), $atts ) );
 
   return '<div class="kbox ' . esc_attr($class) . '">' . $content . '</div>';
}
add_shortcode('kbox', 'sc_box');

// EXCLUDE BLOG CATEGORY FROM HOME PAGE

add_action('pre_get_posts', 'remove_blog_cat' );

function remove_blog_cat( $notused )
{
  global $wp_query;
  global $gloss_category;

  // Figure out if we need to exclude glossary - exclude from
  // archives (except category archives), feeds, and home page
  if( is_home() ) {
     $wp_query->query_vars['cat'] = '-7';
  }
}

?>