<?php
namespace RetailersManagement;

use RetailersManagement\Utils\SingletonTrait;

/**
 * RetailersManagement Plugin Initializer
 */
class Initialize {

    use SingletonTrait;

    /**
     * The Constructor that load the engine classes
     */
    protected function __construct() {
        \RetailersManagement\Engine\Admin\Settings::get_instance();
        \RetailersManagement\Engine\Admin\CustomPostType::get_instance();
        \RetailersManagement\Engine\Admin\CustomTaxonomy::get_instance();
        \RetailersManagement\Engine\Admin\ProductRetailersTab::get_instance();
        \RetailersManagement\Engine\Frontend\ProductRetailers::get_instance();
        \RetailersManagement\Register\RegisterFacade::get_instance();
        \RetailersManagement\Engine\RestAPI::get_instance();
    }
}
