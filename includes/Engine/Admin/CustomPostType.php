<?php
namespace RetailersManagement\Engine\Admin;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Helpers\RetailerHelper;


defined( 'ABSPATH' ) || exit;
/**
 * Custom Post Type
 */
class CustomPostType {
    use SingletonTrait;

    protected function __construct() {
        // Register Custom Post Type
        add_action( 'init', [ $this, 'register_retailer_post_type' ] );
    }

    public function register_retailer_post_type() {

        register_post_type(
            RetailerHelper::RETAILER_POST_TYPE,
            [
                'labels'          => [
                    'name'          => __( 'Retailers', 'retailers-management-for-woocommerce' ),
                    'singular_name' => __( 'Retailer', 'retailers-management-for-woocommerce' ),
                    'add_new'       => __( 'Add Retailer', 'retailers-management-for-woocommerce' ),
                    'add_new_item'  => __( 'Add New Retailer', 'retailers-management-for-woocommerce' ),
                    'edit_item'     => __( 'Edit Retailer', 'retailers-management-for-woocommerce' ),
                    'new_item'      => __( 'New Retailer', 'retailers-management-for-woocommerce' ),
                    'view_item'     => __( 'View Retailer', 'retailers-management-for-woocommerce' ),
                    'search_items'  => __( 'Search Retailers', 'retailers-management-for-woocommerce' ),
                ],
                // Retailers are managed exclusively through this plugin's own
                // manage_options-gated REST routes and admin app. Keep the post
                // type internal so it is NOT exposed/editable via core wp/v2 or
                // the classic post UI (which would let edit_posts-level users
                // bypass the manage_options gate).
                'public'              => false,
                'publicly_queryable'  => false,
                'exclude_from_search' => true,
                'has_archive'         => false,
                'rewrite'             => false,
                'show_in_rest'        => false,
                'menu_icon'           => 'dashicons-store',
                'supports'            => [
                    'title',
                    'editor',
                    'thumbnail',
                    'excerpt',
                ],
                // Writes require manage_options; reads stay public so the
                // front-end product display can render published retailers.
                //
                // Only PRIMITIVE caps are remapped here. The meta caps
                // edit_post/delete_post/read_post must NOT be set to
                // manage_options: with map_meta_cap => true, WordPress registers
                // their values in the global $post_type_meta_caps, which would
                // turn manage_options itself into a meta cap and make every
                // current_user_can( 'manage_options' ) resolve to do_not_allow
                // site-wide. WP maps the meta caps to these primitives for us.
                'capability_type'     => 'post',
                'map_meta_cap'        => true,
                'capabilities'        => [
                    'edit_posts'             => 'manage_options',
                    'edit_others_posts'      => 'manage_options',
                    'edit_published_posts'   => 'manage_options',
                    'publish_posts'          => 'manage_options',
                    'delete_posts'           => 'manage_options',
                    'delete_others_posts'    => 'manage_options',
                    'delete_published_posts' => 'manage_options',
                    'create_posts'           => 'manage_options',
                ],
                'show_ui'             => false,
                'show_in_menu'        => false,
            ]
        );
    }
}
