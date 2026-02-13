=== Retailers Management for WooCommerce ===
Contributors: FlexaTech
Tags: woocommerce, retailers, stores, dealers, product retailers
Requires at least: 4.7
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.5
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Easily manage retailers, assign them to WooCommerce products, and display retailer information directly on product pages.

== Description ==

**Retailers Management for WooCommerce** helps you manage a network of retailers or dealers and associate them with WooCommerce products.

With this plugin, you can:

* Create and manage retailers as a custom post type
* Assign retailers to WooCommerce products
* Display retailer information on product pages
* Store detailed retailer data such as logo, phone, email, and address
* Filter retailers by status and type
* Manage retailers directly from the WordPress admin

This plugin is designed to be lightweight, secure, and fully compatible with WooCommerce.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/retailers-management-for-woocommerce` directory, or install the plugin through the WordPress Plugins screen.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Make sure WooCommerce is installed and activated.

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =
Yes. WooCommerce must be installed and activated for this plugin to work.

= Will my data be deleted if I deactivate the plugin? =
No. Deactivating the plugin will not remove any data.

= Is this plugin compatible with PHP 8? =
Yes. The plugin is compatible with PHP 8.0 and newer versions.

= Does this plugin use any third-party services? =
No. This plugin does not send data to external services.

== Screenshots ==

1. Retailers management screen in the WordPress admin
2. Assigning retailers to WooCommerce products
3. Retailer information displayed on the product page
4. Add/Edit retailer in admin page
5. Manage retailer type
6. Live preview in admin

== Changelog ==

= 1.0.5 =
* Fix: Do not display the number of products per retailer in the admin panel.

= 1.0.4 =
* Removed: OpenStreetMap address autocomplete and map position display in admin; address is now a plain text field

= 1.0.3 =
* Clean up: Removed Dashboard menu and page from admin
* Clean up: Removed Modal Popup, Store Locator, and Card Grid display modes (admin and frontend); only Classic List is supported
* Clean up: Default display mode is list when none is set; settings merged with defaults for consistent behavior
* Clean up: Excluded hidden files from plugin zip (WordPress.org compatibility)
* Clean up: Added translators comment for placeholder in admin notice (I18n compliance)

= 1.0.2 =
* Fixed: Correct Contributors
* Fixed: Missing permission_callback in REST API Route

= 1.0.1 =
* Security: Added comprehensive input sanitization for all REST API endpoints
* Security: Fixed settings and product retailers data sanitization
* Security: Improved output escaping throughout the plugin
* Removed: All Pro version code and upgrade prompts
* Removed: Click tracking functionality
* Added: Requires Plugins header for WooCommerce dependency
* Added: Comprehensive OpenStreetMap API documentation
* Fixed: Domain Path header now points to existing languages directory
* Fixed: Development mode constant removed from production code
* Improved: Code compliance with WordPress Plugin Guidelines

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.5 =
Code cleanup release: Dashboard and unused display modes removed; only Classic List display is used.

= 1.0.0 =
Initial release.
