=== Retailers Management for WooCommerce ===
Contributors: flexatech
Tags: woocommerce, retailers, stores, dealers, product retailers
Requires at least: 4.7
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Easily manage retailers, assign them to WooCommerce products, and display retailer information directly on product pages.

== Description ==

**Retailers Management for WooCommerce** helps you manage a network of retailers or dealers and associate them with WooCommerce products.

With this plugin, you can:

* Create and manage retailers as a custom post type
* Assign retailers to WooCommerce products
* Display retailer information on product pages
* Store detailed retailer data such as logo, phone, email, address, and location
* Filter retailers by status and type
* Manage retailers directly from the WordPress admin

This plugin is designed to be lightweight, secure, and fully compatible with WooCommerce.

**Source code for compiled JavaScript and CSS**

The plugin ships with minified/compiled JavaScript and CSS in `assets/dist/`. The human-readable source code for these assets is **publicly available** and maintained at:

**https://github.com/flexatech/retailers-management-for-woocommerce**

Source lives in the `apps/admin` (admin UI) and `apps/frontend` (product page UI) directories. Build tools used: **pnpm**, **Vite**, **React**, **TypeScript**. To build from source: clone the repository, run `pnpm install` from the plugin root, then build the admin and frontend apps (see the repository README for exact commands). This allows the code to be reviewed, studied, and forked.

**Third-Party Services:**
This plugin uses the OpenStreetMap Nominatim API for address geocoding. The service is free and provided by the OpenStreetMap Foundation. Address searches are rate-limited and only occur when you actively use the address autocomplete feature in the admin panel. For details about OpenStreetMap's usage policy, visit: https://operations.osmfoundation.org/policies/nominatim/

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/retailers-management-for-woocommerce` directory, or install the plugin through the WordPress Plugins screen.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Make sure WooCommerce is installed and activated.

== Development / Build ==

The compiled production assets in this plugin are in `assets/dist/`. They are built from human-readable source (React/TypeScript/Vite) in the repository above. To rebuild:

1. Clone the repository: `git clone https://github.com/flexatech/retailers-management-for-woocommerce.git`
2. From the plugin root: `pnpm install`
3. Build admin UI: `cd apps/admin && pnpm build`
4. Build frontend UI: `cd apps/frontend && pnpm build`

Output goes to `assets/dist/admin` and `assets/dist/frontend`. For full details and scripts, see the repository README.

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =
Yes. WooCommerce must be installed and activated for this plugin to work.

= Will my data be deleted if I deactivate the plugin? =
No. Deactivating the plugin will not remove any data.

= Is this plugin compatible with PHP 8? =
Yes. The plugin is compatible with PHP 8.0 and newer versions.

= Does this plugin use any third-party services? =
Yes. This plugin uses the OpenStreetMap Nominatim API for address autocomplete functionality when adding retailer locations. The service is provided free of charge by the OpenStreetMap Foundation. For more information about their usage policy, please visit: https://operations.osmfoundation.org/policies/nominatim/

= What data is sent to OpenStreetMap? =
When you use the address autocomplete feature in the retailer form, only the address search query text you type is sent to OpenStreetMap's Nominatim API. No personal information, retailer data, or other sensitive information is transmitted. The plugin respects OpenStreetMap's usage policy with:
* Proper rate limiting (1-second debounce delay)
* User-Agent header identification
* Only user-triggered requests (no automated queries)

= How does the OpenStreetMap integration work? =
The plugin uses OpenStreetMap's Nominatim geocoding service to help you find and select addresses when creating or editing retailers. When you type an address in the retailer form, the plugin sends a search query to Nominatim and displays matching address suggestions. This feature is optional and only works when you actively use the address autocomplete field in the WordPress admin panel.

== Screenshots ==

1. Retailers management screen in the WordPress admin
2. Assigning retailers to WooCommerce products
3. Retailer information displayed on the product page

== Changelog ==

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

= 1.0.0 =
Initial release.
