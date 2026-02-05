<?php
namespace RetailersManagement\Helpers;

/**
 * Product Retailers Helper Class
 */
class ProductRetailersHelper {

    public const PRODUCT_RETAILERS_META_KEY = 'rmfw_product_retailers';

    /** Allowed stock status values for product retailers. */
    public const ALLOWED_STOCK_STATUSES = [ 'in-stock', 'check-availability', 'out-of-stock' ];

    protected function __construct() {}

    /**
     * Sanitize and validate product retailers array from request.
     *
     * @param array $retailers Raw array from request (each item: retailerId, stockStatus, productUrl, etc.).
     * @return array Sanitized array safe for storage.
     */
    public static function sanitize_product_retailers( array $retailers ): array {
        $allowed_stock = self::ALLOWED_STOCK_STATUSES;
        $sanitized    = [];

        foreach ( $retailers as $item ) {
            if ( ! is_array( $item ) ) {
                continue;
            }

            $retailer_id   = isset( $item['retailerId'] ) ? absint( $item['retailerId'] ) : 0;
            $stock_status  = isset( $item['stockStatus'] ) && in_array( $item['stockStatus'], $allowed_stock, true )
                ? $item['stockStatus']
                : 'in-stock';
            $regular_price = isset( $item['regularPrice'] ) ? sanitize_text_field( (string) $item['regularPrice'] ) : '';
            $sale_price    = isset( $item['salePrice'] ) ? sanitize_text_field( (string) $item['salePrice'] ) : '';
            $product_url   = isset( $item['productUrl'] ) ? esc_url_raw( trim( (string) $item['productUrl'] ) ) : '';
            $id            = isset( $item['id'] ) ? sanitize_text_field( (string) $item['id'] ) : '';
            $is_best_price = isset( $item['isBestPrice'] ) ? rest_sanitize_boolean( $item['isBestPrice'] ) : false;

            $sanitized[] = [
                'id'           => $id,
                'retailerId'   => $retailer_id > 0 ? $retailer_id : null,
                'stockStatus'  => $stock_status,
                'regularPrice' => $regular_price,
                'salePrice'    => $sale_price,
                'productUrl'   => $product_url,
                'isBestPrice'  => $is_best_price,
            ];
        }

        return $sanitized;
    }
}
