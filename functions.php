<?php
/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage frames
 * @since Frames 1.0
 */


if ( ! function_exists( 'get_theme_version' ) ) {
    /**
     * Returns the theme version.
     *
     * @since Frames 1.0
     *
     * @return string
     */
    function get_theme_version() {
        return wp_get_theme()->get( 'Version' );
    }

}

if ( ! function_exists( 'frames_setup' ) ) {
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     *
     * Note that this function is hooked into the after_setup_theme hook, which
     * runs before the init hook. The init hook is too late for some features, such
     * as indicating support for post thumbnails.
     *
     * @since Frames 1.0
     *
     * @return void
     */
    function frames_setup() {
        /*
         * Make theme available for translation.
         * Translations can be filed in the /languages/ directory.
         * If you're building a theme based on Twenty Twenty-One, use a find and replace
         * to change 'frames' to the name of your theme in all the template files.
         */
        load_theme_textdomain( 'frames', get_template_directory() . '/languages' );

        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        /*
         * Let WordPress manage the document title.
         * This theme does not use a hard-coded <title> tag in the document head,
         * WordPress will provide it for us.
         */
        add_theme_support( 'title-tag' );

        /**
         * Add post-formats support.
         */
        add_theme_support(
            'post-formats',
            array(
                'link',
                'aside',
                'gallery',
                'image',
                'quote',
                'status',
                'video',
                'audio',
                'chat',
            )
        );

        /*
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support( 'post-thumbnails' );
        set_post_thumbnail_size( 1568, 9999 );

        register_nav_menus(
            array(
                'primary' => esc_html__( 'Primary menu', 'frames' ),
                'footer'  => __( 'Secondary menu', 'frames' ),
            )
        );

        /*
         * Switch default core markup for search form, comment form, and comments
         * to output valid HTML5.
         */
        add_theme_support(
            'html5',
            array(
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
                'style',
                'script',
                'navigation-widgets',
            )
        );

        /**
         * Add support for core custom logo.
         *
         * @link https://codex.wordpress.org/Theme_Logo
         */
        $logo_width  = 300;
        $logo_height = 100;

        add_theme_support(
            'custom-logo',
            array(
                'height'               => $logo_height,
                'width'                => $logo_width,
                'flex-width'           => true,
                'flex-height'          => true,
                'unlink-homepage-logo' => true,
            )
        );

        // Add theme support for selective refresh for widgets.
        add_theme_support( 'customize-selective-refresh-widgets' );

        // Add support for Block Styles.
        add_theme_support( 'wp-block-styles' );

        // Add support for full and wide align images.
        add_theme_support( 'align-wide' );

        // Add support for responsive embedded content.
        add_theme_support( 'responsive-embeds' );

        // Add support for custom line height controls.
        add_theme_support( 'custom-line-height' );

        // Add support for experimental link color control.
        add_theme_support( 'experimental-link-color' );

        // Add support for custom units.
        add_theme_support( 'custom-units' );

        // Add support for experimental cover block spacing.
        add_theme_support( 'custom-spacing' );

        // Add support for editor styles.
        add_theme_support( 'editor-styles' );

        add_editor_style(array('/style.css'));
    }
}
add_action( 'after_setup_theme', 'frames_setup' );

/**
 * Enqueue scripts and styles.
 *
 * @since frames 1.0
 *
 * @return void
 */
function frames_scripts() {

	wp_enqueue_style( 'frames', get_stylesheet_uri(), array(), get_theme_version() );
	wp_enqueue_script( 'frames', get_template_directory_uri().'/dist/js/theme/frames.min.js', array(), get_theme_version(), true );
	wp_enqueue_script( 'scroll-timeline', get_template_directory_uri().'/static/scroll-timeline.min.js', array(), get_theme_version(), false );
}
add_action( 'wp_enqueue_scripts', 'frames_scripts' );

function frames_block_editor_enqueue_scripts() {

    if(!file_exists(get_template_directory().'/dist/js/block-library/index.asset.php')) return;

	$assets = require_once('dist/js/block-library/index.asset.php');

	// Enqueue the block index.js file
	wp_enqueue_script(
		'frames-block-filters', // unique handle
		get_template_directory_uri() . '/dist/js/block-library/index.js',
		$assets['dependencies'], // required dependencies for blocks
		$assets['version']
	);

}
add_action( 'enqueue_block_editor_assets', 'frames_block_editor_enqueue_scripts' );


function frames_category_title( $title ) {
    if (is_category()) {
        $title = single_cat_title('', false);
    } elseif (is_tag()) {
        $title = single_tag_title('', false);
    } elseif (is_author()) {
        $title = '<span>' . get_the_author() . '</span>';
    } elseif (is_tax()) { //for custom post types
        $title = sprintf(__('%1$s'), single_term_title('', false));
    } elseif (is_post_type_archive()) {
        $title = post_type_archive_title('', false);
    }
    return $title;
}
add_filter( 'get_the_archive_title', 'frames_category_title' );


function frames_critical_css() {
    ?>
    <style>
        /* Makes sticky headers transparent when the window hasn't been scrolled. It's only set when the container of the #wp-site-header template is the header tag AND has position sticky.  */
        header.has-background.is-position-sticky {
            opacity: 0;
            transition: none !important;
        }

        [animation] {
            --frames--transition-properties: all;
            --frames--transition-duration: 350ms;
            --frames--transition-timing-function: ease-out;
            --frames--transition-delay: 0s;
            --frames--transition-stagger: 1;
            transition: var(--frames--transition-properties) var(--frames--transition-duration) var(--frames--transition-timing-function) var(--frames--transition-delay);
        }

        [animation]:not(.animated) {
            opacity: 0;
        }

        [animation="scale-up"]:not(.animated) {
            transform: scale(0.8);
        }

        [animation="scale-up"]:not(.animated) {
            transform: scale(0.8);
        }

        [animation="slide-up"]:not(.animated) {
            transform: translateY(25%);
        }

        [animation="slide-down"]:not(.animated) {
            transform: translateY(-25%);
        }

        [animation="slide-left"]:not(.animated) {
            transform: translateX(25%);
        }

        [animation="slide-right"]:not(.animated) {
            transform: translateX(-25%);
        }

        .wp-block-cover.has-parallax[animation]:not(.animated) .wp-block-cover__image-background {
            opacity: 0;
        }


        .wp-block-cover.has-parallax.animated .wp-block-cover__image-background {
            --frames--transition-properties: all;
            --frames--transition-duration: 300ms;
            --frames--transition-delay: calc(var(--frames--transition-duration) * 2);
            transition: var(--frames--transition-properties) var(--frames--transition-duration) var(--frames--transition-timing-function) var(--frames--transition-delay);
        }

        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slide-left {
            from {
                transform: translateX(25%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        [animation="scroll-driven"].animated {
            animation: auto linear both;
            animation-name: slide-left;
            animation-timeline: scroll(root block);
        }

        .animated .animated {
            --frames--transition-delay: calc(var(--frames--transition-duration) * var(--frames--transition-stagger));
        }

        .animated .animated .animated {
            --frames--transition-stagger: 1.3;
        }

        .animated .animated .animated {
            --frames--transition-stagger: 1.6;
        }

        .animated .animated .animated .animated {
            --frames--transition-stagger: 2;
        }

        .animated .animated .animated .animated {
            --frames--transition-stagger: 2.3;
        }

        @media (prefers-reduced-motion) {
            .wp-site-blocks .animated {
                --frames--transition-duration: 0s;
            }
        }

        .wp-block-image figcaption {
            position: absolute;
            bottom: 0;
            padding: 1rem;
            margin: 1rem 1.5rem;
            border: 1px solid;
            color: white;
            border-radius: 7px;
        }

        .wp-block-image {
            position: relative;
        }

        .custom-logo-link {
            display: block;
        }

        @keyframes scroll-parallax {
            from { transform: translateY(-10%); }
            to { transform: translateY(10%); }
        }

        .wp-block-cover__image-background.has-parallax {
            transform-origin: 0 50%;
            transition: none !important;
            animation: scroll-parallax auto linear;
            animation-duration: 1ms;
            animation-timeline: view();
            backface-visibility: hidden;
            transform: translateY(-20%);
            width: auto;
            max-width: none;
            min-height: 130% !important;
            background-size: cover;
            top: -10%;
        }

        @media screen and (max-width: 768px) {

            .wp-block-cover__image-background.has-parallax {
                background-size: auto 120% !important;
            }

            .wp-block-cover__image-background.has-parallax .wp-block-cover {
                position: relative;
            }
        }


        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slide-left {
            from {
                transform: translateX(25%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        [animation="scroll-driven"].animated {
            animation: auto linear both;
            animation-name: slide-left;
            animation-timeline: scroll(root block);
        }
    </style>

    <?php
}

add_action('wp_head', 'frames_critical_css', 1);

function frames_unlazy_featured_image( $filtered_image, $context, $attachment_id ) {
    if(!str_contains($filtered_image, 'wp-post-image')) return $filtered_image;
    return str_replace(' loading="lazy"', '', $filtered_image);
}

add_filter( 'wp_content_img_tag', 'frames_unlazy_featured_image', 99999, 3 );
