<?php
namespace RetailersManagement\Engine;

defined( 'ABSPATH' ) || exit;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\RetailerHelper;
use RetailersManagement\Helpers\RetailerTypeHelper;

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
    private const CURRENT_DATA_VERSION = 2;

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

    /**
     * Legacy (unprefixed) retailer_type term-meta key => current prefixed constant.
     *
     * @return array<string,string>
     */
    private static function legacy_term_meta_key_map(): array {
        return [
            'retailer_type_status'   => RetailerTypeHelper::RETAILER_TYPE_META_STATUS,
            'retailer_type_color'    => RetailerTypeHelper::RETAILER_TYPE_META_COLOR,
            'retailer_type_icon_url' => RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL,
        ];
    }

    /** Run any pending migrations. */
    protected function __construct() {
        $installed = (int) get_option( self::DATA_VERSION_OPTION, 0 );

        if ( $installed >= self::CURRENT_DATA_VERSION ) {
            return;
        }

        // Step 1: retailer post-meta. Uses WP_Query, which does not require the
        // post type to be registered, so it can run immediately on
        // plugins_loaded even while WooCommerce is inactive. Record it as done
        // straight away so a deferred step 2 can't force it to re-run.
        if ( $installed < 1 ) {
            self::migrate_generic_meta_keys();
            update_option( self::DATA_VERSION_OPTION, 1 );
        }

        // Step 2: retailer_type term-meta. get_terms() requires the taxonomy to
        // be registered, which happens on `init`. Defer past that and finalize
        // the version there only once the migration actually had a chance to run.
        add_action( 'init', [ self::class, 'migrate_retailer_type_term_meta_keys' ], 20 );
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

    /**
     * Copy legacy unprefixed retailer_type term-meta to the prefixed rmfw_* keys.
     *
     * Runs on `init` (after the taxonomy is registered). Idempotent: skips a
     * term/key when the new key already holds a value, and removes the legacy
     * key only after its value has been copied across. Bumps the stored data
     * version only when the taxonomy is available, so a WooCommerce-inactive
     * request leaves the step pending for a later retry instead of marking it
     * done without migrating.
     *
     * @return void
     */
    public static function migrate_retailer_type_term_meta_keys(): void {
        if ( (int) get_option( self::DATA_VERSION_OPTION, 0 ) >= 2 ) {
            return;
        }

        // Taxonomy not registered (e.g. WooCommerce inactive): can't migrate
        // yet. Leave the version pending and retry on a later request.
        if ( ! taxonomy_exists( RetailerTypeHelper::RETAILER_TYPE_TAXONOMY ) ) {
            return;
        }

        $map = self::legacy_term_meta_key_map();

        $term_ids = get_terms(
            [
                'taxonomy'   => RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
                'hide_empty' => false,
                'fields'     => 'ids',
            ]
        );

        if ( is_wp_error( $term_ids ) ) {
            return;
        }

        foreach ( $term_ids as $term_id ) {
            foreach ( $map as $old_key => $new_key ) {
                if ( $old_key === $new_key ) {
                    continue;
                }

                // Don't clobber an already-migrated value. Check for a real
                // stored row with metadata_exists rather than reading the value:
                // RETAILER_TYPE_META_STATUS registers a `default => true`, so
                // get_term_meta() returns that default even when no row exists
                // and would otherwise skip a genuine migration.
                if ( metadata_exists( 'term', $term_id, $new_key ) ) {
                    continue;
                }

                if ( ! metadata_exists( 'term', $term_id, $old_key ) ) {
                    continue;
                }

                $old_value = get_term_meta( $term_id, $old_key, true );
                update_term_meta( $term_id, $new_key, $old_value );
                delete_term_meta( $term_id, $old_key );
            }
        }

        update_option( self::DATA_VERSION_OPTION, self::CURRENT_DATA_VERSION );
    }
}
