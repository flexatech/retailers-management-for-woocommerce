<?php
namespace RetailersManagement\Engine\Admin;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Register\ScriptName;
use RetailersManagement\Helpers\Helper;


defined( 'ABSPATH' ) || exit;
/**
 * Settings Page
 */
class Settings {
    use SingletonTrait;

    protected function __construct() {
        add_filter( 'admin_body_class', [ $this, 'admin_body_class' ] );

        // Register Custom Post Type

        add_action( 'admin_menu', [ $this, 'admin_menu' ] );

        add_filter( 'plugin_action_links_' . FLEXA_RETAILERS_MANAGEMENT_BASE_NAME, [ $this, 'add_action_links' ] );

        add_filter( 'plugin_row_meta', [ $this, 'add_document_support_links' ], 10, 2 );

        add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );

        add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_admin_styles' ] );
    }

    public function admin_body_class( $classes ) {
        if ( strpos( $classes, 'flexa-retailers-ui' ) === false ) {
            $classes .= ' flexa-retailers-ui';
        }
        return $classes;
    }

    public function add_action_links( $links ) {
        $links = array_merge(
            [
                '<a href="' . esc_url( admin_url( '/admin.php?page=retailers-management-for-woocommerce' ) ) . '">' . esc_html__( 'Settings', 'retailers-management-for-woocommerce' ) . '</a>',
            ],
            $links
        );

        return $links;
    }

    public function add_document_support_links( $links, $file ) {
        if ( strpos( $file, FLEXA_RETAILERS_MANAGEMENT_BASE_NAME ) !== false ) {
            $doc_url    = esc_url( 'https://flexa.com/support/' );
            $new_links  = [
                'doc'     => '<a href="' . $doc_url . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Docs', 'retailers-management-for-woocommerce' ) . '</a>',
                'support' => '<a href="' . $doc_url . '" target="_blank" rel="noopener noreferrer" aria-label="' . esc_attr__( 'Visit community forums', 'retailers-management-for-woocommerce' ) . '">' . esc_html__( 'Support', 'retailers-management-for-woocommerce' ) . '</a>',
            ];
            $links     = array_merge( $links, $new_links );
        }
        return $links;
    }

    public function admin_menu() {
        $page_title = __( 'Retailers', 'retailers-management-for-woocommerce' );
        $menu_title = __( 'Retailers', 'retailers-management-for-woocommerce' );
        add_menu_page(
            $page_title,
            $menu_title,
            'manage_options',
            'retailers-management-for-woocommerce',
            [ $this, 'submenu_page_callback' ],
            'dashicons-store',
            60
        );
    }

    public function submenu_page_callback() {
        echo wp_kses(
            '<div id="retailers-management-for-woocommerce"></div>',
            [
                'div' => [
                    'id' => true,
                ],
            ]
        );
    }

    public function admin_enqueue_scripts( $hook_suffix ) {

        $allow_hook_suffixes = [ 'toplevel_page_retailers-management-for-woocommerce' ];

        if ( ! in_array( $hook_suffix, $allow_hook_suffixes, true ) ) {
            return;
        }

        wp_localize_script( ScriptName::PAGE_SETTINGS, 'retailersManagement', Helper::get_js_config() );
        wp_enqueue_media();
        wp_enqueue_script( ScriptName::PAGE_SETTINGS );
        wp_enqueue_style( ScriptName::STYLE_SETTINGS );
    }

    public function admin_enqueue_admin_styles() {
        wp_enqueue_style( 'retailers-management-admin-styles', FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/css/admin-styles.css', [], FLEXA_RETAILERS_MANAGEMENT_VERSION );
    }
}
