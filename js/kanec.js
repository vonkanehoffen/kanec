////////////////////////////////////////////////////
// COMBINED JS FOR KANEC.CO.UK
// SEE ACTIONS AT BOTTOM
// FILE INTENTIONALLY LUMPED TOGETHER TO CUT DOWN ON HTTP REQUESTS
////////////////////////////////////////////////////

/**
 * jQuery lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and adapted to me for use like a plugin from jQuery.
 * @name jquery-lightbox-0.5.js
 * @author Leandro Vieira Pinho - http://leandrovieira.com
 * @version 0.5
 * @date April 11, 2008
 * @category jQuery plugin
 * @copyright (c) 2008 Leandro Vieira Pinho (leandrovieira.com)
 * @license CC Attribution-No Derivative Works 2.5 Brazil - http://creativecommons.org/licenses/by-nd/2.5/br/deed.en_US
 * @example Visit http://leandrovieira.com/projects/jquery/lightbox/ for more informations about this jQuery plugin
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
	/**
	 * $ is an alias to jQuery object
	 *
	 */
	$.fn.lightBox = function(settings) {
		// Settings to configure the jQuery lightBox plugin how you like
		settings = jQuery.extend({
			// Configuration related to overlay
			overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
			overlayOpacity:			0.8,		// (integer) Opacity value to overlay; inform: 0.X. Where X are number from 0 to 9
			// Configuration related to navigation
			fixedNavigation:		false,		// (boolean) Boolean that informs if the navigation (next and prev button) will be fixed or not in the interface.
			// Configuration related to images
			imageLoading:			'/wp-content/themes/kanec/images/loading.gif',		// (string) Path and the name of the loading icon
			imageBtnPrev:			'/wp-content/themes/kanec/images/lightbox-btn-prev.gif',			// (string) Path and the name of the prev button image
			imageBtnNext:			'/wp-content/themes/kanec/images/lightbox-btn-next.gif',			// (string) Path and the name of the next button image
			imageBtnClose:			'/wp-content/themes/kanec/images/lightbox-btn-close.gif',		// (string) Path and the name of the close btn
			imageBlank:				'/wp-content/themes/kanec/images/lightbox-blank.gif',			// (string) Path and the name of a blank image (one pixel)
			// Configuration related to container image box
			containerBorderSize:	10,			// (integer) If you adjust the padding in the CSS for the container, #lightbox-container-image-box, you will need to update this value
			containerResizeSpeed:	400,		// (integer) Specify the resize duration of container image. These number are miliseconds. 400 is default.
			// Configuration related to texts in caption. For example: Image 2 of 8. You can alter either "Image" and "of" texts.
			txtImage:				'Image',	// (string) Specify text "Image"
			txtOf:					'of',		// (string) Specify text "of"
			// Configuration related to keyboard navigation
			keyToClose:				'c',		// (string) (c = close) Letter to close the jQuery lightBox interface. Beyond this letter, the letter X and the SCAPE key is used to.
			keyToPrev:				'p',		// (string) (p = previous) Letter to show the previous image
			keyToNext:				'n',		// (string) (n = next) Letter to show the next image.
			// Don´t alter these variables in any way
			imageArray:				[],
			activeImage:			0
		},settings);
		// Caching the jQuery object with all elements matched
		var jQueryMatchedObj = this; // This, in this context, refer to jQuery object
		/**
		 * Initializing the plugin calling the start function
		 *
		 * @return boolean false
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); // This, in this context, refer to object (link) which the user have clicked
			return false; // Avoid the browser following the link
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
			// Hime some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			// Call the function to create the markup structure; style some elements; assign events in some elements.
			_set_interface();
			// Unset total images in imageArray
			settings.imageArray.length = 0;
			// Unset image active information
			settings.activeImage = 0;
			// We have an image set? Or just an image? Let´s see it.
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
				// Add an Array (as many as we have), with href and title atributes, inside the Array that storage the images references		
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			// Call the function that prepares image exibition
			_set_image_to_view();
		}
		/**
		 * Create the jQuery lightBox plugin interface
		 *
		 * The HTML markup will be like that:
			<div id="jquery-overlay"></div>
			<div id="jquery-lightbox">
				<div id="lightbox-container-image-box">
					<div id="lightbox-container-image">
						<img src="../fotos/XX.jpg" id="lightbox-image">
						<div id="lightbox-nav">
							<a href="#" id="lightbox-nav-btnPrev"></a>
							<a href="#" id="lightbox-nav-btnNext"></a>
						</div>
						<div id="lightbox-loading">
							<a href="#" id="lightbox-loading-link">
								<img src="../images/loading.gif">
							</a>
						</div>
					</div>
				</div>
				<div id="lightbox-container-image-data-box">
					<div id="lightbox-container-image-data">
						<div id="lightbox-image-details">
							<span id="lightbox-image-details-caption"></span>
							<span id="lightbox-image-details-currentNumber"></span>
						</div>
						<div id="lightbox-secNav">
							<a href="#" id="lightbox-secNav-btnClose">
								<img src="../images/lightbox-btn-close.gif">
							</a>
						</div>
					</div>
				</div>
			</div>
		 *
		 */
		function _set_interface() {
			// Apply the HTML markup into body tag
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			// Assigning click events in elements to close overlay
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			// Assign the _finish function to lightbox-loading-link and lightbox-secNav-btnClose objects
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			// If window was resized, calculate the new overlay dimensions
			$(window).resize(function() {
				// Get page sizes
				var arrPageSizes = ___getPageSize();
				// Style overlay and show it
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				// Get page scroll
				var arrPageScroll = ___getPageScroll();
				// Calculate top and left offset for the jquery-lightbox div object and show it
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		/**
		 * Prepares image exibition; doing a image´s preloader to calculate it´s size
		 *
		 */
		function _set_image_to_view() { // show the loading
			// Show the loading
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			// Image preload process
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				// Perfomance an effect in the image container resizing it
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
				//	clear onLoad, IE behaves irratically with animated gifs otherwise
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image´s width that will be showed
		 * @param integer intImageHeight The image´s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image´s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image´s height and the left and right padding value
			// Diferences
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			// Perfomance the effect
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();

			// Instead to define this configuration in CSS file, we define here. And it´s need to IE. Just.
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			
			// Show the prev button, if not the first image in set
			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			
			// Show the next button, if not the last image in set
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			// Enable keyboard navigation
			_enable_keyboard_navigation();
		}
		/**
		 * Enable a support to keyboard navigation
		 *
		 */
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		/**
		 * Disable the support to keyboard navigation
		 *
		 */
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		/**
		 * Perform the keyboard actions
		 *
		 */
		function _keyboard_action(objEvent) {
			// To ie
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			// To Mozilla
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			// Get the key in lower case form
			key = String.fromCharCode(keycode).toLowerCase();
			// Verify the keys to close the ligthBox
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			// Verify the key to show the previous image
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				// If we´re not showing the first image, call the previous
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			// Verify the key to show the next image
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				// If we´re not showing the last image, call the next
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		/**
		 * Preload prev and next images being showed
		 *
		 */
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		/**
		 * Remove jQuery lightBox plugin HTML markup
		 *
		 */
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
			// Show some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'visible' });
		}
		/**
		 / THIRD FUNCTION
		 * getPageSize() by quirksmode.com
		 *
		 * @return Array Return an array with page width, height and window width, height
		 */
		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		};
		/**
		 / THIRD FUNCTION
		 * getPageScroll() by quirksmode.com
		 *
		 * @return Array Return an array with x,y page scroll values.
		 */
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;	
			}
			arrayPageScroll = new Array(xScroll,yScroll);
			return arrayPageScroll;
		};
		 /**
		  * Stop the code execution from a escified time in milisecond
		  *
		  */
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		return this.unbind('click').click(_initialize);
	};
})(jQuery); // Call and execute the function immediately passing the jQuery object




//////////////////////////////////////////////////////////////////
// CUFON ENGINE
//////////////////////////////////////////////////////////////////

/*!
 * Copyright (c) 2010 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version ${Version}
 */

var Cufon = (function() {

	var api = function() {
		return api.replace.apply(null, arguments);
	};

	var DOM = api.DOM = {

		ready: (function() {

			var complete = false, readyStatus = { loaded: 1, complete: 1 };

			var queue = [], perform = function() {
				if (complete) return;
				complete = true;
				for (var fn; fn = queue.shift(); fn());
			};

			// Gecko, Opera, WebKit r26101+

			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', perform, false);
				window.addEventListener('pageshow', perform, false); // For cached Gecko pages
			}

			// Old WebKit, Internet Explorer

			if (!window.opera && document.readyState) (function() {
				readyStatus[document.readyState] ? perform() : setTimeout(arguments.callee, 10);
			})();

			// Internet Explorer

			if (document.readyState && document.createStyleSheet) (function() {
				try {
					document.body.doScroll('left');
					perform();
				}
				catch (e) {
					setTimeout(arguments.callee, 1);
				}
			})();

			addEvent(window, 'load', perform); // Fallback

			return function(listener) {
				if (!arguments.length) perform();
				else complete ? listener() : queue.push(listener);
			};

		})(),

		root: function() {
			return document.documentElement || document.body;
		}

	};

	var CSS = api.CSS = {

		Size: function(value, base) {

			this.value = parseFloat(value);
			this.unit = String(value).match(/[a-z%]*$/)[0] || 'px';

			this.convert = function(value) {
				return value / base * this.value;
			};

			this.convertFrom = function(value) {
				return value / this.value * base;
			};

			this.toString = function() {
				return this.value + this.unit;
			};

		},

		addClass: function(el, className) {
			var current = el.className;
			el.className = current + (current && ' ') + className;
			return el;
		},

		color: cached(function(value) {
			var parsed = {};
			parsed.color = value.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function($0, $1, $2) {
				parsed.opacity = parseFloat($2);
				return 'rgb(' + $1 + ')';
			});
			return parsed;
		}),

		// has no direct CSS equivalent.
		// @see http://msdn.microsoft.com/en-us/library/system.windows.fontstretches.aspx
		fontStretch: cached(function(value) {
			if (typeof value == 'number') return value;
			if (/%$/.test(value)) return parseFloat(value) / 100;
			return {
				'ultra-condensed': 0.5,
				'extra-condensed': 0.625,
				condensed: 0.75,
				'semi-condensed': 0.875,
				'semi-expanded': 1.125,
				expanded: 1.25,
				'extra-expanded': 1.5,
				'ultra-expanded': 2
			}[value] || 1;
		}),

		getStyle: function(el) {
			var view = document.defaultView;
			if (view && view.getComputedStyle) return new Style(view.getComputedStyle(el, null));
			if (el.currentStyle) return new Style(el.currentStyle);
			return new Style(el.style);
		},

		gradient: cached(function(value) {
			var gradient = {
				id: value,
				type: value.match(/^-([a-z]+)-gradient\(/)[1],
				stops: []
			}, colors = value.substr(value.indexOf('(')).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);
			for (var i = 0, l = colors.length, stop; i < l; ++i) {
				stop = colors[i].split('=', 2).reverse();
				gradient.stops.push([ stop[1] || i / (l - 1), stop[0] ]);
			}
			return gradient;
		}),

		quotedList: cached(function(value) {
			// doesn't work properly with empty quoted strings (""), but
			// it's not worth the extra code.
			var list = [], re = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, match;
			while (match = re.exec(value)) list.push(match[3] || match[1]);
			return list;
		}),

		recognizesMedia: cached(function(media) {
			var el = document.createElement('style'), sheet, container, supported;
			el.type = 'text/css';
			el.media = media;
			try { // this is cached anyway
				el.appendChild(document.createTextNode('/**/'));
			} catch (e) {}
			container = elementsByTagName('head')[0];
			container.insertBefore(el, container.firstChild);
			sheet = (el.sheet || el.styleSheet);
			supported = sheet && !sheet.disabled;
			container.removeChild(el);
			return supported;
		}),

		removeClass: function(el, className) {
			var re = RegExp('(?:^|\\s+)' + className +  '(?=\\s|$)', 'g');
			el.className = el.className.replace(re, '');
			return el;
		},

		supports: function(property, value) {
			var checker = document.createElement('span').style;
			if (checker[property] === undefined) return false;
			checker[property] = value;
			return checker[property] === value;
		},

		textAlign: function(word, style, position, wordCount) {
			if (style.get('textAlign') == 'right') {
				if (position > 0) word = ' ' + word;
			}
			else if (position < wordCount - 1) word += ' ';
			return word;
		},

		textShadow: cached(function(value) {
			if (value == 'none') return null;
			var shadows = [], currentShadow = {}, result, offCount = 0;
			var re = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
			while (result = re.exec(value)) {
				if (result[0] == ',') {
					shadows.push(currentShadow);
					currentShadow = {};
					offCount = 0;
				}
				else if (result[1]) {
					currentShadow.color = result[1];
				}
				else {
					currentShadow[[ 'offX', 'offY', 'blur' ][offCount++]] = result[2];
				}
			}
			shadows.push(currentShadow);
			return shadows;
		}),

		textTransform: (function() {
			var map = {
				uppercase: function(s) {
					return s.toUpperCase();
				},
				lowercase: function(s) {
					return s.toLowerCase();
				},
				capitalize: function(s) {
					return s.replace(/\b./g, function($0) {
						return $0.toUpperCase();
					});
				}
			};
			return function(text, style) {
				var transform = map[style.get('textTransform')];
				return transform ? transform(text) : text;
			};
		})(),

		whiteSpace: (function() {
			var ignore = {
				inline: 1,
				'inline-block': 1,
				'run-in': 1
			};
			var wsStart = /^\s+/, wsEnd = /\s+$/;
			return function(text, style, node, previousElement) {
				if (previousElement) {
					if (previousElement.nodeName.toLowerCase() == 'br') {
						text = text.replace(wsStart, '');
					}
				}
				if (ignore[style.get('display')]) return text;
				if (!node.previousSibling) text = text.replace(wsStart, '');
				if (!node.nextSibling) text = text.replace(wsEnd, '');
				return text;
			};
		})()

	};

	CSS.ready = (function() {

		// don't do anything in Safari 2 (it doesn't recognize any media type)
		var complete = !CSS.recognizesMedia('all'), hasLayout = false;

		var queue = [], perform = function() {
			complete = true;
			for (var fn; fn = queue.shift(); fn());
		};

		var links = elementsByTagName('link'), styles = elementsByTagName('style');

		function isContainerReady(el) {
			return el.disabled || isSheetReady(el.sheet, el.media || 'screen');
		}

		function isSheetReady(sheet, media) {
			// in Opera sheet.disabled is true when it's still loading,
			// even though link.disabled is false. they stay in sync if
			// set manually.
			if (!CSS.recognizesMedia(media || 'all')) return true;
			if (!sheet || sheet.disabled) return false;
			try {
				var rules = sheet.cssRules, rule;
				if (rules) {
					// needed for Safari 3 and Chrome 1.0.
					// in standards-conforming browsers cssRules contains @-rules.
					// Chrome 1.0 weirdness: rules[<number larger than .length - 1>]
					// returns the last rule, so a for loop is the only option.
					search: for (var i = 0, l = rules.length; rule = rules[i], i < l; ++i) {
						switch (rule.type) {
							case 2: // @charset
								break;
							case 3: // @import
								if (!isSheetReady(rule.styleSheet, rule.media.mediaText)) return false;
								break;
							default:
								// only @charset can precede @import
								break search;
						}
					}
				}
			}
			catch (e) {} // probably a style sheet from another domain
			return true;
		}

		function allStylesLoaded() {
			// Internet Explorer's style sheet model, there's no need to do anything
			if (document.createStyleSheet) return true;
			// standards-compliant browsers
			var el, i;
			for (i = 0; el = links[i]; ++i) {
				if (el.rel.toLowerCase() == 'stylesheet' && !isContainerReady(el)) return false;
			}
			for (i = 0; el = styles[i]; ++i) {
				if (!isContainerReady(el)) return false;
			}
			return true;
		}

		DOM.ready(function() {
			// getComputedStyle returns null in Gecko if used in an iframe with display: none
			if (!hasLayout) hasLayout = CSS.getStyle(document.body).isUsable();
			if (complete || (hasLayout && allStylesLoaded())) perform();
			else setTimeout(arguments.callee, 10);
		});

		return function(listener) {
			if (complete) listener();
			else queue.push(listener);
		};

	})();

	function Font(data) {

		var face = this.face = data.face, wordSeparators = {
			'\u0020': 1,
			'\u00a0': 1,
			'\u3000': 1
		};

		this.glyphs = data.glyphs;
		this.w = data.w;
		this.baseSize = parseInt(face['units-per-em'], 10);

		this.family = face['font-family'].toLowerCase();
		this.weight = face['font-weight'];
		this.style = face['font-style'] || 'normal';

		this.viewBox = (function () {
			var parts = face.bbox.split(/\s+/);
			var box = {
				minX: parseInt(parts[0], 10),
				minY: parseInt(parts[1], 10),
				maxX: parseInt(parts[2], 10),
				maxY: parseInt(parts[3], 10)
			};
			box.width = box.maxX - box.minX;
			box.height = box.maxY - box.minY;
			box.toString = function() {
				return [ this.minX, this.minY, this.width, this.height ].join(' ');
			};
			return box;
		})();

		this.ascent = -parseInt(face.ascent, 10);
		this.descent = -parseInt(face.descent, 10);

		this.height = -this.ascent + this.descent;

		this.spacing = function(chars, letterSpacing, wordSpacing) {
			var glyphs = this.glyphs, glyph,
				kerning, k,
				jumps = [],
				width = 0, w,
				i = -1, j = -1, chr;
			while (chr = chars[++i]) {
				glyph = glyphs[chr] || this.missingGlyph;
				if (!glyph) continue;
				if (kerning) {
					width -= k = kerning[chr] || 0;
					jumps[j] -= k;
				}
				w = glyph.w;
				if (isNaN(w)) w = +this.w; // may have been a String in old fonts
				if (w > 0) {
					w += letterSpacing;
					if (wordSeparators[chr]) w += wordSpacing;
				}
				width += jumps[++j] = ~~w; // get rid of decimals
				kerning = glyph.k;
			}
			jumps.total = width;
			return jumps;
		};

	}

	function FontFamily() {

		var styles = {}, mapping = {
			oblique: 'italic',
			italic: 'oblique'
		};

		this.add = function(font) {
			(styles[font.style] || (styles[font.style] = {}))[font.weight] = font;
		};

		this.get = function(style, weight) {
			var weights = styles[style] || styles[mapping[style]]
				|| styles.normal || styles.italic || styles.oblique;
			if (!weights) return null;
			// we don't have to worry about "bolder" and "lighter"
			// because IE's currentStyle returns a numeric value for it,
			// and other browsers use the computed value anyway
			weight = {
				normal: 400,
				bold: 700
			}[weight] || parseInt(weight, 10);
			if (weights[weight]) return weights[weight];
			// http://www.w3.org/TR/CSS21/fonts.html#propdef-font-weight
			// Gecko uses x99/x01 for lighter/bolder
			var up = {
				1: 1,
				99: 0
			}[weight % 100], alts = [], min, max;
			if (up === undefined) up = weight > 400;
			if (weight == 500) weight = 400;
			for (var alt in weights) {
				if (!hasOwnProperty(weights, alt)) continue;
				alt = parseInt(alt, 10);
				if (!min || alt < min) min = alt;
				if (!max || alt > max) max = alt;
				alts.push(alt);
			}
			if (weight < min) weight = min;
			if (weight > max) weight = max;
			alts.sort(function(a, b) {
				return (up
					? (a >= weight && b >= weight) ? a < b : a > b
					: (a <= weight && b <= weight) ? a > b : a < b) ? -1 : 1;
			});
			return weights[alts[0]];
		};

	}

	function HoverHandler() {

		function contains(node, anotherNode) {
			try {
				if (node.contains) return node.contains(anotherNode);
				return node.compareDocumentPosition(anotherNode) & 16;
			}
			catch(e) {} // probably a XUL element such as a scrollbar
			return false;
		}

		function onOverOut(e) {
			var related = e.relatedTarget;
			// there might be no relatedTarget if the element is right next
			// to the window frame
			if (related && contains(this, related)) return;
			trigger(this, e.type == 'mouseover');
		}

		function onEnterLeave(e) {
			trigger(this, e.type == 'mouseenter');
		}

		function trigger(el, hoverState) {
			// A timeout is needed so that the event can actually "happen"
			// before replace is triggered. This ensures that styles are up
			// to date.
			setTimeout(function() {
				var options = sharedStorage.get(el).options;
				api.replace(el, hoverState ? merge(options, options.hover) : options, true);
			}, 10);
		}

		this.attach = function(el) {
			if (el.onmouseenter === undefined) {
				addEvent(el, 'mouseover', onOverOut);
				addEvent(el, 'mouseout', onOverOut);
			}
			else {
				addEvent(el, 'mouseenter', onEnterLeave);
				addEvent(el, 'mouseleave', onEnterLeave);
			}
		};

	}

	function ReplaceHistory() {

		var list = [], map = {};

		function filter(keys) {
			var values = [], key;
			for (var i = 0; key = keys[i]; ++i) values[i] = list[map[key]];
			return values;
		}

		this.add = function(key, args) {
			map[key] = list.push(args) - 1;
		};

		this.repeat = function() {
			var snapshot = arguments.length ? filter(arguments) : list, args;
			for (var i = 0; args = snapshot[i++];) api.replace(args[0], args[1], true);
		};

	}

	function Storage() {

		var map = {}, at = 0;

		function identify(el) {
			return el.cufid || (el.cufid = ++at);
		}

		this.get = function(el) {
			var id = identify(el);
			return map[id] || (map[id] = {});
		};

	}

	function Style(style) {

		var custom = {}, sizes = {};

		this.extend = function(styles) {
			for (var property in styles) {
				if (hasOwnProperty(styles, property)) custom[property] = styles[property];
			}
			return this;
		};

		this.get = function(property) {
			return custom[property] != undefined ? custom[property] : style[property];
		};

		this.getSize = function(property, base) {
			return sizes[property] || (sizes[property] = new CSS.Size(this.get(property), base));
		};

		this.isUsable = function() {
			return !!style;
		};

	}

	function addEvent(el, type, listener) {
		if (el.addEventListener) {
			el.addEventListener(type, listener, false);
		}
		else if (el.attachEvent) {
			el.attachEvent('on' + type, function() {
				return listener.call(el, window.event);
			});
		}
	}

	function attach(el, options) {
		var storage = sharedStorage.get(el);
		if (storage.options) return el;
		if (options.hover && options.hoverables[el.nodeName.toLowerCase()]) {
			hoverHandler.attach(el);
		}
		storage.options = options;
		return el;
	}

	function cached(fun) {
		var cache = {};
		return function(key) {
			if (!hasOwnProperty(cache, key)) cache[key] = fun.apply(null, arguments);
			return cache[key];
		};
	}

	function getFont(el, style) {
		var families = CSS.quotedList(style.get('fontFamily').toLowerCase()), family;
		for (var i = 0; family = families[i]; ++i) {
			if (fonts[family]) return fonts[family].get(style.get('fontStyle'), style.get('fontWeight'));
		}
		return null;
	}

	function elementsByTagName(query) {
		return document.getElementsByTagName(query);
	}

	function hasOwnProperty(obj, property) {
		return obj.hasOwnProperty(property);
	}

	function merge() {
		var merged = {}, arg, key;
		for (var i = 0, l = arguments.length; arg = arguments[i], i < l; ++i) {
			for (key in arg) {
				if (hasOwnProperty(arg, key)) merged[key] = arg[key];
			}
		}
		return merged;
	}

	function process(font, text, style, options, node, el) {
		var fragment = document.createDocumentFragment(), processed;
		if (text === '') return fragment;
		var separate = options.separate;
		var parts = text.split(separators[separate]), needsAligning = (separate == 'words');
		if (needsAligning && HAS_BROKEN_REGEXP) {
			// @todo figure out a better way to do this
			if (/^\s/.test(text)) parts.unshift('');
			if (/\s$/.test(text)) parts.push('');
		}
		for (var i = 0, l = parts.length; i < l; ++i) {
			processed = engines[options.engine](font,
				needsAligning ? CSS.textAlign(parts[i], style, i, l) : parts[i],
				style, options, node, el, i < l - 1);
			if (processed) fragment.appendChild(processed);
		}
		return fragment;
	}

	function replaceElement(el, options) {
		var name = el.nodeName.toLowerCase();
		if (options.ignore[name]) return;
		var replace = !options.textless[name];
		var style = CSS.getStyle(attach(el, options)).extend(options);
		// may cause issues if the element contains other elements
		// with larger fontSize, however such cases are rare and can
		// be fixed by using a more specific selector
		if (parseFloat(style.get('fontSize')) === 0) return;
		var font = getFont(el, style), node, type, next, anchor, text, lastElement;
		if (!font) return;
		for (node = el.firstChild; node; node = next) {
			type = node.nodeType;
			next = node.nextSibling;
			if (replace && type == 3) {
				// Node.normalize() is broken in IE 6, 7, 8
				if (anchor) {
					anchor.appendData(node.data);
					el.removeChild(node);
				}
				else anchor = node;
				if (next) continue;
			}
			if (anchor) {
				el.replaceChild(process(font,
					CSS.whiteSpace(anchor.data, style, anchor, lastElement),
					style, options, node, el), anchor);
				anchor = null;
			}
			if (type == 1) {
				if (node.firstChild) {
					if (node.nodeName.toLowerCase() == 'cufon') {
						engines[options.engine](font, null, style, options, node, el);
					}
					else arguments.callee(node, options);
				}
				lastElement = node;
			}
		}
	}

	var HAS_BROKEN_REGEXP = ' '.split(/\s+/).length == 0;

	var sharedStorage = new Storage();
	var hoverHandler = new HoverHandler();
	var replaceHistory = new ReplaceHistory();
	var initialized = false;

	var engines = {}, fonts = {}, defaultOptions = {
		autoDetect: false,
		engine: null,
		//fontScale: 1,
		//fontScaling: false,
		forceHitArea: false,
		hover: false,
		hoverables: {
			a: true
		},
		ignore: {
			applet: 1,
			canvas: 1,
			col: 1,
			colgroup: 1,
			head: 1,
			iframe: 1,
			map: 1,
			noscript: 1,
			optgroup: 1,
			option: 1,
			script: 1,
			select: 1,
			style: 1,
			textarea: 1,
			title: 1,
			pre: 1
		},
		printable: true,
		//rotation: 0,
		//selectable: false,
		selector: (
				window.Sizzle
			||	(window.jQuery && function(query) { return jQuery(query); }) // avoid noConflict issues
			||	(window.dojo && dojo.query)
			||	(window.glow && glow.dom && glow.dom.get)
			||	(window.Ext && Ext.query)
			||	(window.YAHOO && YAHOO.util && YAHOO.util.Selector && YAHOO.util.Selector.query)
			||	(window.$$ && function(query) { return $$(query); })
			||	(window.$ && function(query) { return $(query); })
			||	(document.querySelectorAll && function(query) { return document.querySelectorAll(query); })
			||	elementsByTagName
		),
		separate: 'words', // 'none' and 'characters' are also accepted
		textless: {
			dl: 1,
			html: 1,
			ol: 1,
			table: 1,
			tbody: 1,
			thead: 1,
			tfoot: 1,
			tr: 1,
			ul: 1
		},
		textShadow: 'none'
	};

	var separators = {
		// The first pattern may cause unicode characters above
		// code point 255 to be removed in Safari 3.0. Luckily enough
		// Safari 3.0 does not include non-breaking spaces in \s, so
		// we can just use a simple alternative pattern.
		words: /\s/.test('\u00a0') ? /[^\S\u00a0]+/ : /\s+/,
		characters: '',
		none: /^/
	};

	api.now = function() {
		DOM.ready();
		return api;
	};

	api.refresh = function() {
		replaceHistory.repeat.apply(replaceHistory, arguments);
		return api;
	};

	api.registerEngine = function(id, engine) {
		if (!engine) return api;
		engines[id] = engine;
		return api.set('engine', id);
	};

	api.registerFont = function(data) {
		if (!data) return api;
		var font = new Font(data), family = font.family;
		if (!fonts[family]) fonts[family] = new FontFamily();
		fonts[family].add(font);
		return api.set('fontFamily', '"' + family + '"');
	};

	api.replace = function(elements, options, ignoreHistory) {
		options = merge(defaultOptions, options);
		if (!options.engine) return api; // there's no browser support so we'll just stop here
		if (!initialized) {
			CSS.addClass(DOM.root(), 'cufon-active cufon-loading');
			CSS.ready(function() {
				// fires before any replace() calls, but it doesn't really matter
				CSS.addClass(CSS.removeClass(DOM.root(), 'cufon-loading'), 'cufon-ready');
			});
			initialized = true;
		}
		if (options.hover) options.forceHitArea = true;
		if (options.autoDetect) delete options.fontFamily;
		if (typeof options.textShadow == 'string') {
			options.textShadow = CSS.textShadow(options.textShadow);
		}
		if (typeof options.color == 'string' && /^-/.test(options.color)) {
			options.textGradient = CSS.gradient(options.color);
		}
		else delete options.textGradient;
		if (!ignoreHistory) replaceHistory.add(elements, arguments);
		if (elements.nodeType || typeof elements == 'string') elements = [ elements ];
		CSS.ready(function() {
			for (var i = 0, l = elements.length; i < l; ++i) {
				var el = elements[i];
				if (typeof el == 'string') api.replace(options.selector(el), options, true);
				else replaceElement(el, options);
			}
		});
		return api;
	};

	api.set = function(option, value) {
		defaultOptions[option] = value;
		return api;
	};

	return api;

})();

Cufon.registerEngine('canvas', (function() {

	// Safari 2 doesn't support .apply() on native methods

	var check = document.createElement('canvas');
	if (!check || !check.getContext || !check.getContext.apply) return;
	check = null;

	var HAS_INLINE_BLOCK = Cufon.CSS.supports('display', 'inline-block');

	// Firefox 2 w/ non-strict doctype (almost standards mode)
	var HAS_BROKEN_LINEHEIGHT = !HAS_INLINE_BLOCK && (document.compatMode == 'BackCompat' || /frameset|transitional/i.test(document.doctype.publicId));

	var styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.appendChild(document.createTextNode((
		'cufon{text-indent:0;}' +
		'@media screen,projection{' +
			'cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;' +
			(HAS_BROKEN_LINEHEIGHT
				? ''
				: 'font-size:1px;line-height:1px;') +
			'}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;text-indent:-10000in;}' +
			(HAS_INLINE_BLOCK
				? 'cufon canvas{position:relative;}'
				: 'cufon canvas{position:absolute;}') +
		'}' +
		'@media print{' +
			'cufon{padding:0;}' + // Firefox 2
			'cufon canvas{display:none;}' +
		'}'
	).replace(/;/g, '!important;')));
	document.getElementsByTagName('head')[0].appendChild(styleSheet);

	function generateFromVML(path, context) {
		var atX = 0, atY = 0;
		var code = [], re = /([mrvxe])([^a-z]*)/g, match;
		generate: for (var i = 0; match = re.exec(path); ++i) {
			var c = match[2].split(',');
			switch (match[1]) {
				case 'v':
					code[i] = { m: 'bezierCurveTo', a: [ atX + ~~c[0], atY + ~~c[1], atX + ~~c[2], atY + ~~c[3], atX += ~~c[4], atY += ~~c[5] ] };
					break;
				case 'r':
					code[i] = { m: 'lineTo', a: [ atX += ~~c[0], atY += ~~c[1] ] };
					break;
				case 'm':
					code[i] = { m: 'moveTo', a: [ atX = ~~c[0], atY = ~~c[1] ] };
					break;
				case 'x':
					code[i] = { m: 'closePath' };
					break;
				case 'e':
					break generate;
			}
			context[code[i].m].apply(context, code[i].a);
		}
		return code;
	}

	function interpret(code, context) {
		for (var i = 0, l = code.length; i < l; ++i) {
			var line = code[i];
			context[line.m].apply(context, line.a);
		}
	}

	return function(font, text, style, options, node, el) {

		var redraw = (text === null);

		if (redraw) text = node.getAttribute('alt');

		var viewBox = font.viewBox;

		var size = style.getSize('fontSize', font.baseSize);

		var expandTop = 0, expandRight = 0, expandBottom = 0, expandLeft = 0;
		var shadows = options.textShadow, shadowOffsets = [];
		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				var x = size.convertFrom(parseFloat(shadow.offX));
				var y = size.convertFrom(parseFloat(shadow.offY));
				shadowOffsets[i] = [ x, y ];
				if (y < expandTop) expandTop = y;
				if (x > expandRight) expandRight = x;
				if (y > expandBottom) expandBottom = y;
				if (x < expandLeft) expandLeft = x;
			}
		}

		var chars = Cufon.CSS.textTransform(text, style).split('');

		var jumps = font.spacing(chars,
			~~size.convertFrom(parseFloat(style.get('letterSpacing')) || 0),
			~~size.convertFrom(parseFloat(style.get('wordSpacing')) || 0)
		);

		if (!jumps.length) return null; // there's nothing to render

		var width = jumps.total;

		expandRight += viewBox.width - jumps[jumps.length - 1];
		expandLeft += viewBox.minX;

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-canvas';
			wrapper.setAttribute('alt', text);

			canvas = document.createElement('canvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height);
		var roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var stretchedWidth = width * stretchFactor;

		var canvasWidth = Math.ceil(size.convert(stretchedWidth + expandRight - expandLeft));
		var canvasHeight = Math.ceil(size.convert(viewBox.height - expandTop + expandBottom));

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// needed for WebKit and full page zoom
		cStyle.width = canvasWidth + 'px';
		cStyle.height = canvasHeight + 'px';

		// minY has no part in canvas.height
		expandTop += viewBox.minY;

		cStyle.top = Math.round(size.convert(expandTop - font.ascent)) + 'px';
		cStyle.left = Math.round(size.convert(expandLeft)) + 'px';

		var wrapperWidth = Math.max(Math.ceil(size.convert(stretchedWidth)), 0) + 'px';

		if (HAS_INLINE_BLOCK) {
			wStyle.width = wrapperWidth;
			wStyle.height = size.convert(font.height) + 'px';
		}
		else {
			wStyle.paddingLeft = wrapperWidth;
			wStyle.paddingBottom = (size.convert(font.height) - 1) + 'px';
		}

		var g = canvas.getContext('2d'), scale = height / viewBox.height;

		// proper horizontal scaling is performed later
		g.scale(scale, scale * roundingFactor);
		g.translate(-expandLeft, -expandTop);
		g.save();

		function renderText() {
			var glyphs = font.glyphs, glyph, i = -1, j = -1, chr;
			g.scale(stretchFactor, 1);
			while (chr = chars[++i]) {
				var glyph = glyphs[chars[i]] || font.missingGlyph;
				if (!glyph) continue;
				if (glyph.d) {
					g.beginPath();
					if (glyph.code) interpret(glyph.code, g);
					else glyph.code = generateFromVML('m' + glyph.d, g);
					g.fill();
				}
				g.translate(jumps[++j], 0);
			}
			g.restore();
		}

		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				g.save();
				g.fillStyle = shadow.color;
				g.translate.apply(g, shadowOffsets[i]);
				renderText();
			}
		}

		var gradient = options.textGradient;
		if (gradient) {
			var stops = gradient.stops, fill = g.createLinearGradient(0, viewBox.minY, 0, viewBox.maxY);
			for (var i = 0, l = stops.length; i < l; ++i) {
				fill.addColorStop.apply(fill, stops[i]);
			}
			g.fillStyle = fill;
		}
		else g.fillStyle = style.get('color');

		renderText();

		return wrapper;

	};

})());

Cufon.registerEngine('vml', (function() {

	var ns = document.namespaces;
	if (!ns) return;
	ns.add('cvml', 'urn:schemas-microsoft-com:vml');
	ns = null;

	var check = document.createElement('cvml:shape');
	check.style.behavior = 'url(#default#VML)';
	if (!check.coordsize) return; // VML isn't supported
	check = null;

	var HAS_BROKEN_LINEHEIGHT = (document.documentMode || 0) < 8;

	document.write(('<style type="text/css">' +
		'cufoncanvas{text-indent:0;}' +
		'@media screen{' +
			'cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}' +
			'cufoncanvas{position:absolute;text-align:left;}' +
			'cufon{display:inline-block;position:relative;vertical-align:' +
			(HAS_BROKEN_LINEHEIGHT
				? 'middle'
				: 'text-bottom') +
			';}' +
			'cufon cufontext{position:absolute;left:-10000in;font-size:1px;}' +
			'a cufon{cursor:pointer}' + // ignore !important here
		'}' +
		'@media print{' +
			'cufon cufoncanvas{display:none;}' +
		'}' +
	'</style>').replace(/;/g, '!important;'));

	function getFontSizeInPixels(el, value) {
		return getSizeInPixels(el, /(?:em|ex|%)$|^[a-z-]+$/i.test(value) ? '1em' : value);
	}

	// Original by Dead Edwards.
	// Combined with getFontSizeInPixels it also works with relative units.
	function getSizeInPixels(el, value) {
		if (!isNaN(value) || /px$/i.test(value)) return parseFloat(value);
		var style = el.style.left, runtimeStyle = el.runtimeStyle.left;
		el.runtimeStyle.left = el.currentStyle.left;
		el.style.left = value.replace('%', 'em');
		var result = el.style.pixelLeft;
		el.style.left = style;
		el.runtimeStyle.left = runtimeStyle;
		return result;
	}

	function getSpacingValue(el, style, size, property) {
		var key = 'computed' + property, value = style[key];
		if (isNaN(value)) {
			value = style.get(property);
			style[key] = value = (value == 'normal') ? 0 : ~~size.convertFrom(getSizeInPixels(el, value));
		}
		return value;
	}

	var fills = {};

	function gradientFill(gradient) {
		var id = gradient.id;
		if (!fills[id]) {
			var stops = gradient.stops, fill = document.createElement('cvml:fill'), colors = [];
			fill.type = 'gradient';
			fill.angle = 180;
			fill.focus = '0';
			fill.method = 'none';
			fill.color = stops[0][1];
			for (var j = 1, k = stops.length - 1; j < k; ++j) {
				colors.push(stops[j][0] * 100 + '% ' + stops[j][1]);
			}
			fill.colors = colors.join(',');
			fill.color2 = stops[k][1];
			fills[id] = fill;
		}
		return fills[id];
	}

	return function(font, text, style, options, node, el, hasNext) {

		var redraw = (text === null);

		if (redraw) text = node.alt;

		var viewBox = font.viewBox;

		var size = style.computedFontSize || (style.computedFontSize = new Cufon.CSS.Size(getFontSizeInPixels(el, style.get('fontSize')) + 'px', font.baseSize));

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-vml';
			wrapper.alt = text;

			canvas = document.createElement('cufoncanvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}

			// ie6, for some reason, has trouble rendering the last VML element in the document.
			// we can work around this by injecting a dummy element where needed.
			// @todo find a better solution
			if (!hasNext) wrapper.appendChild(document.createElement('cvml:shape'));
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height), roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var minX = viewBox.minX, minY = viewBox.minY;

		cStyle.height = roundedHeight;
		cStyle.top = Math.round(size.convert(minY - font.ascent));
		cStyle.left = Math.round(size.convert(minX));

		wStyle.height = size.convert(font.height) + 'px';

		var color = style.get('color');
		var chars = Cufon.CSS.textTransform(text, style).split('');

		var jumps = font.spacing(chars,
			getSpacingValue(el, style, size, 'letterSpacing'),
			getSpacingValue(el, style, size, 'wordSpacing')
		);

		if (!jumps.length) return null;

		var width = jumps.total;
		var fullWidth = -minX + width + (viewBox.width - jumps[jumps.length - 1]);

		var shapeWidth = size.convert(fullWidth * stretchFactor), roundedShapeWidth = Math.round(shapeWidth);

		var coordSize = fullWidth + ',' + viewBox.height, coordOrigin;
		var stretch = 'r' + coordSize + 'ns';

		var fill = options.textGradient && gradientFill(options.textGradient);

		var glyphs = font.glyphs, offsetX = 0;
		var shadows = options.textShadow;
		var i = -1, j = 0, chr;

		while (chr = chars[++i]) {

			var glyph = glyphs[chars[i]] || font.missingGlyph, shape;
			if (!glyph) continue;

			if (redraw) {
				// some glyphs may be missing so we can't use i
				shape = canvas.childNodes[j];
				while (shape.firstChild) shape.removeChild(shape.firstChild); // shadow, fill
			}
			else {
				shape = document.createElement('cvml:shape');
				canvas.appendChild(shape);
			}

			shape.stroked = 'f';
			shape.coordsize = coordSize;
			shape.coordorigin = coordOrigin = (minX - offsetX) + ',' + minY;
			shape.path = (glyph.d ? 'm' + glyph.d + 'xe' : '') + 'm' + coordOrigin + stretch;
			shape.fillcolor = color;

			if (fill) shape.appendChild(fill.cloneNode(false));

			// it's important to not set top/left or IE8 will grind to a halt
			var sStyle = shape.style;
			sStyle.width = roundedShapeWidth;
			sStyle.height = roundedHeight;

			if (shadows) {
				// due to the limitations of the VML shadow element there
				// can only be two visible shadows. opacity is shared
				// for all shadows.
				var shadow1 = shadows[0], shadow2 = shadows[1];
				var color1 = Cufon.CSS.color(shadow1.color), color2;
				var shadow = document.createElement('cvml:shadow');
				shadow.on = 't';
				shadow.color = color1.color;
				shadow.offset = shadow1.offX + ',' + shadow1.offY;
				if (shadow2) {
					color2 = Cufon.CSS.color(shadow2.color);
					shadow.type = 'double';
					shadow.color2 = color2.color;
					shadow.offset2 = shadow2.offX + ',' + shadow2.offY;
				}
				shadow.opacity = color1.opacity || (color2 && color2.opacity) || 1;
				shape.appendChild(shadow);
			}

			offsetX += jumps[j++];
		}

		// addresses flickering issues on :hover

		var cover = shape.nextSibling, coverFill, vStyle;

		if (options.forceHitArea) {

			if (!cover) {
				cover = document.createElement('cvml:rect');
				cover.stroked = 'f';
				cover.className = 'cufon-vml-cover';
				coverFill = document.createElement('cvml:fill');
				coverFill.opacity = 0;
				cover.appendChild(coverFill);
				canvas.appendChild(cover);
			}

			vStyle = cover.style;

			vStyle.width = roundedShapeWidth;
			vStyle.height = roundedHeight;

		}
		else if (cover) canvas.removeChild(cover);

		wStyle.width = Math.max(Math.ceil(size.convert(width * stretchFactor)), 0);

		if (HAS_BROKEN_LINEHEIGHT) {

			var yAdjust = style.computedYAdjust;

			if (yAdjust === undefined) {
				var lineHeight = style.get('lineHeight');
				if (lineHeight == 'normal') lineHeight = '1em';
				else if (!isNaN(lineHeight)) lineHeight += 'em'; // no unit
				style.computedYAdjust = yAdjust = 0.5 * (getSizeInPixels(el, lineHeight) - parseFloat(wStyle.height));
			}

			if (yAdjust) {
				wStyle.marginTop = Math.ceil(yAdjust) + 'px';
				wStyle.marginBottom = yAdjust + 'px';
			}

		}

		return wrapper;

	};

})());


/////////////////////////////////////////////////////////////////////
// CUFON FONTS
////////////////////////////////////////////////////////////////////

/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Copyright © 1989, 1990, 2002 Adobe Systems Incorporated.  All Rights Reserved.
 * © 1981, 2002 Heidelberger Druckmaschinen AG. All rights reserved.
 * 
 * Trademark:
 * Trade Gothic is a trademark of Heidelberger Druckmaschinen AG, exclusively
 * licensed through Linotype Library GmbH, and may be registered in certain
 * jurisdictions.
 * 
 * Designer:
 * Jackson Burke
 * 
 * Vendor URL:
 * http://www.adobe.com/type
 * 
 * License information:
 * http://www.adobe.com/type/legal.html
 */
Cufon.registerFont({"w":500,"face":{"font-family":"Trade Gothic LT Std","font-weight":700,"font-stretch":"normal","units-per-em":"1000","panose-1":"0 0 8 0 0 0 0 0 0 0","ascent":"722","descent":"-278","x-height":"10","bbox":"-167 -971 1000 228","underline-thickness":"50","underline-position":"-50","stemh":"84","stemv":"126","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":278},"!":{"d":"212,-722r-28,478r-90,0r-28,-478r146,0xm210,0r-142,0r0,-142r142,0r0,142","w":278},"\"":{"d":"199,-452r0,-270r110,0r0,270r-110,0xm24,-452r0,-270r110,0r0,270r-110,0","w":333},"#":{"d":"506,-300r0,94r-99,0r-29,206r-96,0r28,-206r-99,0r-29,206r-96,0r28,-206r-94,0r0,-94r107,0r18,-122r-94,0r0,-94r106,0r29,-206r96,0r-28,206r99,0r29,-206r96,0r-28,206r86,0r0,94r-98,0r-18,122r86,0xm341,-422r-99,0r-18,122r99,0","w":556},"$":{"d":"19,-127r86,-78v31,43,76,83,127,93r0,-206v-104,-30,-200,-98,-200,-211v0,-118,90,-188,200,-193r0,-64r78,0r0,64v84,14,144,55,190,106r-78,75v-29,-35,-65,-66,-112,-71r0,184v112,40,212,93,212,228v0,121,-95,197,-212,200r0,114r-78,0r0,-115v-69,0,-164,-60,-213,-126xm232,-450r0,-168v-46,1,-86,29,-86,79v0,44,42,76,86,89xm310,-295r0,185v52,0,90,-35,90,-86v0,-59,-43,-78,-90,-99","w":556},"%":{"d":"214,-722v101,0,180,82,180,180v0,98,-79,180,-180,180v-101,0,-180,-82,-180,-180v0,-98,79,-180,180,-180xm214,-624v-45,0,-82,39,-82,82v0,43,37,82,82,82v45,0,82,-39,82,-82v0,-43,-37,-82,-82,-82xm675,-360v101,0,180,82,180,180v0,98,-79,180,-180,180v-101,0,-180,-82,-180,-180v0,-98,79,-180,180,-180xm675,-262v-45,0,-82,39,-82,82v0,43,37,82,82,82v45,0,82,-39,82,-82v0,-43,-37,-82,-82,-82xm197,10r415,-742r85,0r-415,742r-85,0","w":889},"&":{"d":"274,-648v-40,0,-63,34,-63,78v0,42,17,74,41,114v38,-34,86,-67,86,-125v0,-31,-22,-67,-64,-67xm507,-363r111,31v-23,60,-49,121,-86,180v29,20,63,36,100,40r0,122v-69,0,-114,-16,-182,-74v-47,46,-110,74,-181,74v-139,0,-235,-68,-235,-200v0,-100,50,-153,122,-200v-38,-57,-59,-102,-59,-162v0,-124,87,-180,185,-180v98,0,170,72,170,163v0,93,-72,147,-139,200v39,53,82,102,129,147v26,-47,51,-91,65,-141xm172,-208v-3,117,140,129,196,64v-55,-48,-102,-100,-144,-154v-31,24,-52,48,-52,90","w":667},"'":{"d":"56,-452r0,-270r110,0r0,270r-110,0","w":222},"(":{"d":"304,84r-118,0v-81,-114,-136,-255,-136,-408v0,-153,55,-294,136,-408r118,0v-77,108,-144,233,-144,408v0,175,67,300,144,408","w":333},")":{"d":"147,84r-118,0v77,-108,144,-233,144,-408v0,-175,-67,-300,-144,-408r118,0v81,114,136,255,136,408v0,153,-55,294,-136,408","w":333},"*":{"d":"200,-722r100,0r-29,145r4,5r133,-68r26,89r-146,18r-2,6r106,104r-75,57r-64,-134r-6,0r-64,134r-75,-57r106,-104r-2,-6r-146,-18r26,-89r133,68r4,-5"},"+":{"d":"239,-333r0,-211r122,0r0,211r211,0r0,122r-211,0r0,211r-122,0r0,-211r-211,0r0,-122r211,0","w":600},",":{"d":"77,148r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0","w":278},"-":{"d":"289,-217r-246,0r0,-110r246,0r0,110","w":333},".":{"d":"210,0r-142,0r0,-142r142,0r0,142","w":278},"\/":{"d":"336,-732r-272,742r-122,0r272,-742r122,0","w":278},"0":{"d":"36,-240r0,-242v0,-154,86,-250,242,-250v156,0,242,96,242,250r0,242v0,154,-86,250,-242,250v-156,0,-242,-96,-242,-250xm168,-467r0,212v0,117,36,151,110,151v74,0,110,-34,110,-151r0,-212v0,-117,-36,-151,-110,-151v-74,0,-110,34,-110,151","w":556},"1":{"d":"235,0r0,-552r-111,0r0,-79v106,-21,124,-57,158,-101r79,0r0,732r-126,0","w":556},"2":{"d":"495,0r-455,0r0,-117v288,-274,334,-326,334,-402v0,-58,-32,-99,-96,-99v-77,0,-110,47,-103,121r-132,0r0,-34v0,-106,85,-201,225,-201v141,0,238,72,238,210v0,167,-195,296,-299,408r288,0r0,114","w":556},"3":{"d":"34,-212r132,0v0,74,33,108,107,108v68,0,105,-45,105,-107v0,-81,-46,-112,-146,-113r0,-114v93,0,129,-26,129,-93v0,-50,-33,-87,-93,-87v-49,0,-85,35,-87,84r-132,0v1,-133,99,-198,220,-198v130,0,224,68,224,196v0,63,-30,128,-87,157v77,30,104,93,104,174v0,143,-105,215,-235,215v-162,0,-241,-86,-241,-222","w":556},"4":{"d":"110,-292r207,0r0,-282r-2,0xm0,-306r306,-416r137,0r0,430r101,0r0,102r-101,0r0,190r-126,0r0,-190r-317,0r0,-116","w":556},"5":{"d":"35,-207r132,0v-3,67,38,103,103,103v86,0,112,-56,112,-157v0,-89,-30,-139,-105,-139v-45,0,-81,22,-106,56r-109,0r0,-378r417,0r0,114r-303,0r0,150v38,-27,78,-44,131,-44v154,0,207,96,207,244v0,167,-69,268,-242,268v-180,0,-237,-108,-237,-217","w":556},"6":{"d":"168,-295r0,40v0,117,36,151,110,151v69,0,104,-50,104,-133v0,-80,-43,-117,-104,-117v-42,0,-76,28,-110,59xm501,-533r-132,0v-2,-49,-42,-85,-91,-85v-74,0,-110,34,-110,151r0,67v45,-34,98,-56,155,-56v126,0,191,98,191,214v0,148,-72,252,-236,252v-156,0,-242,-96,-242,-250r0,-242v0,-154,86,-250,242,-250v125,0,213,69,223,199","w":556},"7":{"d":"30,-608r0,-114r456,0r0,66r-195,656r-144,0r200,-608r-317,0","w":556},"8":{"d":"388,-209v0,-67,-43,-111,-110,-111v-67,0,-110,44,-110,111v0,62,29,105,110,105v81,0,110,-43,110,-105xm370,-525v0,-51,-38,-93,-92,-93v-54,0,-92,42,-92,93v0,51,41,91,92,91v51,0,92,-40,92,-91xm520,-205v0,143,-105,215,-242,215v-137,0,-242,-72,-242,-215v0,-81,28,-144,105,-174v-57,-29,-87,-94,-87,-157v0,-134,99,-196,224,-196v125,0,224,62,224,196v0,63,-30,128,-87,157v77,30,105,93,105,174","w":556},"9":{"d":"388,-427r0,-40v0,-117,-36,-151,-110,-151v-69,0,-104,50,-104,133v0,80,43,117,104,117v42,0,76,-28,110,-59xm55,-189r132,0v2,49,42,85,91,85v74,0,110,-34,110,-151r0,-67v-45,34,-98,56,-155,56v-126,0,-191,-98,-191,-214v0,-148,72,-252,236,-252v156,0,242,96,242,250r0,242v0,154,-86,250,-242,250v-125,0,-213,-69,-223,-199","w":556},":":{"d":"210,0r-142,0r0,-142r142,0r0,142xm210,-300r-142,0r0,-142r142,0r0,142","w":278},";":{"d":"77,148r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0xm210,-300r-142,0r0,-142r142,0r0,142","w":278},"<":{"d":"572,-108r0,117r-544,-233r0,-96r544,-233r0,117r-389,164","w":600},"=":{"d":"572,-455r0,122r-544,0r0,-122r544,0xm572,-211r0,122r-544,0r0,-122r544,0","w":600},">":{"d":"28,9r0,-117r389,-164r-389,-164r0,-117r544,233r0,96","w":600},"?":{"d":"398,-562v0,89,-142,189,-144,272r0,50r-110,0r0,-98v0,-48,128,-176,128,-234v0,-34,-31,-58,-63,-58v-41,0,-81,44,-84,88r-115,-32v25,-99,99,-158,201,-158v95,0,187,59,187,170xm270,0r-142,0r0,-142r142,0r0,142","w":444},"@":{"d":"411,-452v-62,0,-107,60,-107,117v0,48,29,83,77,83v65,0,109,-59,109,-119v0,-48,-32,-81,-79,-81xm518,-492r12,-50r90,0r-50,244v-3,17,-18,58,8,58v46,0,101,-55,101,-162v0,-160,-113,-246,-265,-246v-167,0,-275,123,-275,288v0,175,121,286,291,286v77,0,147,-28,197,-70r92,0v-69,99,-174,154,-297,154v-211,0,-385,-156,-385,-370v0,-211,171,-372,380,-372v176,0,346,118,346,302v0,220,-191,288,-253,288v-28,0,-53,-18,-54,-52r-2,-1v-25,28,-64,53,-100,53v-86,0,-160,-82,-160,-176v0,-120,80,-236,205,-236v49,0,91,19,119,62","w":800},"A":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0","w":556},"B":{"d":"62,0r0,-722r194,0v148,0,233,62,233,186v0,63,-31,115,-89,150v76,48,106,88,106,178v0,143,-96,208,-242,208r-202,0xm200,-322r0,208r58,0v72,0,110,-42,110,-105v0,-69,-48,-103,-120,-103r-48,0xm200,-608r0,172r48,0v62,0,103,-36,103,-85v0,-53,-31,-87,-96,-87r-55,0","w":556},"C":{"d":"188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-48r138,0r0,30v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242r0,-258v0,-178,94,-242,228,-242v135,0,229,65,228,244r-138,0r0,-20v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102","w":556},"D":{"d":"62,0r0,-722r192,0v158,0,252,68,252,250r0,222v-6,182,-94,250,-252,250r-192,0xm200,-600r0,478v110,6,168,-14,168,-144r0,-190v0,-102,-34,-144,-120,-144r-48,0","w":556},"E":{"d":"450,0r-388,0r0,-722r378,0r0,122r-240,0r0,166r183,0r0,122r-183,0r0,190r250,0r0,122"},"F":{"d":"200,0r-138,0r0,-722r360,0r0,122r-222,0r0,166r174,0r0,122r-174,0r0,312","w":444},"G":{"d":"428,0r-21,-60v-37,42,-77,70,-129,70v-134,0,-228,-64,-228,-242r0,-258v0,-178,94,-242,228,-242v141,0,217,81,222,245r-138,0v0,-93,-34,-123,-84,-123v-55,0,-90,22,-90,102r0,294v0,80,35,102,90,102v52,0,84,-38,84,-100r0,-44r-97,0r0,-114r235,0r0,370r-72,0","w":556},"H":{"d":"208,0r-138,0r0,-722r138,0r0,288r195,0r0,-288r138,0r0,722r-138,0r0,-312r-195,0r0,312","w":611},"I":{"d":"208,0r-138,0r0,-722r138,0r0,722","w":278},"J":{"d":"125,-722r138,0r0,569v0,97,-65,163,-185,163v-30,0,-48,-1,-68,-3r0,-122v14,1,25,3,37,3v63,0,78,-17,78,-69r0,-541","w":333},"K":{"d":"200,0r-138,0r0,-722r138,0r0,298r2,0r179,-298r151,0r-186,291r207,431r-155,0r-144,-303r-54,82r0,221","w":556},"L":{"d":"422,0r-360,0r0,-722r138,0r0,600r222,0r0,122","w":444},"M":{"d":"188,0r-118,0r0,-722r193,0r125,474r2,0r125,-474r193,0r0,722r-118,0r0,-568r-2,0r-147,568r-104,0r-147,-568r-2,0r0,568","w":778},"N":{"d":"196,0r-126,0r0,-722r151,0r192,428r2,0r0,-428r126,0r0,722r-132,0r-211,-466r-2,0r0,466","w":611},"O":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102","w":556},"P":{"d":"208,0r-138,0r0,-722r199,0v170,0,253,80,253,216v0,136,-83,216,-253,216r-61,0r0,290xm208,-608r0,204r74,0v68,0,102,-34,102,-102v0,-68,-34,-102,-102,-102r-74,0","w":556},"Q":{"d":"549,-67r0,120v-67,0,-111,-31,-145,-71v-36,20,-78,28,-126,28v-134,0,-228,-64,-228,-242r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,59,-10,105,-29,141v19,14,42,23,72,24xm269,-180r0,-120v45,6,74,32,97,66r2,0r0,-274v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102r0,294v0,80,35,102,90,102v21,0,38,-3,52,-11v-19,-27,-38,-49,-61,-57","w":556},"R":{"d":"534,0r-148,0r-120,-294r-66,0r0,294r-138,0r0,-722r200,0v166,0,245,80,245,216v0,90,-32,155,-109,184xm200,-608r0,200r71,0v61,0,98,-30,98,-100v0,-70,-37,-100,-98,-100r-71,0","w":556},"S":{"d":"491,-557r-124,36v-23,-68,-53,-97,-101,-97v-49,0,-76,30,-76,79v0,109,308,117,308,343v0,124,-85,206,-230,206v-112,0,-199,-61,-236,-203r136,-29v16,87,66,118,107,118v48,0,85,-32,85,-86v0,-136,-308,-138,-308,-340v0,-124,74,-202,217,-202v123,0,198,73,222,175","w":556},"T":{"d":"20,-722r460,0r0,122r-161,0r0,600r-138,0r0,-600r-161,0r0,-122"},"U":{"d":"70,-722r138,0r0,505v0,69,30,105,97,105v67,0,98,-36,98,-105r0,-505r138,0r0,506v0,159,-94,226,-236,226v-142,0,-235,-67,-235,-226r0,-506","w":611},"V":{"d":"200,0r-185,-722r136,0r127,516r2,0r126,-516r135,0r-184,722r-157,0","w":556},"W":{"d":"174,0r-151,-722r128,0r97,472r2,0r99,-472r133,0r100,472r2,0r96,-472r129,0r-158,722r-133,0r-101,-494r-2,0r-109,494r-132,0","w":833},"X":{"d":"174,-722r104,216r104,-216r148,0r-175,342r192,380r-149,0r-120,-255r-120,255r-149,0r194,-380r-177,-342r148,0","w":556},"Y":{"d":"159,-722r121,291r117,-291r147,0r-197,430r0,292r-138,0r0,-292r-197,-430r147,0","w":556},"Z":{"d":"61,-600r0,-122r400,0r0,116r-273,484r279,0r0,122r-434,0r0,-117r273,-483r-245,0"},"[":{"d":"284,74r-234,0r0,-796r234,0r0,60r-124,0r0,676r124,0r0,60","w":333},"\\":{"d":"214,10r-272,-742r122,0r272,742r-122,0","w":278},"]":{"d":"49,-722r234,0r0,796r-234,0r0,-60r124,0r0,-676r-124,0r0,-60","w":333},"^":{"d":"169,-320r-117,0r194,-402r108,0r194,402r-119,0r-129,-282","w":600},"_":{"d":"500,125r-500,0r0,-50r500,0r0,50"},"`":{"d":"-24,-756r155,0r93,146r-101,0","w":278},"a":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50"},"b":{"d":"186,-421r0,298v25,27,48,39,76,39v34,0,62,-22,62,-130r0,-116v0,-108,-28,-130,-62,-130v-28,0,-51,12,-76,39xm176,0r-116,0r0,-722r126,0r0,228v60,-44,92,-60,126,-60v98,0,138,76,138,216r0,132v0,140,-40,216,-138,216v-56,0,-112,-42,-134,-76r-2,0r0,66"},"c":{"d":"449,-356r-125,0v6,-58,-20,-88,-74,-88v-44,0,-74,22,-74,64r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-34r126,0v1,145,-73,208,-200,208v-126,0,-200,-62,-200,-206r0,-152v0,-144,74,-206,200,-206v123,0,197,60,199,198"},"d":{"d":"314,-123r0,-298v-25,-27,-48,-39,-76,-39v-34,0,-62,22,-62,130r0,116v0,108,28,130,62,130v28,0,51,-12,76,-39xm440,0r-116,0r0,-66r-2,0v-22,34,-78,76,-134,76v-98,0,-138,-76,-138,-216r0,-132v0,-140,40,-216,138,-216v34,0,66,16,126,60r0,-228r126,0r0,722"},"e":{"d":"450,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-120,0,-200,-74,-200,-193r0,-178v0,-119,80,-193,200,-193v117,0,200,74,200,185r0,127xm176,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108"},"f":{"d":"270,-726r0,104r-36,0v-52,-1,-43,53,-43,102r75,0r0,102r-75,0r0,418r-126,0r0,-418r-57,0r0,-102r57,0r0,-52v-2,-152,84,-173,205,-154","w":278},"g":{"d":"292,-347v0,-70,-22,-105,-66,-105v-48,0,-66,33,-66,118v0,68,22,102,60,102v54,0,72,-20,72,-115xm478,-554r0,110v-10,-2,-29,-8,-39,-8v-13,0,-26,7,-43,12v8,36,16,63,16,96v0,136,-58,214,-182,214v-18,0,-33,-1,-52,-7v-7,10,-22,19,-22,32v0,68,316,-37,316,160v0,93,-96,137,-242,137v-134,0,-208,-38,-208,-99v0,-41,46,-66,76,-85v-30,-18,-52,-42,-52,-77v0,-43,45,-72,76,-91v-61,-40,-82,-98,-82,-189v0,-117,45,-205,186,-205v52,0,110,24,142,63v32,-40,63,-63,110,-63xm306,36r-138,-12v-13,13,-26,24,-26,44v0,28,41,40,115,40v60,0,95,-15,95,-43v0,-18,-8,-26,-46,-29"},"h":{"d":"186,0r-126,0r0,-722r126,0r0,240v42,-40,85,-72,137,-72v77,0,117,39,117,140r0,414r-126,0r0,-400v0,-36,-12,-60,-46,-60v-26,0,-55,25,-82,49r0,411"},"i":{"d":"76,-544r126,0r0,544r-126,0r0,-544xm202,-638r-126,0r0,-114r126,0r0,114","w":278},"j":{"d":"76,-544r126,0r0,588v-2,121,-90,160,-200,145r0,-111v54,0,74,-16,74,-50r0,-572xm202,-638r-126,0r0,-114r126,0r0,114","w":278},"k":{"d":"192,0r-126,0r0,-722r126,0r0,389r2,0r134,-211r141,0r-125,184r136,360r-133,0r-92,-255r-63,89r0,166"},"l":{"d":"76,0r0,-722r126,0r0,722r-126,0","w":278},"m":{"d":"60,0r0,-544r122,0r0,62v41,-37,82,-72,135,-72v47,0,81,32,96,82v39,-43,79,-82,134,-82v76,0,115,46,115,144r0,410r-126,0r0,-414v0,-36,-13,-46,-33,-46v-24,0,-63,28,-79,49r0,411r-126,0r0,-414v-3,-89,-90,-29,-112,3r0,411r-126,0","w":722},"n":{"d":"186,0r-126,0r0,-544r122,0r0,62v46,-40,89,-72,141,-72v77,0,117,39,117,140r0,414r-126,0r0,-400v0,-36,-12,-60,-46,-60v-26,0,-55,25,-82,49r0,411"},"o":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64"},"p":{"d":"186,-421r0,298v25,27,48,39,76,39v34,0,62,-22,62,-130r0,-116v0,-108,-28,-130,-62,-130v-28,0,-51,12,-76,39xm60,-544r116,0r0,66r2,0v22,-34,78,-76,134,-76v98,0,138,76,138,216r0,132v0,140,-40,216,-138,216v-34,0,-66,-16,-126,-60r0,242r-126,0r0,-736"},"q":{"d":"314,-123r0,-298v-25,-27,-48,-39,-76,-39v-34,0,-62,22,-62,130r0,116v0,108,28,130,62,130v28,0,51,-12,76,-39xm324,-544r116,0r0,736r-126,0r0,-242v-60,44,-92,60,-126,60v-98,0,-138,-76,-138,-216r0,-132v0,-140,40,-216,138,-216v56,0,112,42,134,76r2,0r0,-66"},"r":{"d":"186,0r-126,0r0,-544r123,0r0,72r2,0v29,-54,67,-82,130,-82r0,136v-21,-6,-45,-14,-67,-14v-41,0,-62,31,-62,60r0,372","w":333},"s":{"d":"404,-418r-104,40v-17,-50,-49,-74,-87,-74v-29,0,-51,21,-51,49v0,84,246,86,246,248v0,108,-76,165,-181,165v-76,0,-144,-19,-205,-155r113,-31v11,51,42,84,92,84v38,0,61,-18,61,-48v0,-104,-246,-79,-246,-262v0,-103,83,-152,172,-152v94,0,159,54,190,136","w":444},"t":{"d":"56,-418r-50,0r0,-102r50,0r0,-148r126,0r0,148r81,0r0,102r-81,0r0,278v-2,35,42,44,82,39r0,106v-24,4,-48,5,-72,5v-82,0,-136,-30,-136,-108r0,-320","w":278},"u":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-46,40,-89,72,-141,72v-77,0,-117,-39,-117,-140r0,-414r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411"},"v":{"d":"138,-544r83,350r2,0r83,-350r126,0r-148,544r-124,0r-148,-544r126,0","w":444},"w":{"d":"143,0r-130,-544r118,0r73,340r2,0r73,-340r108,0r77,340r2,0r69,-340r118,0r-128,544r-118,0r-77,-340r-2,0r-67,340r-118,0","w":667},"x":{"d":"155,-280r-138,-264r134,0r71,156r73,-156r134,0r-138,265r147,279r-134,0r-82,-176r-82,176r-134,0","w":444},"y":{"d":"32,190r0,-110v12,2,24,2,37,2v55,0,91,-48,91,-72v0,-32,-10,-69,-23,-115r-126,-439r128,0r85,360r2,0r79,-360r128,0r-145,542v-42,162,-102,203,-256,192","w":444},"z":{"d":"51,-434r0,-110r362,0r0,108r-231,326r231,0r0,110r-382,0r0,-108r227,-326r-207,0","w":444},"{":{"d":"261,-732r0,60v-53,-3,-84,3,-84,61r0,194v0,57,-31,83,-79,91r0,2v48,8,79,34,79,91r0,196v-1,58,31,64,84,61r0,60r-79,0v-55,0,-115,-37,-115,-119r0,-197v0,-50,-31,-63,-71,-63r0,-60v40,0,71,-13,71,-63r0,-195v0,-82,60,-119,115,-119r79,0","w":333},"|":{"d":"50,10r0,-742r122,0r0,742r-122,0","w":222},"}":{"d":"72,84r0,-60v53,3,84,-3,84,-61r0,-194v0,-57,31,-83,79,-91r0,-2v-48,-8,-79,-34,-79,-91r0,-196v1,-58,-31,-64,-84,-61r0,-60r79,0v55,0,115,37,115,119r0,197v0,50,31,63,71,63r0,60v-40,0,-71,13,-71,63r0,195v0,82,-60,119,-115,119r-79,0","w":333},"~":{"d":"414,-179v-91,0,-138,-73,-238,-73v-42,0,-68,40,-85,77r-39,-96v24,-46,63,-93,135,-93v75,0,174,73,234,73v38,0,64,-40,89,-78r38,98v-31,45,-67,92,-134,92","w":600},"\u00a0":{"w":278},"\u00a1":{"d":"212,178r-146,0r28,-478r90,0xm68,-544r142,0r0,142r-142,0r0,-142","w":278},"\u00a2":{"d":"193,-135r77,-309v-53,-1,-84,21,-84,64r0,216v0,10,2,20,7,29xm479,-356r-125,0v1,-28,0,-50,-16,-64r-82,319v57,6,101,-18,98,-63r0,-34r126,0v3,157,-91,219,-246,206r-36,132r-89,0r42,-154v-58,-31,-91,-90,-91,-182r0,-152v-2,-155,90,-217,239,-204r34,-124r89,0r-39,144v61,26,95,84,96,176","w":556},"\u00a3":{"d":"112,-318r-96,0r0,-88r83,0v-8,-43,-15,-89,-15,-131v0,-129,95,-195,204,-195v162,0,233,81,233,214r-126,0v-5,-62,-27,-104,-95,-104v-52,0,-84,36,-84,90v0,45,8,86,15,126r132,0r0,88r-120,0v0,26,-6,126,-25,170v37,24,74,44,124,44v50,0,67,-41,71,-114r120,0v0,118,-30,228,-181,228v-68,0,-100,-10,-188,-65v-52,46,-84,65,-141,65r0,-122v74,2,102,-108,89,-206","w":556},"\u00a4":{"d":"537,-160r-58,58r-57,-58v-63,64,-225,65,-288,0r-57,58r-58,-58r56,-56v-59,-69,-60,-221,0,-290r-56,-56r58,-58r57,58v63,-64,225,-65,288,0r57,-58r58,58r-56,56v59,69,60,221,0,290xm414,-361v0,-82,-51,-148,-136,-148v-85,0,-136,66,-136,148v0,82,51,148,136,148v85,0,136,-66,136,-148","w":556},"\u00a5":{"d":"499,-452r0,88r-126,0r-32,72r158,0r0,88r-162,0r0,204r-118,0r0,-204r-162,0r0,-88r158,0r-32,-72r-126,0r0,-88r86,0r-125,-270r122,0r140,322r136,-322r122,0r-125,270r86,0","w":556},"\u00a6":{"d":"50,10r0,-284r122,0r0,284r-122,0xm50,-448r0,-284r122,0r0,284r-122,0","w":222},"\u00a7":{"d":"402,-652r-68,54v-21,-25,-47,-50,-82,-50v-27,0,-47,18,-47,42v0,78,243,196,243,331v0,66,-48,103,-109,114v30,32,52,72,52,117v0,83,-68,128,-144,128v-85,0,-120,-37,-161,-85r68,-53v14,28,46,54,90,54v27,0,51,-18,51,-48v0,-84,-243,-220,-243,-326v0,-90,42,-120,104,-130v-30,-36,-47,-65,-47,-112v0,-64,57,-116,134,-116v69,0,115,25,159,80xm352,-271v0,-17,-13,-34,-67,-92v-46,-50,-81,-75,-98,-75v-20,0,-38,15,-39,37v0,19,12,42,62,94v54,57,85,80,103,80v25,0,39,-20,39,-44"},"\u00a8":{"d":"-16,-732r120,0r0,114r-120,0r0,-114xm174,-732r120,0r0,114r-120,0r0,-114","w":278},"\u00a9":{"d":"400,10v-200,0,-383,-138,-383,-371v0,-233,183,-371,383,-371v200,0,383,138,383,371v0,233,-183,371,-383,371xm669,-361v0,-168,-122,-283,-269,-283v-150,0,-269,115,-269,283v0,168,119,283,269,283v147,0,269,-115,269,-283xm504,-305r90,0v-16,102,-93,157,-179,157v-126,0,-207,-94,-207,-216v0,-124,77,-216,205,-216v89,0,161,52,177,152r-86,0v-9,-46,-48,-64,-91,-64v-65,0,-101,49,-101,126v0,74,41,130,103,130v49,0,84,-21,89,-69","w":800},"\u00aa":{"d":"16,-627v4,-75,63,-105,135,-105v88,0,121,40,121,99r0,207v0,9,2,18,4,26r-86,0v-2,-8,-3,-19,-5,-32v-20,22,-53,38,-94,38v-49,0,-81,-25,-81,-78v0,-76,78,-110,172,-138v2,-31,-1,-53,-34,-52v-25,0,-42,16,-42,35r-90,0xm182,-490r0,-58v-41,16,-82,33,-82,63v0,18,14,25,28,25v25,0,42,-12,54,-30","w":300},"\u00ab":{"d":"386,-112r-122,-160r122,-160r110,0r-122,160r122,160r-110,0xm182,-112r-122,-160r122,-160r110,0r-122,160r122,160r-110,0","w":556},"\u00ac":{"d":"450,-89r0,-244r-422,0r0,-122r544,0r0,366r-122,0","w":600},"\u00ad":{"d":"289,-217r-246,0r0,-110r246,0r0,110","w":333},"\u00ae":{"d":"337,-325r0,167r-88,0r0,-407r153,0v106,0,167,30,167,123v0,75,-44,104,-101,108r94,176r-97,0r-87,-167r-41,0xm337,-493r0,96r77,0v49,0,63,-13,63,-54v0,-31,-18,-42,-78,-42r-62,0xm400,10v-200,0,-383,-138,-383,-371v0,-233,183,-371,383,-371v200,0,383,138,383,371v0,233,-183,371,-383,371xm669,-361v0,-168,-122,-283,-269,-283v-150,0,-269,115,-269,283v0,168,119,283,269,283v147,0,269,-115,269,-283","w":800},"\u00af":{"d":"313,-640r-348,0r0,-74r348,0r0,74","w":278},"\u00b0":{"d":"200,-502v48,0,82,-39,82,-87v0,-48,-34,-87,-82,-87v-48,0,-82,39,-82,87v0,48,34,87,82,87xm200,-446v-81,0,-144,-63,-144,-143v0,-80,63,-143,144,-143v81,0,144,63,144,143v0,80,-63,143,-144,143","w":400},"\u00b1":{"d":"239,-410r0,-134r122,0r0,134r211,0r0,122r-211,0r0,134r-122,0r0,-134r-211,0r0,-122r211,0xm28,0r0,-122r544,0r0,122r-544,0","w":600},"\u00b2":{"d":"311,-292r-296,0r0,-75v183,-161,213,-192,213,-237v0,-29,-17,-54,-58,-54v-51,0,-66,26,-63,67r-90,0r0,-21v0,-63,55,-120,146,-120v92,0,155,43,155,126v0,100,-119,177,-186,240r179,0r0,74","w":333},"\u00b3":{"d":"20,-609v1,-83,62,-123,143,-123v84,0,145,41,145,117v0,38,-19,77,-56,95v50,18,68,55,68,104v0,86,-69,130,-153,130v-106,0,-157,-53,-157,-134r90,0v0,42,19,60,65,60v41,0,65,-24,65,-60v0,-48,-30,-64,-91,-64r0,-74v55,0,79,-13,79,-54v0,-24,-21,-46,-56,-46v-30,0,-51,21,-52,49r-90,0","w":333},"\u00b4":{"d":"147,-756r155,0r-147,146r-101,0","w":278},"\u00b5":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-43,37,-83,68,-132,72r0,182r-126,0r0,-736r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411"},"\u00b6":{"d":"190,84r0,-454v-112,0,-180,-66,-180,-173v0,-119,62,-179,214,-179r322,0r0,84r-68,0r0,722r-110,0r0,-722r-68,0r0,722r-110,0","w":556},"\u00b7":{"d":"139,-348v45,0,76,37,76,76v0,39,-31,76,-76,76v-45,0,-76,-37,-76,-76v0,-39,31,-76,76,-76","w":278},"\u00b8":{"d":"2,203r19,-42v24,8,50,17,75,17v24,0,56,-10,56,-39v0,-41,-52,-42,-86,-29r-21,-20r59,-90r53,0r-42,61r2,2v54,-23,121,14,121,71v0,68,-69,94,-127,94v-38,0,-74,-11,-109,-25","w":278},"\u00b9":{"d":"143,-292r0,-330r-67,0r0,-54v62,-12,77,-30,95,-56r62,0r0,440r-90,0","w":333},"\u00ba":{"d":"20,-518r0,-91v0,-86,48,-123,130,-123v81,0,130,37,130,123r0,91v0,87,-49,124,-130,124v-82,0,-130,-37,-130,-124xm110,-620r0,114v0,25,11,38,40,38v28,0,40,-13,40,-38r0,-114v0,-25,-12,-38,-40,-38v-29,0,-40,13,-40,38","w":300},"\u00bb":{"d":"292,-272r-122,160r-110,0r122,-160r-122,-160r110,0xm496,-272r-122,160r-110,0r122,-160r-122,-160r110,0","w":556},"\u00bc":{"d":"540,-184r102,0r0,-131r-2,0xm444,-184r199,-249r89,0r0,249r66,0r0,70r-66,0r0,114r-90,0r0,-114r-198,0r0,-70xm147,-292r0,-330r-67,0r0,-54v62,-12,77,-30,95,-56r62,0r0,440r-90,0xm153,10r405,-742r96,0r-405,742r-96,0","w":834},"\u00bd":{"d":"147,-292r0,-330r-67,0r0,-54v62,-12,77,-30,95,-56r62,0r0,440r-90,0xm791,0r-296,0r0,-75v183,-161,213,-192,213,-237v0,-29,-17,-54,-58,-54v-51,0,-66,26,-63,67r-90,0r0,-21v0,-63,55,-120,146,-120v92,0,155,43,155,126v0,100,-119,177,-186,240r179,0r0,74xm135,10r405,-742r96,0r-405,742r-96,0","w":834},"\u00be":{"d":"540,-184r102,0r0,-131r-2,0xm444,-184r199,-249r89,0r0,249r66,0r0,70r-66,0r0,114r-90,0r0,-114r-198,0r0,-70xm46,-609v1,-83,62,-123,143,-123v84,0,145,41,145,117v0,38,-19,77,-56,95v50,18,68,55,68,104v0,86,-69,130,-153,130v-106,0,-157,-53,-157,-134r90,0v0,42,19,60,65,60v41,0,65,-24,65,-60v0,-48,-30,-64,-91,-64r0,-74v55,0,79,-13,79,-54v0,-24,-21,-46,-56,-46v-30,0,-51,21,-52,49r-90,0xm173,10r405,-742r96,0r-405,742r-96,0","w":834},"\u00bf":{"d":"46,18v0,-89,142,-189,144,-272r0,-50r110,0r0,98v0,48,-128,176,-128,234v0,34,31,58,63,58v41,0,81,-44,84,-88r115,32v-25,99,-99,158,-201,158v-95,0,-187,-59,-187,-170xm174,-544r142,0r0,142r-142,0r0,-142","w":444},"\u00c0":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm115,-909r155,0r93,146r-101,0","w":556},"\u00c1":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm286,-909r155,0r-147,146r-101,0","w":556},"\u00c2":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm215,-909r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":556},"\u00c3":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm396,-897r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43","w":556},"\u00c4":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm123,-885r120,0r0,114r-120,0r0,-114xm313,-885r120,0r0,114r-120,0r0,-114","w":556},"\u00c5":{"d":"278,-566r-68,292r137,0r-67,-292r-2,0xm146,0r-133,0r179,-722r177,0r174,722r-132,0r-35,-152r-191,0xm277,-757v-59,0,-106,-48,-106,-107v0,-58,47,-107,106,-107v58,0,108,49,108,107v0,59,-50,107,-108,107xm277,-917v-30,0,-52,24,-52,53v0,30,22,53,52,53v29,0,54,-23,54,-53v0,-29,-25,-53,-54,-53","w":556},"\u00c6":{"d":"466,-612r-156,314r174,0r0,-314r-18,0xm162,0r-148,0r370,-722r532,0r0,122r-294,0r0,166r221,0r0,122r-221,0r0,190r306,0r0,122r-444,0r0,-176r-236,0","w":1000},"\u00c7":{"d":"188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-48r138,0r0,30v0,173,-89,238,-217,242r-35,51r2,2v54,-23,121,14,121,71v0,68,-69,94,-127,94v-38,0,-74,-11,-109,-25r19,-42v24,8,50,17,75,17v24,0,56,-10,56,-39v0,-41,-52,-42,-86,-29r-21,-20r54,-82v-112,-12,-188,-80,-188,-240r0,-258v0,-178,94,-242,228,-242v135,0,229,65,228,244r-138,0r0,-20v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102","w":556},"\u00c8":{"d":"450,0r-388,0r0,-722r378,0r0,122r-240,0r0,166r183,0r0,122r-183,0r0,190r250,0r0,122xm87,-909r155,0r93,146r-101,0"},"\u00c9":{"d":"450,0r-388,0r0,-722r378,0r0,122r-240,0r0,166r183,0r0,122r-183,0r0,190r250,0r0,122xm258,-909r155,0r-147,146r-101,0"},"\u00ca":{"d":"450,0r-388,0r0,-722r378,0r0,122r-240,0r0,166r183,0r0,122r-183,0r0,190r250,0r0,122xm187,-909r126,0r114,146r-113,0r-64,-82r-64,82r-113,0"},"\u00cb":{"d":"450,0r-388,0r0,-722r378,0r0,122r-240,0r0,166r183,0r0,122r-183,0r0,190r250,0r0,122xm95,-885r120,0r0,114r-120,0r0,-114xm285,-885r120,0r0,114r-120,0r0,-114"},"\u00cc":{"d":"208,0r-138,0r0,-722r138,0r0,722xm-24,-909r155,0r93,146r-101,0","w":278},"\u00cd":{"d":"208,0r-138,0r0,-722r138,0r0,722xm147,-909r155,0r-147,146r-101,0","w":278},"\u00ce":{"d":"208,0r-138,0r0,-722r138,0r0,722xm76,-909r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":278},"\u00cf":{"d":"208,0r-138,0r0,-722r138,0r0,722xm-16,-885r120,0r0,114r-120,0r0,-114xm174,-885r120,0r0,114r-120,0r0,-114","w":278},"\u00d0":{"d":"8,-312r0,-122r54,0r0,-288r192,0v158,0,252,68,252,250r0,222v-6,182,-94,250,-252,250r-192,0r0,-312r-54,0xm288,-434r0,122r-88,0r0,190v110,6,168,-14,168,-144r0,-190v0,-102,-34,-144,-120,-144r-48,0r0,166r88,0","w":556},"\u00d1":{"d":"196,0r-126,0r0,-722r151,0r192,428r2,0r0,-428r126,0r0,722r-132,0r-211,-466r-2,0r0,466xm424,-897r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43","w":611},"\u00d2":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102xm115,-909r155,0r93,146r-101,0","w":556},"\u00d3":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102xm286,-909r155,0r-147,146r-101,0","w":556},"\u00d4":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102xm215,-909r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":556},"\u00d5":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102xm396,-897r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43","w":556},"\u00d6":{"d":"50,-232r0,-258v0,-178,94,-242,228,-242v134,0,228,64,228,242r0,258v0,178,-94,242,-228,242v-134,0,-228,-64,-228,-242xm188,-508r0,294v0,80,35,102,90,102v55,0,90,-22,90,-102r0,-294v0,-80,-35,-102,-90,-102v-55,0,-90,22,-90,102xm123,-885r120,0r0,114r-120,0r0,-114xm313,-885r120,0r0,114r-120,0r0,-114","w":556},"\u00d7":{"d":"214,-272r-186,-187r87,-85r185,185r186,-185r86,85r-186,187r186,186r-86,86r-186,-186r-185,186r-87,-86","w":600},"\u00d8":{"d":"190,-262r162,-316v-15,-24,-41,-32,-74,-32v-55,0,-90,22,-90,102r0,246r2,0xm366,-433r-154,299v14,16,38,22,66,22v55,0,90,-22,90,-102r0,-219r-2,0xm446,-770r104,0r-73,140v19,36,29,82,29,140r0,258v0,178,-94,242,-228,242v-45,0,-86,-7,-120,-25r-48,93r-104,0r81,-156v-24,-37,-37,-87,-37,-154r0,-258v0,-178,94,-242,228,-242v50,0,95,9,132,30","w":556},"\u00d9":{"d":"70,-722r138,0r0,505v0,69,30,105,97,105v67,0,98,-36,98,-105r0,-505r138,0r0,506v0,159,-94,226,-236,226v-142,0,-235,-67,-235,-226r0,-506xm143,-909r155,0r93,146r-101,0","w":611},"\u00da":{"d":"70,-722r138,0r0,505v0,69,30,105,97,105v67,0,98,-36,98,-105r0,-505r138,0r0,506v0,159,-94,226,-236,226v-142,0,-235,-67,-235,-226r0,-506xm314,-909r155,0r-147,146r-101,0","w":611},"\u00db":{"d":"70,-722r138,0r0,505v0,69,30,105,97,105v67,0,98,-36,98,-105r0,-505r138,0r0,506v0,159,-94,226,-236,226v-142,0,-235,-67,-235,-226r0,-506xm243,-909r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":611},"\u00dc":{"d":"70,-722r138,0r0,505v0,69,30,105,97,105v67,0,98,-36,98,-105r0,-505r138,0r0,506v0,159,-94,226,-236,226v-142,0,-235,-67,-235,-226r0,-506xm151,-885r120,0r0,114r-120,0r0,-114xm341,-885r120,0r0,114r-120,0r0,-114","w":611},"\u00dd":{"d":"159,-722r121,291r117,-291r147,0r-197,430r0,292r-138,0r0,-292r-197,-430r147,0xm286,-909r155,0r-147,146r-101,0","w":556},"\u00de":{"d":"208,0r-138,0r0,-722r138,0r0,132r61,0v170,0,253,80,253,216v0,136,-83,216,-253,216r-61,0r0,158xm208,-476r0,204r74,0v68,0,102,-34,102,-102v0,-68,-34,-102,-102,-102r-74,0","w":556},"\u00df":{"d":"186,0r-126,0r0,-523v0,-118,42,-199,189,-199v115,0,179,71,179,201v0,48,-21,104,-65,128v73,39,94,101,94,201v-1,166,-95,235,-221,187r0,-114v60,24,95,2,95,-90v0,-76,-15,-125,-94,-125r0,-102v45,-2,71,-34,71,-88v0,-51,-17,-88,-66,-88v-39,0,-56,28,-56,59r0,553"},"\u00e0":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm87,-756r155,0r93,146r-101,0"},"\u00e1":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm258,-756r155,0r-147,146r-101,0"},"\u00e2":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm187,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0"},"\u00e3":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm368,-744r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43"},"\u00e4":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm95,-732r120,0r0,114r-120,0r0,-114xm285,-732r120,0r0,114r-120,0r0,-114"},"\u00e5":{"d":"48,-385v8,-113,90,-169,202,-169v134,0,185,68,185,165r0,345v0,15,3,30,7,44r-126,0v-3,-14,-5,-31,-9,-53v-37,37,-87,63,-150,63v-76,0,-125,-42,-125,-130v0,-126,120,-180,277,-227r0,-40v0,-47,-29,-65,-65,-65v-38,0,-70,28,-70,67r-126,0xm309,-134r0,-132v-75,26,-151,68,-151,125v0,36,22,57,56,57v38,0,65,-20,95,-50xm249,-604v-59,0,-106,-48,-106,-107v0,-58,47,-107,106,-107v58,0,108,49,108,107v0,59,-50,107,-108,107xm249,-764v-30,0,-52,24,-52,53v0,30,22,53,52,53v29,0,54,-23,54,-53v0,-29,-25,-53,-54,-53"},"\u00e6":{"d":"316,-134r0,-132v-68,26,-144,68,-144,125v0,36,22,57,56,57v38,0,65,-20,88,-50xm716,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-90,0,-144,-45,-165,-70v-84,64,-131,70,-180,70v-76,0,-125,-42,-125,-130v0,-126,120,-180,270,-227r0,-40v0,-47,-22,-65,-58,-65v-38,0,-70,28,-70,67r-126,0v9,-121,101,-169,186,-169v63,0,114,24,144,62v32,-36,79,-62,134,-62v107,0,190,74,190,185r0,127xm442,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108","w":778},"\u00e7":{"d":"449,-356r-125,0v6,-58,-20,-88,-74,-88v-44,0,-74,22,-74,64r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-34r126,0v1,141,-69,204,-189,208r-35,51r2,2v54,-23,121,14,121,71v0,68,-69,94,-127,94v-38,0,-74,-11,-109,-25r19,-42v24,8,50,17,75,17v24,0,56,-10,56,-39v0,-41,-52,-42,-86,-29r-21,-20r54,-82v-101,-12,-160,-76,-160,-204r0,-152v0,-144,74,-206,200,-206v123,0,197,60,199,198"},"\u00e8":{"d":"450,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-120,0,-200,-74,-200,-193r0,-178v0,-119,80,-193,200,-193v117,0,200,74,200,185r0,127xm176,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108xm87,-756r155,0r93,146r-101,0"},"\u00e9":{"d":"450,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-120,0,-200,-74,-200,-193r0,-178v0,-119,80,-193,200,-193v117,0,200,74,200,185r0,127xm176,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108xm258,-756r155,0r-147,146r-101,0"},"\u00ea":{"d":"450,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-120,0,-200,-74,-200,-193r0,-178v0,-119,80,-193,200,-193v117,0,200,74,200,185r0,127xm176,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108xm187,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0"},"\u00eb":{"d":"450,-242r-274,0r0,72v0,54,32,78,74,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-120,0,-200,-74,-200,-193r0,-178v0,-119,80,-193,200,-193v117,0,200,74,200,185r0,127xm176,-344r148,0v4,-64,-11,-109,-74,-108v-62,0,-79,44,-74,108xm95,-732r120,0r0,114r-120,0r0,-114xm285,-732r120,0r0,114r-120,0r0,-114"},"\u00ec":{"d":"202,0r-126,0r0,-544r126,0r0,544xm-24,-756r155,0r93,146r-101,0","w":278},"\u00ed":{"d":"202,0r-126,0r0,-544r126,0r0,544xm147,-756r155,0r-147,146r-101,0","w":278},"\u00ee":{"d":"202,0r-126,0r0,-544r126,0r0,544xm76,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":278},"\u00ef":{"d":"202,0r-126,0r0,-544r126,0r0,544xm-16,-732r120,0r0,114r-120,0r0,-114xm174,-732r120,0r0,114r-120,0r0,-114","w":278},"\u00f0":{"d":"176,-350r0,190v0,39,30,60,74,60v44,0,74,-21,74,-60r0,-190v0,-40,-30,-60,-74,-60v-44,0,-74,20,-74,60xm176,-708r118,-14v11,12,21,24,32,37r108,-37r30,74r-91,32v51,87,77,184,77,290r0,143v0,135,-74,193,-200,193v-126,0,-200,-58,-200,-193r0,-143v0,-135,74,-194,200,-194v14,0,25,0,43,4v-5,-22,-14,-43,-25,-64r-110,38r-30,-74r95,-33v-15,-20,-31,-39,-47,-59"},"\u00f1":{"d":"186,0r-126,0r0,-544r122,0r0,62v46,-40,89,-72,141,-72v77,0,117,39,117,140r0,414r-126,0r0,-400v0,-36,-12,-60,-46,-60v-26,0,-55,25,-82,49r0,411xm368,-744r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43"},"\u00f2":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm87,-756r155,0r93,146r-101,0"},"\u00f3":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm258,-756r155,0r-147,146r-101,0"},"\u00f4":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm187,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0"},"\u00f5":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm368,-744r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43"},"\u00f6":{"d":"50,-196r0,-152v0,-144,74,-206,200,-206v126,0,200,62,200,206r0,152v0,144,-74,206,-200,206v-126,0,-200,-62,-200,-206xm176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm95,-732r120,0r0,114r-120,0r0,-114xm285,-732r120,0r0,114r-120,0r0,-114"},"\u00f7":{"d":"572,-211r-544,0r0,-122r544,0r0,122xm204,-495v0,-52,44,-95,96,-95v50,0,94,44,94,95v0,48,-44,95,-93,95v-53,0,-97,-43,-97,-95xm204,-49v0,-53,44,-95,96,-95v50,0,94,43,94,95v0,47,-44,95,-93,95v-53,0,-97,-44,-97,-95","w":600},"\u00f8":{"d":"178,-209r118,-223v-12,-8,-28,-12,-46,-12v-44,0,-74,22,-74,64r0,171r2,0xm322,-317r-111,209v10,5,23,8,39,8v44,0,74,-22,74,-64r0,-153r-2,0xm156,-6r-63,118r-89,0r88,-164v-28,-33,-42,-80,-42,-144r0,-152v0,-144,74,-206,200,-206v39,0,73,6,102,19r51,-95r89,0r-78,146v49,57,36,183,36,288v0,144,-74,206,-200,206v-36,0,-68,-5,-94,-16"},"\u00f9":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-46,40,-89,72,-141,72v-77,0,-117,-39,-117,-140r0,-414r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411xm78,-756r155,0r93,146r-101,0"},"\u00fa":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-46,40,-89,72,-141,72v-77,0,-117,-39,-117,-140r0,-414r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411xm249,-756r155,0r-147,146r-101,0"},"\u00fb":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-46,40,-89,72,-141,72v-77,0,-117,-39,-117,-140r0,-414r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411xm178,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0"},"\u00fc":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-46,40,-89,72,-141,72v-77,0,-117,-39,-117,-140r0,-414r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411xm86,-732r120,0r0,114r-120,0r0,-114xm276,-732r120,0r0,114r-120,0r0,-114"},"\u00fd":{"d":"32,190r0,-110v12,2,24,2,37,2v55,0,91,-48,91,-72v0,-32,-10,-69,-23,-115r-126,-439r128,0r85,360r2,0r79,-360r128,0r-145,542v-42,162,-102,203,-256,192xm230,-756r155,0r-147,146r-101,0","w":444},"\u00fe":{"d":"186,-421r0,298v25,27,48,39,76,39v34,0,62,-22,62,-130r0,-116v0,-108,-28,-130,-62,-130v-28,0,-51,12,-76,39xm60,-722r124,0r0,234r2,0v14,-24,70,-66,126,-66v98,0,138,76,138,216r0,132v0,140,-40,216,-138,216v-34,0,-66,-16,-126,-60r0,242r-126,0r0,-914"},"\u00ff":{"d":"32,190r0,-110v12,2,24,2,37,2v55,0,91,-48,91,-72v0,-32,-10,-69,-23,-115r-126,-439r128,0r85,360r2,0r79,-360r128,0r-145,542v-42,162,-102,203,-256,192xm67,-732r120,0r0,114r-120,0r0,-114xm257,-732r120,0r0,114r-120,0r0,-114","w":444},"\u0131":{"d":"202,0r-126,0r0,-544r126,0r0,544","w":278},"\u0141":{"d":"200,-316r0,194r222,0r0,122r-360,0r0,-260r-62,25r0,-116r62,-25r0,-346r138,0r0,290r163,-66r-1,116","w":444},"\u0142":{"d":"202,-377r0,377r-126,0r0,-313r-74,37r0,-94r74,-37r0,-315r126,0r0,251r74,-37r0,94","w":278},"\u0152":{"d":"196,-436r0,150v0,132,38,174,142,174v89,0,112,-46,112,-130r0,-238v0,-84,-23,-130,-112,-130v-104,0,-142,42,-142,174xm342,-732v92,0,128,9,216,10r327,0r0,122r-297,0r0,166r223,0r0,122r-223,0r0,190r306,0r0,122r-413,0v-74,0,-98,10,-176,10v-149,0,-247,-105,-247,-283r0,-191v0,-182,116,-268,284,-268","w":944},"\u0153":{"d":"176,-380r0,216v0,42,30,64,74,64v44,0,74,-22,74,-64r0,-216v0,-42,-30,-64,-74,-64v-44,0,-74,22,-74,64xm728,-242r-278,0r0,72v0,54,36,78,78,78v53,0,74,-34,74,-76r126,0v-6,112,-73,178,-200,178v-62,0,-111,-30,-140,-72v-28,42,-75,72,-144,72v-120,0,-194,-62,-194,-206r0,-152v0,-144,74,-206,194,-206v69,0,116,30,144,72v29,-42,78,-72,146,-72v111,0,194,74,194,185r0,127xm450,-344r152,0v4,-64,-11,-109,-74,-108v-62,0,-84,42,-78,108","w":778},"\u0160":{"d":"491,-557r-124,36v-23,-68,-53,-97,-101,-97v-49,0,-76,30,-76,79v0,109,308,117,308,343v0,124,-85,206,-230,206v-112,0,-199,-61,-236,-203r136,-29v16,87,66,118,107,118v48,0,85,-32,85,-86v0,-136,-308,-138,-308,-340v0,-124,74,-202,217,-202v123,0,198,73,222,175xm341,-763r-126,0r-114,-146r113,0r64,82r64,-82r113,0","w":556},"\u0161":{"d":"404,-418r-104,40v-17,-50,-49,-74,-87,-74v-29,0,-51,21,-51,49v0,84,246,86,246,248v0,108,-76,165,-181,165v-76,0,-144,-19,-205,-155r113,-31v11,51,42,84,92,84v38,0,61,-18,61,-48v0,-104,-246,-79,-246,-262v0,-103,83,-152,172,-152v94,0,159,54,190,136xm285,-610r-126,0r-114,-146r113,0r64,82r64,-82r113,0","w":444},"\u0178":{"d":"159,-722r121,291r117,-291r147,0r-197,430r0,292r-138,0r0,-292r-197,-430r147,0xm123,-885r120,0r0,114r-120,0r0,-114xm313,-885r120,0r0,114r-120,0r0,-114","w":556},"\u017d":{"d":"61,-600r0,-122r400,0r0,116r-273,484r279,0r0,122r-434,0r0,-117r273,-483r-245,0xm313,-763r-126,0r-114,-146r113,0r64,82r64,-82r113,0"},"\u017e":{"d":"51,-434r0,-110r362,0r0,108r-231,326r231,0r0,110r-382,0r0,-108r227,-326r-207,0xm285,-610r-126,0r-114,-146r113,0r64,82r64,-82r113,0","w":444},"\u0192":{"d":"26,181r16,-103v60,23,99,19,117,-73r71,-371r-98,0r0,-88r119,0v35,-204,81,-278,195,-278v27,0,51,5,74,12r-18,100v-11,-5,-28,-10,-44,-10v-44,2,-66,44,-85,176r99,0r0,88r-116,0r-64,329v-22,112,-57,229,-193,229v-24,0,-50,-2,-73,-11","w":556},"\u02c6":{"d":"76,-756r126,0r114,146r-113,0r-64,-82r-64,82r-113,0","w":278},"\u02c7":{"d":"202,-610r-126,0r-114,-146r113,0r64,82r64,-82r113,0","w":278},"\u02c9":{"d":"313,-640r-348,0r0,-74r348,0r0,74","w":278},"\u02d8":{"d":"241,-754r66,0v-13,100,-76,146,-175,146v-95,0,-154,-49,-161,-146r64,0v6,56,55,70,104,70v53,0,92,-15,102,-70","w":278},"\u02d9":{"d":"79,-732r120,0r0,114r-120,0r0,-114","w":278},"\u02da":{"d":"138,-604v-59,0,-106,-48,-106,-107v0,-58,47,-107,106,-107v58,0,108,49,108,107v0,59,-50,107,-108,107xm138,-764v-30,0,-52,24,-52,53v0,30,22,53,52,53v29,0,54,-23,54,-53v0,-29,-25,-53,-54,-53","w":278},"\u02db":{"d":"258,-21r0,12v-53,20,-142,58,-142,125v0,33,24,52,53,52v32,0,70,-26,96,-43r20,34v-45,30,-95,59,-151,59v-57,0,-104,-31,-104,-91v0,-105,149,-135,228,-148","w":278},"\u02dc":{"d":"257,-744r65,0v-13,63,-39,121,-111,121v-54,0,-102,-35,-147,-35v-25,0,-40,19,-45,42r-63,0v10,-63,44,-122,115,-122v53,0,107,37,139,37v24,0,42,-19,47,-43","w":278},"\u02dd":{"d":"59,-756r151,0r-141,146r-97,0xm239,-756r155,0r-147,146r-101,0","w":278},"\u03a9":{"d":"177,-97r0,-3v-63,-60,-124,-162,-124,-294v0,-184,124,-332,302,-332v191,0,295,169,295,325v0,135,-62,243,-125,301r0,3r139,0r0,97r-258,0r0,-71v64,-43,125,-141,125,-304v0,-128,-61,-251,-177,-251v-110,0,-181,109,-181,255v0,150,60,259,124,300r0,71r-258,0r0,-97r138,0","w":706},"\u03bc":{"d":"314,-544r126,0r0,544r-122,0r0,-62v-43,37,-83,68,-132,72r0,182r-126,0r0,-736r126,0r0,400v0,36,12,60,46,60v26,0,55,-25,82,-49r0,-411"},"\u03c0":{"d":"571,-435r-72,0v3,133,-9,334,13,435r-114,0v-11,-21,-17,-71,-17,-145r0,-290r-145,0v-5,114,-30,328,-66,435r-115,0v35,-119,62,-318,64,-435v-50,0,-78,4,-99,11r-14,-80v25,-19,76,-32,160,-32r414,0","w":595},"\u2013":{"d":"500,-230r-500,0r0,-84r500,0r0,84"},"\u2014":{"d":"1000,-230r-1000,0r0,-84r1000,0r0,84","w":1000},"\u2018":{"d":"173,-732r-51,148r60,0r0,142r-142,0r0,-142r63,-148r70,0","w":222},"\u2019":{"d":"49,-432r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0","w":222},"\u201a":{"d":"49,148r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0","w":222},"\u201c":{"d":"173,-732r-51,148r60,0r0,142r-142,0r0,-142r63,-148r70,0xm395,-732r-51,148r60,0r0,142r-142,0r0,-142r63,-148r70,0","w":444},"\u201d":{"d":"49,-432r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0xm271,-432r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0","w":444},"\u201e":{"d":"49,148r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0xm271,148r51,-148r-60,0r0,-142r142,0r0,142r-63,148r-70,0","w":444},"\u2020":{"d":"66,-467r0,-96r162,27r-26,-196r96,0r-26,196r162,-27r0,96r-159,-27r25,170v-14,114,-22,268,-31,398r-38,0v-9,-130,-17,-284,-31,-398r25,-170"},"\u2021":{"d":"200,-329r25,-177r-159,27r0,-96r162,27r-26,-184r96,0r-26,184r162,-27r0,96r-159,-27r25,177r-25,177r159,-27r0,96r-162,-27r26,184r-96,0r26,-184r-162,27r0,-96r159,27"},"\u2022":{"d":"69,-361v0,-100,80,-180,180,-180v100,0,181,80,181,180v0,100,-81,181,-181,181v-100,0,-180,-81,-180,-181"},"\u2026":{"d":"238,0r-142,0r0,-142r142,0r0,142xm904,0r-142,0r0,-142r142,0r0,142xm571,0r-142,0r0,-142r142,0r0,142","w":1000},"\u2030":{"d":"162,-722v82,0,148,67,148,148v0,81,-66,148,-148,148v-82,0,-148,-67,-148,-148v0,-81,66,-148,148,-148xm162,-640v-38,0,-66,29,-66,66v0,37,28,66,66,66v38,0,66,-29,66,-66v0,-37,-28,-66,-66,-66xm477,-214v-38,0,-66,29,-66,66v0,37,28,66,66,66v38,0,66,-29,66,-66v0,-37,-28,-66,-66,-66xm477,-296v82,0,148,67,148,148v0,81,-66,148,-148,148v-82,0,-148,-67,-148,-148v0,-81,66,-148,148,-148xm838,-214v-38,0,-66,29,-66,66v0,37,28,66,66,66v38,0,66,-29,66,-66v0,-37,-28,-66,-66,-66xm838,-296v82,0,148,67,148,148v0,81,-66,148,-148,148v-82,0,-148,-67,-148,-148v0,-81,66,-148,148,-148xm76,10r408,-742r77,0r-408,742r-77,0","w":1000},"\u2039":{"d":"38,-272r122,-160r110,0r-122,160r122,160r-110,0","w":333},"\u203a":{"d":"295,-272r-122,160r-110,0r122,-160r-122,-160r110,0","w":333},"\u2044":{"d":"-167,10r405,-742r96,0r-405,742r-96,0","w":167},"\u20ac":{"d":"446,-391r-214,0r0,72r190,0r-28,88r-162,0v-2,79,39,127,116,127v59,0,106,-7,157,-41r0,118v-50,26,-114,35,-167,35v-150,0,-239,-91,-229,-239r-79,0r28,-88r51,0r0,-72r-79,0r28,-88r51,0r0,-48v0,-124,108,-205,242,-205v65,0,133,19,185,60r-36,113v-43,-39,-101,-59,-155,-59v-83,0,-120,60,-113,139r242,0","w":556},"\u2113":{"d":"440,-182r49,50v-51,100,-125,138,-203,138v-124,0,-175,-81,-179,-185r-53,43r-30,-64v30,-25,57,-46,82,-71r0,-263v0,-181,81,-256,175,-256v94,0,136,79,136,179v0,121,-77,238,-197,357r0,44v1,82,42,122,92,122v56,0,101,-48,128,-94xm220,-534r0,170v71,-83,123,-173,123,-251v0,-55,-15,-89,-57,-89v-32,0,-66,38,-66,170","w":507},"\u2122":{"d":"592,-722r94,250r93,-250r153,0r0,412r-106,0r0,-280r-2,0r-98,280r-81,0r-98,-280r-2,0r0,280r-106,0r0,-412r153,0xm373,-722r0,84r-115,0r0,328r-112,0r0,-328r-114,0r0,-84r341,0","w":1000},"\u2126":{"d":"177,-97r0,-3v-63,-60,-124,-162,-124,-294v0,-184,124,-332,302,-332v191,0,295,169,295,325v0,135,-62,243,-125,301r0,3r139,0r0,97r-258,0r0,-71v64,-43,125,-141,125,-304v0,-128,-61,-251,-177,-251v-110,0,-181,109,-181,255v0,150,60,259,124,300r0,71r-258,0r0,-97r138,0","w":706},"\u212e":{"d":"859,-351r-667,0v-4,0,-6,1,-6,5r0,202v0,9,3,16,9,23v65,67,154,110,252,110v107,0,201,-49,266,-123r59,0v-73,86,-193,143,-326,143v-227,0,-411,-165,-411,-369v0,-206,184,-372,411,-372v232,0,417,166,413,381xm707,-377r0,-203v0,-9,-3,-18,-9,-24v-65,-64,-153,-106,-251,-106v-97,0,-186,43,-251,109v-7,7,-10,15,-10,25r0,199v0,2,2,7,6,7r511,0v3,0,4,-5,4,-7","w":895},"\u2202":{"d":"104,-662r-34,-89v31,-25,88,-58,179,-58v143,0,271,127,271,388v0,255,-100,426,-277,426v-138,0,-204,-128,-204,-241v0,-164,98,-267,216,-267v82,0,133,56,148,83r2,0v9,-154,-59,-291,-171,-291v-60,0,-104,27,-130,49xm156,-232v0,78,38,138,100,138v78,0,127,-117,138,-224v-11,-34,-53,-89,-117,-89v-70,0,-121,83,-121,175","w":570},"\u2206":{"d":"28,0r0,-71r232,-660r139,0r226,658r0,73r-597,0xm148,-96r351,0r-114,-316v-16,-56,-47,-141,-58,-186r-4,0v-8,37,-33,115,-53,171","w":653},"\u220f":{"d":"691,-607r-102,0r0,706r-117,0r0,-706r-228,0r0,706r-116,0r0,-706r-103,0r0,-108r666,0r0,108","w":718},"\u2211":{"d":"537,99r-514,0r0,-77r247,-331r-237,-323r0,-83r487,0r0,101r-329,0r0,3r211,283r-234,313r0,3r369,0r0,111","w":557},"\u2212":{"d":"572,-211r-544,0r0,-122r544,0r0,122","w":600},"\u2215":{"d":"-167,10r405,-742r96,0r-405,742r-96,0","w":167},"\u2219":{"d":"139,-348v45,0,76,37,76,76v0,39,-31,76,-76,76v-45,0,-76,-37,-76,-76v0,-39,31,-76,76,-76","w":278},"\u221a":{"d":"596,-857r-224,1001r-95,0r-150,-453r-75,29r-19,-67r164,-66r108,333r20,87v4,-21,9,-57,16,-92r173,-772r82,0","w":591},"\u221e":{"d":"581,-461v88,0,155,66,155,166v0,108,-79,172,-161,172v-59,0,-113,-28,-181,-115v-53,64,-106,115,-188,115v-83,0,-157,-69,-157,-167v0,-101,71,-171,166,-171v75,0,130,47,182,113v44,-49,95,-114,184,-113xm117,-289v0,55,41,100,99,100v58,0,102,-53,141,-99v-42,-55,-79,-109,-146,-109v-59,0,-94,47,-94,108xm668,-290v0,-63,-38,-107,-95,-107v-62,0,-109,67,-142,103v62,76,95,105,147,105v58,0,90,-55,90,-101","w":785},"\u222b":{"d":"370,-870r-13,82v-29,-15,-65,-12,-86,17v-21,29,-28,86,-28,174v0,165,14,316,14,496v0,100,-17,165,-38,206v-37,72,-131,83,-199,53r16,-85v22,12,69,18,87,-10v16,-26,29,-68,29,-163v0,-183,-15,-336,-15,-508v0,-118,18,-182,59,-229v39,-44,118,-56,174,-33","w":393},"\u2248":{"d":"183,-457v87,0,127,74,196,74v39,0,63,-29,90,-73r43,38v-30,60,-76,103,-134,103v-41,0,-68,-12,-114,-40v-30,-18,-55,-34,-87,-34v-45,0,-70,36,-94,73r-44,-38v30,-60,83,-103,144,-103xm183,-272v90,1,123,74,196,74v39,0,63,-28,90,-73r43,39v-30,58,-76,103,-135,103v-40,0,-68,-14,-113,-41v-30,-19,-55,-35,-87,-35v-45,0,-70,37,-94,74r-44,-38v30,-60,83,-103,144,-103","w":553},"\u2260":{"d":"404,-520r-40,91r140,0r0,69r-166,0r-61,139r227,0r0,70r-253,0r-51,115r-54,-23r41,-92r-138,0r0,-70r164,0r61,-139r-225,0r0,-69r251,0r49,-113","w":553},"\u2264":{"d":"501,-101r-447,-227r0,-75r447,-226r0,82r-378,180r0,2r378,182r0,82xm505,8r-455,0r0,-70r455,0r0,70","w":553},"\u2265":{"d":"56,-629r447,227r0,74r-447,227r0,-82r377,-181r0,-2r-377,-181r0,-82xm504,8r-453,0r0,-70r453,0r0,70","w":553},"\u25ca":{"d":"539,-357r-199,406r-95,0r-194,-406r199,-406r95,0xm434,-354r-118,-251v-7,-19,-15,-43,-19,-61r-3,0v-5,19,-11,41,-20,61r-118,245r119,255v7,20,14,44,17,58r4,0v4,-15,13,-45,18,-57","w":589}}});



/////////////////////////////////////////////////
// JQUERY FORM PLUGIN
// TODO: IS THIS REALLY NECESSARY? IT'S JUST FOR AJAX COMMENT PLUGIN
////////////////////////////////////////////////////

/*!
* jQuery Form Plugin
* version: 2.43 (12-MAR-2010)
* @requires jQuery v1.3.2 or later
*
* Examples and documentation at: http://malsup.com/jquery/form/
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/
;(function($) {
 
/*
Usage Note:
-----------
Do not use both ajaxSubmit and ajaxForm on the same form. These
functions are intended to be exclusive. Use ajaxSubmit if you want
to bind your own submit handler to the form. For example,
 
$(document).ready(function() {
$('#myForm').bind('submit', function() {
$(this).ajaxSubmit({
target: '#output'
});
return false; // <-- important!
});
});
 
Use ajaxForm when you want the plugin to manage all the event binding
for you. For example,
 
$(document).ready(function() {
$('#myForm').ajaxForm({
target: '#output'
});
});
 
When using ajaxForm, the ajaxSubmit function will be invoked for you
at the appropriate time.
*/
 
/**
* ajaxSubmit() provides a mechanism for immediately submitting
* an HTML form using AJAX.
*/
$.fn.ajaxSubmit = function(options) {
// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
if (!this.length) {
log('ajaxSubmit: skipping submit process - no element selected');
return this;
}
 
if (typeof options == 'function')
options = { success: options };
 
var url = $.trim(this.attr('action'));
if (url) {
// clean url (don't include hash vaue)
url = (url.match(/^([^#]+)/)||[])[1];
    }
    url = url || window.location.href || '';
 
options = $.extend({
url: url,
type: this.attr('method') || 'GET',
iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
}, options || {});
 
// hook for manipulating the form data before it is extracted;
// convenient for use with rich editors like tinyMCE or FCKEditor
var veto = {};
this.trigger('form-pre-serialize', [this, options, veto]);
if (veto.veto) {
log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
return this;
}
 
// provide opportunity to alter form data before it is serialized
if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
log('ajaxSubmit: submit aborted via beforeSerialize callback');
return this;
}
 
var a = this.formToArray(options.semantic);
if (options.data) {
options.extraData = options.data;
for (var n in options.data) {
if(options.data[n] instanceof Array) {
for (var k in options.data[n])
a.push( { name: n, value: options.data[n][k] } );
}
else
a.push( { name: n, value: options.data[n] } );
}
}
 
// give pre-submit callback an opportunity to abort the submit
if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
log('ajaxSubmit: submit aborted via beforeSubmit callback');
return this;
}
 
// fire vetoable 'validate' event
this.trigger('form-submit-validate', [a, this, options, veto]);
if (veto.veto) {
log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
return this;
}
 
var q = $.param(a);
 
if (options.type.toUpperCase() == 'GET') {
options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
options.data = null; // data is null for 'get'
}
else
options.data = q; // data is the query string for 'post'
 
var $form = this, callbacks = [];
if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
if (options.clearForm) callbacks.push(function() { $form.clearForm(); });
 
// perform a load on the target only if dataType is not provided
if (!options.dataType && options.target) {
var oldSuccess = options.success || function(){};
callbacks.push(function(data) {
var fn = options.replaceTarget ? 'replaceWith' : 'html';
$(options.target)[fn](data).each(oldSuccess, arguments);
});
}
else if (options.success)
callbacks.push(options.success);
 
options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
for (var i=0, max=callbacks.length; i < max; i++)
callbacks[i].apply(options, [data, status, xhr || $form, $form]);
};
 
// are there files to upload?
var files = $('input:file', this).fieldValue();
var found = false;
for (var j=0; j < files.length; j++)
if (files[j])
found = true;
 
var multipart = false;
// var mp = 'multipart/form-data';
// multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);
 
// options.iframe allows user to force iframe mode
// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if ((files.length && options.iframe !== false) || options.iframe || found || multipart) {
// hack to fix Safari hang (thanks to Tim Molendijk for this)
// see: http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
if (options.closeKeepAlive)
$.get(options.closeKeepAlive, fileUpload);
else
fileUpload();
}
   else
$.ajax(options);
 
// fire 'notify' event
this.trigger('form-submit-notify', [this, options]);
return this;
 
 
// private function for handling file uploads (hat tip to YAHOO!)
function fileUpload() {
var form = $form[0];
 
if ($(':input[name=submit]', form).length) {
alert('Error: Form elements must not be named "submit".');
return;
}
 
var opts = $.extend({}, $.ajaxSettings, options);
var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);
 
var id = 'jqFormIO' + (new Date().getTime());
var $io = $('<iframe id="' + id + '" name="' + id + '" src="'+ opts.iframeSrc +'" onload="(jQuery(this).data(\'form-plugin-onload\'))()" />');
var io = $io[0];
 
$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
 
var xhr = { // mock object
aborted: 0,
responseText: null,
responseXML: null,
status: 0,
statusText: 'n/a',
getAllResponseHeaders: function() {},
getResponseHeader: function() {},
setRequestHeader: function() {},
abort: function() {
this.aborted = 1;
$io.attr('src', opts.iframeSrc); // abort op in progress
}
};
 
var g = opts.global;
// trigger ajax global events so that activity/block indicators work like normal
if (g && ! $.active++) $.event.trigger("ajaxStart");
if (g) $.event.trigger("ajaxSend", [xhr, opts]);
 
if (s.beforeSend && s.beforeSend(xhr, s) === false) {
s.global && $.active--;
return;
}
if (xhr.aborted)
return;
 
var cbInvoked = false;
var timedOut = 0;
 
// add submitting element to data if we know it
var sub = form.clk;
if (sub) {
var n = sub.name;
if (n && !sub.disabled) {
opts.extraData = opts.extraData || {};
opts.extraData[n] = sub.value;
if (sub.type == "image") {
opts.extraData[n+'.x'] = form.clk_x;
opts.extraData[n+'.y'] = form.clk_y;
}
}
}
 
// take a breath so that pending repaints get some cpu time before the upload starts
function doSubmit() {
// make sure form attrs are set
var t = $form.attr('target'), a = $form.attr('action');
 
// update form attrs in IE friendly way
form.setAttribute('target',id);
if (form.getAttribute('method') != 'POST')
form.setAttribute('method', 'POST');
if (form.getAttribute('action') != opts.url)
form.setAttribute('action', opts.url);
 
// ie borks in some cases when setting encoding
if (! opts.skipEncodingOverride) {
$form.attr({
encoding: 'multipart/form-data',
enctype: 'multipart/form-data'
});
}
 
// support timout
if (opts.timeout)
setTimeout(function() { timedOut = true; cb(); }, opts.timeout);
 
// add "extra" data to form if provided in options
var extraInputs = [];
try {
if (opts.extraData)
for (var n in opts.extraData)
extraInputs.push(
$('<input type="hidden" name="'+n+'" value="'+opts.extraData[n]+'" />')
.appendTo(form)[0]);
 
// add iframe to doc and submit the form
$io.appendTo('body');
$io.data('form-plugin-onload', cb);
form.submit();
}
finally {
// reset attrs and remove "extra" input elements
form.setAttribute('action',a);
t ? form.setAttribute('target', t) : $form.removeAttr('target');
$(extraInputs).remove();
}
};
 
if (opts.forceSync)
doSubmit();
else
setTimeout(doSubmit, 10); // this lets dom updates render
 
var domCheckCount = 100;
 
function cb() {
if (cbInvoked)
return;
 
var ok = true;
try {
if (timedOut) throw 'timeout';
// extract the server response from the iframe
var data, doc;
 
doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
 
var isXml = opts.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
log('isXml='+isXml);
if (!isXml && (doc.body == null || doc.body.innerHTML == '')) {
if (--domCheckCount) {
// in some browsers (Opera) the iframe DOM is not always traversable when
// the onload callback fires, so we loop a bit to accommodate
log('requeing onLoad callback, DOM not available');
setTimeout(cb, 250);
return;
}
log('Could not access iframe DOM after 100 tries.');
return;
}
 
log('response detected');
cbInvoked = true;
xhr.responseText = doc.body ? doc.body.innerHTML : null;
xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
xhr.getResponseHeader = function(header){
var headers = {'content-type': opts.dataType};
return headers[header];
};
 
if (opts.dataType == 'json' || opts.dataType == 'script') {
// see if user embedded response in textarea
var ta = doc.getElementsByTagName('textarea')[0];
if (ta)
xhr.responseText = ta.value;
else {
// account for browsers injecting pre around json response
var pre = doc.getElementsByTagName('pre')[0];
if (pre)
xhr.responseText = pre.innerHTML;
}
}
else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
xhr.responseXML = toXml(xhr.responseText);
}
data = $.httpData(xhr, opts.dataType);
}
catch(e){
log('error caught:',e);
ok = false;
xhr.error = e;
$.handleError(opts, xhr, 'error', e);
}
 
// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
if (ok) {
opts.success(data, 'success');
if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
}
if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
if (g && ! --$.active) $.event.trigger("ajaxStop");
if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');
 
// clean up
setTimeout(function() {
$io.removeData('form-plugin-onload');
$io.remove();
xhr.responseXML = null;
}, 100);
};
 
function toXml(s, doc) {
if (window.ActiveXObject) {
doc = new ActiveXObject('Microsoft.XMLDOM');
doc.async = 'false';
doc.loadXML(s);
}
else
doc = (new DOMParser()).parseFromString(s, 'text/xml');
return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
};
};
};
 
/**
* ajaxForm() provides a mechanism for fully automating form submission.
*
* The advantages of using this method instead of ajaxSubmit() are:
*
* 1: This method will include coordinates for <input type="image" /> elements (if the element
* is used to submit the form).
* 2. This method will include the submit element's name/value data (for the element that was
* used to submit the form).
* 3. This method binds the submit() method to the form for you.
*
* The options argument for ajaxForm works exactly as it does for ajaxSubmit. ajaxForm merely
* passes the options argument along after properly binding events for submit elements and
* the form itself.
*/
$.fn.ajaxForm = function(options) {
return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
e.preventDefault();
$(this).ajaxSubmit(options);
}).bind('click.form-plugin', function(e) {
var target = e.target;
var $el = $(target);
if (!($el.is(":submit,input:image"))) {
// is this a child element of the submit el? (ex: a span within a button)
var t = $el.closest(':submit');
if (t.length == 0)
return;
target = t[0];
}
var form = this;
form.clk = target;
if (target.type == 'image') {
if (e.offsetX != undefined) {
form.clk_x = e.offsetX;
form.clk_y = e.offsetY;
} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
var offset = $el.offset();
form.clk_x = e.pageX - offset.left;
form.clk_y = e.pageY - offset.top;
} else {
form.clk_x = e.pageX - target.offsetLeft;
form.clk_y = e.pageY - target.offsetTop;
}
}
// clear form vars
setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
});
};
 
// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
return this.unbind('submit.form-plugin click.form-plugin');
};
 
/**
* formToArray() gathers form element data into an array of objects that can
* be passed to any of the following ajax functions: $.get, $.post, or load.
* Each object in the array has both a 'name' and 'value' property. An example of
* an array for a simple login form might be:
*
* [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
*
* It is this array that is passed to pre-submit callback functions provided to the
* ajaxSubmit() and ajaxForm() methods.
*/
$.fn.formToArray = function(semantic) {
var a = [];
if (this.length == 0) return a;
 
var form = this[0];
var els = semantic ? form.getElementsByTagName('*') : form.elements;
if (!els) return a;
for(var i=0, max=els.length; i < max; i++) {
var el = els[i];
var n = el.name;
if (!n) continue;
 
if (semantic && form.clk && el.type == "image") {
// handle image inputs on the fly when semantic == true
if(!el.disabled && form.clk == el) {
a.push({name: n, value: $(el).val()});
a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
}
continue;
}
 
var v = $.fieldValue(el, true);
if (v && v.constructor == Array) {
for(var j=0, jmax=v.length; j < jmax; j++)
a.push({name: n, value: v[j]});
}
else if (v !== null && typeof v != 'undefined')
a.push({name: n, value: v});
}
 
if (!semantic && form.clk) {
// input type=='image' are not found in elements array! handle it here
var $input = $(form.clk), input = $input[0], n = input.name;
if (n && !input.disabled && input.type == 'image') {
a.push({name: n, value: $input.val()});
a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
}
}
return a;
};
 
/**
* Serializes form data into a 'submittable' string. This method will return a string
* in the format: name1=value1&amp;name2=value2
*/
$.fn.formSerialize = function(semantic) {
//hand off to jQuery.param for proper encoding
return $.param(this.formToArray(semantic));
};
 
/**
* Serializes all field elements in the jQuery object into a query string.
* This method will return a string in the format: name1=value1&amp;name2=value2
*/
$.fn.fieldSerialize = function(successful) {
var a = [];
this.each(function() {
var n = this.name;
if (!n) return;
var v = $.fieldValue(this, successful);
if (v && v.constructor == Array) {
for (var i=0,max=v.length; i < max; i++)
a.push({name: n, value: v[i]});
}
else if (v !== null && typeof v != 'undefined')
a.push({name: this.name, value: v});
});
//hand off to jQuery.param for proper encoding
return $.param(a);
};
 
/**
* Returns the value(s) of the element in the matched set. For example, consider the following form:
*
* <form><fieldset>
* <input name="A" type="text" />
* <input name="A" type="text" />
* <input name="B" type="checkbox" value="B1" />
* <input name="B" type="checkbox" value="B2"/>
* <input name="C" type="radio" value="C1" />
* <input name="C" type="radio" value="C2" />
* </fieldset></form>
*
* var v = $(':text').fieldValue();
* // if no values are entered into the text inputs
* v == ['','']
* // if values entered into the text inputs are 'foo' and 'bar'
* v == ['foo','bar']
*
* var v = $(':checkbox').fieldValue();
* // if neither checkbox is checked
* v === undefined
* // if both checkboxes are checked
* v == ['B1', 'B2']
*
* var v = $(':radio').fieldValue();
* // if neither radio is checked
* v === undefined
* // if first radio is checked
* v == ['C1']
*
* The successful argument controls whether or not the field element must be 'successful'
* (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
* The default value of the successful argument is true. If this value is false the value(s)
* for each element is returned.
*
* Note: This method *always* returns an array. If no valid value can be determined the
* array will be empty, otherwise it will contain one or more values.
*/
$.fn.fieldValue = function(successful) {
for (var val=[], i=0, max=this.length; i < max; i++) {
var el = this[i];
var v = $.fieldValue(el, successful);
if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
continue;
v.constructor == Array ? $.merge(val, v) : val.push(v);
}
return val;
};
 
/**
* Returns the value of the field element.
*/
$.fieldValue = function(el, successful) {
var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
if (typeof successful == 'undefined') successful = true;
 
if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
(t == 'checkbox' || t == 'radio') && !el.checked ||
(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
tag == 'select' && el.selectedIndex == -1))
return null;
 
if (tag == 'select') {
var index = el.selectedIndex;
if (index < 0) return null;
var a = [], ops = el.options;
var one = (t == 'select-one');
var max = (one ? index+1 : ops.length);
for(var i=(one ? index : 0); i < max; i++) {
var op = ops[i];
if (op.selected) {
var v = op.value;
if (!v) // extra pain for IE...
v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
if (one) return v;
a.push(v);
}
}
return a;
}
return el.value;
};
 
/**
* Clears the form data. Takes the following actions on the form's input fields:
* - input text fields will have their 'value' property set to the empty string
* - select elements will have their 'selectedIndex' property set to -1
* - checkbox and radio inputs will have their 'checked' property set to false
* - inputs of type submit, button, reset, and hidden will *not* be effected
* - button elements will *not* be effected
*/
$.fn.clearForm = function() {
return this.each(function() {
$('input,select,textarea', this).clearFields();
});
};
 
/**
* Clears the selected form elements.
*/
$.fn.clearFields = $.fn.clearInputs = function() {
return this.each(function() {
var t = this.type, tag = this.tagName.toLowerCase();
if (t == 'text' || t == 'password' || tag == 'textarea')
this.value = '';
else if (t == 'checkbox' || t == 'radio')
this.checked = false;
else if (tag == 'select')
this.selectedIndex = -1;
});
};
 
/**
* Resets the form data. Causes all form elements to be reset to their original value.
*/
$.fn.resetForm = function() {
return this.each(function() {
// guard against an input with the name of 'reset'
// note that IE reports the reset function as an 'object'
if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
this.reset();
});
};
 
/**
* Enables or disables any matching elements.
*/
$.fn.enable = function(b) {
if (b == undefined) b = true;
return this.each(function() {
this.disabled = !b;
});
};
 
/**
* Checks/unchecks any matching checkboxes or radio buttons and
* selects/deselects and matching option elements.
*/
$.fn.selected = function(select) {
if (select == undefined) select = true;
return this.each(function() {
var t = this.type;
if (t == 'checkbox' || t == 'radio')
this.checked = select;
else if (this.tagName.toLowerCase() == 'option') {
var $sel = $(this).parent('select');
if (select && $sel[0] && $sel[0].type == 'select-one') {
// deselect all other options
$sel.find('option').selected(false);
}
this.selected = select;
}
});
};
 
// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
if ($.fn.ajaxSubmit.debug) {
var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
if (window.console && window.console.log)
window.console.log(msg);
else if (window.opera && window.opera.postError)
window.opera.postError(msg);
}
};
 
})(jQuery);





//////////////////////////////////////////////////////
// BITS THAT I'VE MESSED WITH
/////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////
// READMORE RIGHT HERE PLUGIN - CUSTOMISED JS
// NOTE: MORE CUSTOMISATION IN /wp-content/plugins/read-more-right-here/
/////////////////////////////////////////////////////////////////// 

function rmrh()
{
	var 
		imgPath = "/wp-content/themes/kanec/images/loading.gif",
		LOADING_IMAGE =// GIF "loading" image 
			$(new Image()).attr('src', imgPath).css('margin-left', '10px');	
	

	$('a.more-link').each
	(
		function(index)
		{	
			anchorEl = $(this);
			setRedirectRequest(anchorEl);
		}
	);
	
	
	/**
	 *	Return the id of the post we want using the
	 *	'more' href value.
	 *	<br>
	 *	@param string href value of 'more' anchor element
	 *	@return string the target post id
	 */
	function getPostId(path)
	{
		var pos = path.lastIndexOf('-');
		return path.substr(++pos);
	}
	
	/**
	 *	Add our ajax request action to the 'click' event
	 *	of the 'more' anchor element.
	 *	<br>
	 *	@param Element the 'more' anchor element
	 */
	function setRedirectRequest(el)
	{
		var url = el.attr('href');
		el.bind('click', 
				{"el":el, "url":url, "postid":getPostId(url)}, 
			 	ajaxClick);
	}
	
	/**
	 *	The 'more' element's 'click' event handler
	 *	<br>
	 *	@param event data set as part of 
	 *		   <code>setRedirectRequest</code>
	 */
	function ajaxClick(event)
	{
		var 
			theEl = event.data.el,
			theImg = LOADING_IMAGE.clone();
		
		// append and display the loading image 
		// after the 'more' anchor element
		theEl.after(theImg);
		theImg.show();
		
		// perform the ajax request
		$.ajax
		({
			type: "POST",
			url: event.data.url,
			dataType: "html",
			cache: false,
			data: {'wt-rmrh-redirect':'1', 'postid':event.data.postid},
			error: function(request, textStatus, errorThrown)
			{
				data = "<b><font color=\"red\">Sorry! There was an error retrieving content.<br>Click again to be taken to this entry's page.</font></b>";
				ajaxFinished(theEl, theImg, data, true);
			},
			success: function(data, textStatus)
			{
				hideOthers();
				ajaxFinished(theEl, theImg, data, false);
			}

		});
		// keep anchor 'click' event propagating
		return false; 
	}
	
	/**
	 *	Handles the completion of our ajax request. If the
	 *	request resulted in an error, the 'more' anchor 
	 *	element will revert to its normal use (i.e. click
	 *	results in loading the post's single page display).
	 *	<br>
	 *	@param Element 'more' anchor element
	 *	@param Image loading image
	 *	@param String ajax request result data
	 *	@param boolean true if request resulted in error; 
	 *		   false otherwise 
	 */
	function ajaxFinished(theEl, theImg, result, bError)
	{
		var newEl = $('<div class="ajax">').html(result).hide(),
			tempFunc,
			funcObjToggle = 
				function()
				{
					newEl.find('object').each
					(
						function(){$(this).toggle();}
					);				
				},					
			funcArray = 
				new Array
				(
					function()
					{
						funcObjToggle();				
						newEl.slideToggle(1000, function()
								{ 
									theImg.fadeOut(500);						
								});						
					},
					function()
					{
						hideOthers();	
						newEl.slideToggle(1000, function()
								{ 
									theImg.fadeOut(500);
									funcObjToggle();
								});							
					}
				);
				
		theEl.unbind('click', ajaxClick);
		
		// If IE 7 and newer, and the new content has an 
		//	embedded object (e.g. flash video), we have 
		//	to just re-direct to the single page entry.
		//	The object will NOT display.
		if($.browser.msie && (parseInt($.browser.version) > 6))
		{
			if(hasEmbed(newEl))
			{
				window.location = theEl.attr('href');
				return;
			}
		}
		
		newEl.find('object').each
		(
				function()
				{
					$(this).hide();
				}
		);		
		
		// the loading gif is after the more link, so
		// put the new content after that image
		theImg.after(newEl);
		
		newEl.slideDown(1000, function()
				{ 
					theImg.fadeOut(500);			
					funcObjToggle();
				});		

		// if no error, 'more' link slides the content in and
		// out of view; otherwise future clicks behave normally
		// and take user to the single post page
		if(!bError)
		{
			theEl.click(function()
			{
				
				theEl.after(theImg);
				theImg.show();
				funcArray[0]();
				// Swap functions to execute. When 'collapse'
				//	want object to hide first. When expand want
				//	object to show last.
				tempFunc = funcArray[0];
				funcArray[0] = funcArray[1];
				funcArray[1] = tempFunc;
				// keep anchor 'click' event propagating
				return false;
			});
		}
		post_setup(); // add lightbox action etc to newly loaded content
		
	}
	
	function hasEmbed(el)
	{
		var result = false;
		el.find('object').each(
				function()
				{	
					result = true;
					console.log(this);
					return;
				});
		
		return result;
	}
	
	// SLIDE ALL THE OTHER BITS BACK IN
		
	function hideOthers()
	{
		$('.ajax').slideUp(1000);
	}
		
};

///////////////////////////////////////////////////////
// BORDER RADIUS PLUGIN FOR IE
///////////////////////////////////////////////////////

// border-radius
// Jonah Fox
// MIT Licensed
// Use like : $(".myClass").borderRadius() will attempt to apply curved corners as per the elements -moz-border-radius attribute
// Good:
// - supports textured forgrounds and backgrounds
// - maintains layouts
// - very easy to use
// - IE6 and IE7
// Bad:
// - not fluid. Reapply if the dimensions change
// - only supports rounding all corners
// - no hover
// - no Opera
 
;(function($){
 
  if($.browser.msie && document.namespaces["v"] == null) {
    document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    var ss = document.createStyleSheet().owningElement;
    ss.styleSheet.cssText = "v\\:*{behavior:url(#default#VML);}"
  }
 
  function RR(o) {
    var html = '<div class="ie_border_radius" style="position: absolute; left: 0px; top: 0px; z-index: -1; width:' + (o.width) + "px;height:" + (o.height) + 'px;">'
    html += '<v:roundrect arcsize="' + o.arcSize + '" strokecolor="' + o.strokeColor + '" strokeweight="' + o.strokeWeight + '" style="behavior: url(#default#VML); position:absolute; antialias: true; width:' + (o.width) + "px;height:" + (o.height) + 'px;' + "" + '" >';
    html += '<v:fill color="' + o.fillColor + '" src="' + o.fillSrc + '" type="tile" style="behavior: url(#default#VML);" />';
    html += '</v:roundrect>';
    html += "</div>"
      
return html;
  }
 
  $.fn.borderRadius = !$.browser.msie ? function() {} : function(options){
 
   var options = options || {}
   
      return this.each(function() {
        
        var opts = {}
        
if(this._border_radius_opts) {
     opts = this._border_radius_opts
     $(this).find(".ie_border_radius").remove();
     }
        else
        {
     opts.strokeColor = this.currentStyle.borderColor;
     opts.strokeWeight = this.currentStyle.borderWidth;
 
     opts.fillColor = this.currentStyle.backgroundColor;
     opts.fillSrc = this.currentStyle.backgroundImage.replace(/^url\("(.+)"\)$/, '$1');
 
     this.style.border = 'none'; // perhaps add onto padding?
     this.style.background = 'transparent';
     this._border_radius_opts = opts
     }
 
     opts.width = $(this).outerWidth()
     opts.height = $(this).outerHeight()
    
     var r = options.radius || parseInt( this.currentStyle['-ie-border-radius'] || this.currentStyle['-moz-border-radius'] || this.currentStyle['moz-border-radius'] );
 
     opts.arcSize = Math.min( r / Math.min(opts.width, opts.height), 1);
   
        this.innerHTML += RR(opts);
        
        if(this.currentStyle.position != "absolute")
          this.style.position = "relative";
          
     
        this.style.zoom = 1; // give it a layout
      });
    }
})(jQuery);




////////////////////////////////////////////////
// AJAX-COMMENT-POSTING PLUGIN (MODIFIED)
// http://wordpress.org/extend/plugins/ajax-comment-posting/
/////////////////////////////////////////////////

function ajax_comments(){
	

	// initialise
	var form, err, reply;
	function acp_initialise() {
	    $('#commentform').after('<div id="error"></div>');
	    $('#submit').after('<img src="/wp-content/themes/kanec/images/loading.gif" id="loading" alt="Loading" />');
	    $('#loading').hide();
	    form = $('#commentform');
	    err = $('#error');
	    reply = false;
	}
	acp_initialise();
	
	$('.comment-reply-link').live('click', function() {
		// checks if it's a reply to a comment
	        reply = $(this).parents('.depth-1').attr('id');
		err.empty();
	    });

	$('#cancel-comment-reply-link').live('click', function() {
		reply = false;
	    });	
	
        $('#commentform').live('submit', function(evt) {

		err.empty();
    
		if(form.find('#author')[0]) {
		    // if not logged in, validate name and email
		    if(form.find('#author').val() == '') {
			err.html('<span class="error">Please enter your name.</span>');
			return false;
		    }
		    if(form.find('#email').val() == '') {
			err.html('<span class="error">Please enter your email address.</span>');
			return false;
		    }
		    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    if(!filter.test(form.find('#email').val())) {
			err.html('<span class="error">Please enter a valid email address.</span>');
			if (evt.preventDefault) {evt.preventDefault();}
			return false;
		    }
		} // end if

		if(form.find('#comment').val() == '') {
		    err.html('<span class="error">Please enter your comment.</span>');
		    return false;
		}
	
		$(this).ajaxSubmit({
			
			beforeSubmit: function() {
			    $('#loading').show();
			    $('#submit').attr('disabled','disabled');
			}, // end beforeSubmit
		    
			    error: function(request){
			    err.empty();
			    var data = request.responseText.match(/<p>(.*)<\/p>/);
			    err.html('<span class="error">'+ data[1] +'</span>');
			    $('#loading').hide();
			    $('#submit').removeAttr("disabled");
			    return false;
			}, // end error()
		    
			    success: function(data) {
			    try {
				// if the comments is a reply, replace the parent comment's div with it
				// if not, append the new comment at the bottom
				//var response = $("<ol>").html(data);
				comment_response = data.split('<!-- BEGIN: COMMENTS -->');
				comment_response = comment_response[1].split('<!-- END: COMMENTS -->');
				var response = $("<ol>").html(comment_response[0]);
				if(reply != false) {
				    $('#'+reply).replaceWith(response.find('#'+reply));
				    $('.commentlist').after(response.find('#respond'));
				    acp_initialise();
				} else {				    
				    if ($(document).find('.commentlist')[0]) {
					response.find('.commentlist li:last').hide().appendTo($('.commentlist')).slideDown('slow');
				    } else {
					$('#respond').before(response.find('.commentlist'));
				    }
				    if ($(document).find('#comments')[0]) {
					$('#comments').replaceWith(response.find('#comments'));
				    } else {
					$('.commentlist').before(response.find('#comments'));
				    }
				}
				form.find('#comment').val('');
				err.html('<span class="success">Your comment has been added.</span>');
				$('#submit').removeAttr("disabled");
				$('#loading').hide();
				
			    } catch (e) {
				$('#loading').hide();
				$('#submit').removeAttr("disabled");
				alert('ACP error!\n\n'+e);
			    } // end try
						   
			} // end success()
			
		    }); // end ajaxSubmit()
		
		return false; 
		
	    }); // end form.submit()
}




/////////////////////////////////////////////////
// MAIN PAGE LOAD ACTIONS
/////////////////////////////////////////////////

// fonts 
Cufon.replace('h2');
$('.kbox').borderRadius();

function post_setup() { 
	// popup gallery
	//console.log("post_setup called");
	$('.gallery a').lightBox();
	ajax_comments();
};

$(document).ready(function() {

	// fading rollovers
	
	//$(".more-link").css('filter','none');
	
	if(jQuery.support.opacity == true) { 
		fade_bits = "#nav a, .more-link, .see_more";
	} else {
		fade_bits = "#nav a"; // only fade the nav if it's IE7 as it fucks up the rest too much
	}

	$(fade_bits).mouseover(function(){
		$(this).stop().fadeTo('fast', 0.5);
	}).mouseout(function(){
		$(this).stop().fadeTo('fast', 1);
	});
	
	// banner 'call to action' rollover
	
	$(".category-banner a").mouseover(function(){
		$(this).stop().animate({
			top: '-50px'
		}, 300);
	}).mouseout(function(){
		$(this).stop().animate({
			top: '-40px'
		}, 300);
	});
	
	$("h3 a:contains('subscribe')").addClass('rss');
	
	post_setup(); // lightbox
	rmrh(); // ajax post loading
	
	// trigger more link (ajax post loading) on image click too
	$(".post .entry").each(function(){
		$('img',this).first().css('cursor','pointer').click(function(){ //the first image from a post
			//console.log("click");
			$(this).parents('.entry').find('.more-link').trigger('click');
		})
		//$(this)
		//$(".post-30 .more-link").trigger('click');
	})
	
	
	// fade nav menu sequentially on load to entice user to click it!
	$('#nav a').each(function(i){
		$(this).delay(i*100).fadeTo(300, 0.4).fadeTo(300,1).css('filter','none');
		//$(this).delay(i*100).animate({marginTop: "5px"},300).animate({marginTop: "0px"},300);
	})

});