<?php
namespace RetailersManagement\Engine;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Controllers\RetailerTypeRestController;
use RetailersManagement\Controllers\RetailersRestController;
use RetailersManagement\Controllers\ProductRetailersRestController;
use RetailersManagement\Controllers\SettingsRestController;

defined( 'ABSPATH' ) || exit;

/**
 * Class RestAPI
 *
 * Handles Retailers Management REST API endpoints.
 */
class RestAPI {
    use SingletonTrait;

    protected function __construct() {
        add_action( 'rest_api_init', [ $this, 'retailers_management_endpoints' ] );
    }

    public function retailers_management_endpoints() {
        RetailerTypeRestController::get_instance();
        RetailersRestController::get_instance();
        ProductRetailersRestController::get_instance();
        SettingsRestController::get_instance();
    }
}
