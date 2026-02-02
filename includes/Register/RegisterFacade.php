<?php
namespace RetailersManagement\Register;

defined( 'ABSPATH' ) || exit;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Register\ScriptName;

/**
 * Register Facade.
 *
 * @method static RegisterFacade get_instance()
 */
class RegisterFacade {
    use SingletonTrait;

    /** Hooks Initialization */
    protected function __construct() {
        add_filter( 'script_loader_tag', [ $this, 'add_entry_as_module' ], 10, 3 );
        add_action( 'init', [ $this, 'register_all_assets' ] );
        add_filter( 'pre_load_script_translations', [ $this, 'use_mo_file_for_script_translations' ], 10, 4 );

        $is_prod = ! defined( 'FLEXA_RETAILERS_MANAGEMENT_IS_DEVELOPMENT' ) || FLEXA_RETAILERS_MANAGEMENT_IS_DEVELOPMENT !== true;
        if ( $is_prod && class_exists( '\RetailersManagement\Register\RegisterProd' ) ) {
            \RetailersManagement\Register\RegisterProd::get_instance();
        } elseif ( ! $is_prod && class_exists( '\RetailersManagement\Register\RegisterDev' ) ) {
            \RetailersManagement\Register\RegisterDev::get_instance();
        }
    }

    public function add_entry_as_module( $tag, $handle ) {
        if ( strpos( $handle, ScriptName::MODULE_PREFIX ) !== false ) {
            if ( strpos( $tag, 'type="' ) !== false ) {
                return preg_replace( '/\stype="\S+\s/', ' type="module" ', $tag, 1 );
            } else {
                return str_replace( ' src=', ' type="module" src=', $tag );
            }
        }
        return $tag;
    }

    public function register_all_assets() {
        wp_register_style(
            ScriptName::STYLE_SETTINGS,
            FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/dist/admin/style.css',
            [
                'woocommerce_admin_styles',
                'wp-components',
            ],
            FLEXA_RETAILERS_MANAGEMENT_VERSION
        );

        wp_register_style(
            ScriptName::STYLE_PRODUCT_RETAILERS_FRONTEND,
            FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/dist/frontend/style.css',
            [],
            FLEXA_RETAILERS_MANAGEMENT_VERSION
        );
    }

    /**
     * RetailersManagement Scripts translations is all in MO file.
     *
     * @param string $json_translations
     * @param string $file
     * @param string $handle
     * @param string $domain
     */
    public function use_mo_file_for_script_translations( $json_translations, $file, $handle, $domain ) {
        $all_handles = [
            ScriptName::PAGE_SETTINGS,
        ];

        if ( 'retailers-management-for-woocommerce' !== $domain || ! in_array( $handle, $all_handles, true ) ) {
            return $json_translations;
        }

        $translations = get_translations_for_domain( 'retailers-management-for-woocommerce' );
        $messages     = [
            '' => [
                'domain' => 'messages',
            ],
        ];
        $entries      = $translations->entries;
        foreach ( $entries as $key => $entry ) {
            $messages[ $entry->singular ] = $entry->translations;
        }

        return wp_json_encode(
            [
                'domain'      => 'messages',
                'locale_data' => [
                    'messages' => $messages,
                ],
            ]
        );
    }
}
