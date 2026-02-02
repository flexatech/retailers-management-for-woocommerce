<?php

defined( 'ABSPATH' ) || exit;

add_action(
    'admin_notices',
    function () {
        if ( ! current_user_can( 'activate_plugins' ) ) {
            return;
        }
        ?>
        <div class="notice notice-error is-dismissible">
            <p>
                <strong>
                    <?php
                    esc_html_e(
                        'It looks like you have another Retailers Management for WooCommerce version installed, please delete it before activating this new version. All of the settings and data are still preserved.',
                        'retailers-management-for-woocommerce'
                    );
                    ?>
                    <a href="#">
                        <?php esc_html_e( 'Read more details.', 'retailers-management-for-woocommerce' ); ?>
                    </a>
                </strong>
            </p>
        </div>
        <?php

        // Safely handle activation flag.
        if (
            isset( $_GET['activate'], $_GET['_wpnonce'] )
            && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'activate-plugin_' . plugin_basename( __FILE__ ) )
        ) {
            unset( $_GET['activate'] );
        }
    }
);
