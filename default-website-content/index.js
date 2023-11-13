// Copyright 1999-2023. Plesk International GmbH. All rights reserved.

import Mustache from 'mustache';
import content from './content.mustache';
import styles from './style.css';

const init = () => {
    document.write(
        Mustache.render(content, {
            public_path: __PUBLIC_PATH__,
            domain_page: __DOMAIN_PAGE__,
            domain_name: location.hostname,
            domain_link: location.protocol + '//' + location.hostname,
            sitejet_promo_url:   
                'https://' +
                location.hostname +
                (location.protocol === 'https:' ? ':8443' : '') + 
                '/modules/notifier/index.php/sitejet-promo',
            plesk_login:
                'https://' +
                location.hostname +
                (location.protocol === 'https:' ? ':8443' : ''),
            styles,
            utm_campaign: __DOMAIN_PAGE__ ? 'plesk_site_default_page_js' : 'plesk_server_default_page_js',
        })
    );
};

document.addEventListener('DOMContentLoaded', () => {
    init();
});
