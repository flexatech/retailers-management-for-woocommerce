<?php
namespace RetailersManagement\Engine;

defined( 'ABSPATH' ) || exit;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\RetailerHelper;

/**
 * One-time data migrations.
 *
 * Runs on plugins_loaded and short-circuits once the stored data version is
 * current, so the work happens only once per site after an update.
 */
class Migrations {
    use SingletonTrait;

    /** Option holding the migrated data-schema version. */
    private const DATA_VERSION_OPTION = 'rmfw_data_version';

    /** Current data-schema version. Bump when adding a new migration step. */
    private const CURRENT_DATA_VERSION = 1;

    /**
     * Legacy (unprefixed) retailer post-meta key => current prefixed constant.
     *
     * @return array<string,string>
     */
    private static function legacy_meta_key_map(): array {
        return [
            'type'         => RetailerHelper::RETAILER_META_TYPE,
            'description'  => RetailerHelper::RETAILER_META_DESCRIPTION,
            'status'       => RetailerHelper::RETAILER_META_STATUS,
            'logo'         => RetailerHelper::RETAILER_META_LOGO,
            'ecommerce_url' => RetailerHelper::RETAILER_META_ECOMMERCE_URL,
            'phone'        => RetailerHelper::RETAILER_META_PHONE,
            'email'        => RetailerHelper::RETAILER_META_EMAIL,
            'address'      => RetailerHelper::RETAILER_META_ADDRESS,
            'latitude'     => RetailerHelper::RETAILER_META_LATITUDE,
            'longitude'    => RetailerHelper::RETAILER_META_LONGITUDE,
        ];
    }

    /** Run any pending migrations. */
    protected function __construct() {
        $installed = (int) get_option( self::DATA_VERSION_OPTION, 0 );

        if ( $installed >= self::CURRENT_DATA_VERSION ) {
            return;
        }

        if ( $installed < 1 ) {
            self::migrate_generic_meta_keys();
        }

        update_option( self::DATA_VERSION_OPTION, self::CURRENT_DATA_VERSION );
    }

    /**
     * Copy legacy unprefixed retailer post-meta to the prefixed rmfw_* keys.
     *
     * Idempotent: skips a post/key when the new key already holds a value, and
     * removes the legacy key only after its value has been copied across.
     *
     * @return void
     */
    private static function migrate_generic_meta_keys(): void {
        $map = self::legacy_meta_key_map();

        $retailer_ids = get_posts(
            [
                'post_type'        => RetailerHelper::RETAILER_POST_TYPE,
                'post_status'      => 'any',
                'numberposts'      => -1,
                'fields'           => 'ids',
                'no_found_rows'    => true,
            ]
        );

        if ( empty( $retailer_ids ) ) {
            return;
        }

        foreach ( $retailer_ids as $retailer_id ) {
            foreach ( $map as $old_key => $new_key ) {
                if ( $old_key === $new_key ) {
                    continue;
                }

                // Don't clobber an already-migrated value.
                $new_value = get_post_meta( $retailer_id, $new_key, true );
                if ( '' !== $new_value && null !== $new_value ) {
                    continue;
                }

                if ( ! metadata_exists( 'post', $retailer_id, $old_key ) ) {
                    continue;
                }

                $old_value = get_post_meta( $retailer_id, $old_key, true );
                update_post_meta( $retailer_id, $new_key, $old_value );
                delete_post_meta( $retailer_id, $old_key );
            }
        }
    }
}
