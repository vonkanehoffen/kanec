<?php

// Kanec.co.uk wordpress theme

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head profile="http://gmpg.org/xfn/11">
	
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>"/>
	<title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php wp_head(); ?>
	
</head>

<body<?php //body_class(); ?>>
<!--[if lt IE 7]>
	<h2>WARNING: Your browser is out of date. Please <a href="http://www.mozilla.com/firefox/">update to a better one.</a></h2>
<![endif]-->
<div id="page">
	<div id="header">
		<a href="/" class="home_link">
			<img src="<?php bloginfo('template_url'); ?>/images/kanec.co.uk.png" alt="KANEC.CO.UK" />
		</a>
		<div id="nav">
			<ul>
				<li>
					<a href="/category/commercial/" class="hnav-commercial"><span>Commercial Work</span></a>
				</li>
				<li>
					<a href="/about-me/" class="hnav-about"><span>About Me</span></a>
				</li>
				<li>
					<a href="/category/blog/" class="hnav-blog"><span>Blog</span></a>
				</li>
				<li>
					<a href="/contact/" class="hnav-contact"><span>Contact</span></a>
				</li>
			</ul>
		</div>
	</div>